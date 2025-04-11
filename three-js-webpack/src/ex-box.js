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

document.getElementById('addBtn').addEventListener('click', () => {
    const rack = parseInt(document.getElementById('rackInput').value)-1;
    const row = parseInt(document.getElementById('rowInput').value)-1;
    const level = parseInt(document.getElementById('levelInput').value)-1;

    if (isValidIndex(rack, level, row)) {
        toggleCellColor(rack, level, row, true); // true = 넣기 (빨간색)
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

    // 애니메이션 루프
    function animate() {
        requestAnimationFrame(animate);
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