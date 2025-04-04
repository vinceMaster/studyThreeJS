//도형의 질감을 추가하는 방법
import * as THREE from 'three'
import { WEBGL } from './webgl'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

if (WEBGL.isWebGLAvailable()) {

    //장면
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    //카메라
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    //랜더러
    const renderer = new THREE.WebGLRenderer({
        alpha : true,
        antialios : true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    // 컨트롤 추가
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0,50,100);
    controls.update();

    //빛
    const pointLight = new THREE.PointLight(0xffffff,1);
    pointLight.position.set(10,20,10).normalize();
    scene.add(pointLight);

    //바닥 추가
    const floorGeometry = new THREE.PlaneGeometry(100,100);
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xd3d3d3, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI/2;
    scene.add(floor);

    // 랙 추가 함수
    function createRack(x, z) {
    const rackGroup = new THREE.Group();
    const rackMaterial = new THREE.MeshStandardMaterial({ color: 0xFF7F00, wireframe: false });

    for (let j = 0; j < 5; j++) {
        for (let i = 0; i < 10; i++) {
            const rackGeometry = new THREE.BoxGeometry(4, 2, 4);
            const rack = new THREE.Mesh(rackGeometry, rackMaterial);
            rack.position.set(0, j * 2.2, i * 5 - 25); // 수직으로 쌓기
            rackGroup.add(rack);
        }
    }
    rackGroup.position.set(x, 0, z);
    scene.add(rackGroup);
}

    // 3개의 랙 추가
    createRack(-30, 0);
    createRack(0, 0);
    createRack(30, 0);

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