//도형의 질감을 추가하는 방법
import * as THREE from 'three'
import { WEBGL } from './webgl'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

if (WEBGL.isWebGLAvailable()) {
    //장면
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xEEEEEE);

    //카메라
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    //랜더러
    const renderer = new THREE.WebGLRenderer({
        alpha : true,
        antialios : true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    //빛 추가
    const pointLight = new THREE.AmbientLight(0xFFFFFF,1);
    scene.add(pointLight);

    // 컨트롤 추가
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0,50,100);
    controls.update();

    //바닥 추가
    const floorGeometry = new THREE.PlaneGeometry(100,100);
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xd3d3d3, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI/2;
    scene.add(floor);

    const racks = [];  // 랙 그룹 저장
    const rackCells = []; // 클릭 가능한 랙 셀 저장

// 랙 생성 함수 수정
function createRack(x, z) {
    const rackGroup = new THREE.Group();
    const boxSlots = []; // 이 랙의 박스 저장소

    for (let level = 0; level < 5; level++) { //층
        const levelSlots = [];
        for (let row = 0; row < 10; row++) {  //행
            // 랙 프레임만 생성
            const rackGeometry = new THREE.BoxGeometry(3.5, 1.8, 3.5); // 프레임만 표현
            const rackMaterial = new THREE.MeshStandardMaterial({
                 color: 0x00FFFFFF,       // 기본색 흰색
                wireframe: false
                });
            const rack = new THREE.Mesh(rackGeometry, rackMaterial);
            rack.position.set(0, level * 2.2, row * 3.6 - 18); // 랙 간격 조정
            rackGroup.add(rack);
            rackCells.push(rack); // 클릭할 수 있도록 배열에 추가
            // 테두리 선 추가
            const edgeGeometry = new THREE.EdgesGeometry(rackGeometry);
            const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
            const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
            edges.position.copy(rack.position);
            rackGroup.add(edges);

            levelSlots.push(null); // 박스는 아직 없음
        }
        boxSlots.push(levelSlots);
    }
     rackGroup.position.set(x, 1.1, z);
        scene.add(rackGroup);
        racks.push(rackGroup);
}
    // 3개의 랙 추가
    createRack(-30, 0);
    createRack(0, 0);
    createRack(30, 0);

function isCellOccupied(rackIndex, level, row) {
    const rackGroup = racks[rackIndex];
    const targetY = level * 2.2;
    const actualRow = 9 - row;
    const targetZ = actualRow * 3.6 - 18;

    // 해당 위치의 랙 셀 찾기
    const cell = rackGroup.children.find(child =>
        child.isMesh &&
        Math.abs(child.position.y - targetY) < 0.1 &&
        Math.abs(child.position.z - targetZ) < 0.1
    );

    return cell && cell.material.color.getHex() === 0xff0000; // 빨간색이면 true
}
function toggleCellColor(rackIndex, level, row, isAdd) {
    const rackGroup = racks[rackIndex];
    const targetY = level * 2.2;
    const actualRow = 9 - row;
    const targetZ = actualRow * 3.6 - 18;


    // 해당 랙의 자식 중 위치가 일치하는 셀 찾기
    const cell = rackGroup.children.find(child =>
        child.isMesh &&
        Math.abs(child.position.y - targetY) < 0.1 &&
        Math.abs(child.position.z - targetZ) < 0.1
    );

    if (cell) {
        cell.material.color.set(isAdd ? 0xff0000 : 0xffffff);
    } else {
        console.warn('셀을 찾을 수 없습니다.');
    }
}
// --- 전역 상태 변수 ---
let deliveryInProgress = false;
let targetRackIndex = null;
let targetRow = null;
let targetLevel = null;
let isAddMode = false;

let branching = false;
let branchIndex = 0;
let branchTargetReached = false;

document.getElementById('addBtn').addEventListener('click', () => {
    const rack = parseInt(document.getElementById('rackInput').value)-1;
    const row = parseInt(document.getElementById('rowInput').value)-1;
    const level = parseInt(document.getElementById('levelInput').value)-1;

    if (isValidIndex(rack, level, row) && !deliveryInProgress) {
            if (isCellOccupied(rack, level, row)) {
                alert("이미 박스가 존재합니다!");
                return;
            }
        deliveryInProgress = true;
        isAddMode = true;
        targetRackIndex = rack;
        targetRow = row;
        targetLevel = level;

        // 박스 초기화
        movingBox.position.set(-conveyorLength / 2 + 1, 1.75, 30);
        branchIndex = 0;
        branching = false;
        branchTargetReached = false;
    } else {
        alert('잘못된 입력입니다. (랙: 1~3, 행: 1~5, 열: 1~10)');
    }
});

document.getElementById('removeBtn').addEventListener('click', () => {
    const rack = parseInt(document.getElementById('rackInput').value)-1;
    const row = parseInt(document.getElementById('rowInput').value)-1;
    const level = parseInt(document.getElementById('levelInput').value)-1;

    if (isValidIndex(rack, level, row)) {
        toggleCellColor(rack, level, row, false); // false = 빼기 (흰색)
    } else {
        alert('잘못된 입력입니다. (랙: 1~3, 행: 1~5, 열: 1~10)');
    }
});

// 입력값 유효성 검사
function isValidIndex(rack, level, row) {
    return (
        rack >= 0 && rack < 3 &&
        level >= 0 && level < 5 &&
        row >= 0 && row < 10
    );
}

const conveyorLength = 90; // 벨트 길이
const conveyorWidth = 5;   // 벨트 너비
const conveyorHeight = 0.5; // 벨트 높이

// 컨베이어 벨트 geometry
const conveyorGeometry = new THREE.BoxGeometry(conveyorLength, conveyorHeight, conveyorWidth);
const conveyorMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 }); // 색상 조정 가능
const conveyorBelt = new THREE.Mesh(conveyorGeometry, conveyorMaterial);

