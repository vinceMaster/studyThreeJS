//도형의 재질을 추가하는 방법
import * as THREE from 'three'
import { WEBGL } from './webgl'

if (WEBGL.isWebGLAvailable()) {

    //장면
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    //카메라
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;

    //랜더러
    const renderer = new THREE.WebGLRenderer({
        alpha : true,
        antialios : true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    //빛
    const pointLight = new THREE.PointLight(0xffffff,1);
    pointLight.position.set(0,2,12);
    scene.add(pointLight);

    //도형 추가
    const geometry = new THREE.TorusGeometry(0.3,0.15,16,40);

    const material01 = new THREE.MeshBasicMaterial({
        color:0xFF7F00
    });
    const obj01 = new THREE.Mesh(geometry, material01);
    obj01.position.x = -2;
    scene.add(obj01);

    const material02 = new THREE.MeshStandardMaterial({
        color:0xFF7F00,
/*        metalness : 0.6,
        roughness : 0.4,
        wireframe : true*/
/*        transparent : true,
        opacity : 0.5*/
    });
    const obj02 = new THREE.Mesh(geometry, material02);
    obj02.position.x = -1;
    scene.add(obj02);

    const material03 = new THREE.MeshPhysicalMaterial({
        color:0xFF7F00,
        clearcoat : 1, // 반사율을 높힘, 차량 유리막코팅한부분과 비슷하게 반딱반딱해짐
        clearcoatRoughness : 0.1
    });
    const obj03 = new THREE.Mesh(geometry, material03);
    obj03.position.x = -0;
    scene.add(obj03);

    const material04 = new THREE.MeshLambertMaterial({
        color:0xFF7F00
    });
    const obj04 = new THREE.Mesh(geometry, material04);
    obj04.position.x = 1;
    scene.add(obj04);

    const material05 = new THREE.MeshPhongMaterial({
        color:0xFF7F00,
        shininess : 120,
        specular : 0x004fff
    });
    const obj05 = new THREE.Mesh(geometry, material05);
    obj05.position.x = 2;
    scene.add(obj05);

    function render(time){
        time *= 0.001;

        obj01.rotation.y += 0.01;
        obj02.rotation.y += 0.01;
        obj03.rotation.y += 0.01;
        obj04.rotation.y += 0.01;
        obj05.rotation.y += 0.01;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

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