// 벨트 초기 위치 설정
conveyorBelt.position.set(0, 0.5, 30); // 필요에 따라 위치 조정
// 벨트를 장면에 추가
scene.add(conveyorBelt);

// --- 박스 추가 ---
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const movingBox = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(movingBox);


// 각 랙 앞에 분기 벨트 (Z축 위쪽)
const branchZ = 30; // 랙 앞 거리
const branchLength = 10;

const branches = [-30, 0, 30].map(x => {
    const branch = new THREE.Mesh(
        new THREE.BoxGeometry(conveyorWidth, conveyorHeight, branchLength),
        new THREE.MeshBasicMaterial({ color: 0x555555  })
    );
    branch.position.set(x, 0.5, branchZ - branchLength / 2);
    scene.add(branch);
    return branch;
});
movingBox.position.set(-conveyorLength / 2 + 1, 1.75, 30);
// 박스 초기 위치 (컨베이어 벨트 왼쪽에서 시작)

let phase = 0;
let targetX = [-30, 0, 30];
let branchTimer = 0;

    // 애니메이션 루프
    const clock = new THREE.Clock();
    function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const speed = 10; // 이동 속도

      if (deliveryInProgress) {
          if (!branching) {
              // 메인 벨트 따라 X축 이동
              movingBox.position.x += speed * delta;

              // 목표 위치 도달하면 브랜치 진입
              if (Math.abs(movingBox.position.x - targetX[targetRackIndex]) < 0.5) {
                  branching = true;
              }
          } else {
              // 브랜치로 위쪽 Z축 이동
              const branchEndZ = branchZ - branchLength / 2;
              if (movingBox.position.z > branchEndZ) {
                  movingBox.position.z -= speed * delta;
              } else if (!branchTargetReached) {
                  // 도달하면 셀 색 변경 & 박스 제거
                  branchTargetReached = true;

                  // 셀 색상 토글
                  toggleCellColor(targetRackIndex, targetLevel, targetRow, isAddMode);

                  // 박스 제거
                  scene.remove(movingBox);

                  // 일정 시간 후 박스 리셋
                  setTimeout(() => {
                      movingBox.position.set(-conveyorLength / 2 + 1, 1.75, branchZ);
                      //movingBox.position.z = 30;
                      scene.add(movingBox);

                      // 상태 초기화
            deliveryInProgress = false;
            branching = false;
            branchTargetReached = false;
                  }, 1000);
              }
          }
      }

        renderer.render(scene, camera);

    }
    animate();

    //반응형 처리
    function onWindowResize(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize);


} else {
  var warning = WEBGL.getWebGLErrorMessage();
  document.body.appendChild(warning);
}