//도형의 질감을 추가하는 방법
import * as THREE from 'three'
import { WEBGL } from './webgl'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';

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

    //texture 추가
    const textureLoader = new THREE.TextureLoader();
    const textureBaseColor = textureLoader.load('../static/img/Metal_007_basecolor.png');
    const textureNormalMap = textureLoader.load('../static/img/Metal_007_normal.png');
    const textureHeightMap = textureLoader.load('../static/img/Metal_007_height.png');
    const textureRoughnessMap = textureLoader.load('../static/img/Metal_007_roughness.png');

    //도형 추가
    const geometry = new THREE.BoxGeometry(0.5,0.5,0.5);

    const material01 = new THREE.MeshBasicMaterial({
        map : textureBaseColor
    });
    const obj01 = new THREE.Mesh(geometry, material01);
    obj01.position.x = -2;
    scene.add(obj01);

    const material02 = new THREE.MeshStandardMaterial({
        map : textureBaseColor,
        normalMap : textureNormalMap
    });
    const obj02 = new THREE.Mesh(geometry, material02);
    obj02.position.x = -1;
    scene.add(obj02);

    const material03 = new THREE.MeshStandardMaterial({
        map : textureBaseColor,
        normalMap : textureNormalMap,
        displacementMap : textureHeightMap,
        displacementScale : 0.05
    });
    const obj03 = new THREE.Mesh(geometry, material03);
    obj03.position.x = -0;
    scene.add(obj03);

    const material04 = new THREE.MeshStandardMaterial({
        map : textureBaseColor,
        normalMap : textureNormalMap,
        displacementMap : textureHeightMap,
        displacementScale : 0.03,
        roughnessMap : textureRoughnessMap
    });
    const obj04 = new THREE.Mesh(geometry, material04);
    obj04.position.x = 1;
    scene.add(obj04);

    const material05 = new THREE.MeshPhongMaterial({
        color:0xFF7F00,
        shininess : 120,
        specular : 0x004fff,

    });
    const obj05 = new THREE.Mesh(geometry, material05);
    obj05.position.x = 2;
    scene.add(obj05);

    function render(time){
/*        time *= 0.001;

        obj01.rotation.y += 0.01;
        obj02.rotation.y += 0.01;
        obj03.rotation.y += 0.01;
        obj04.rotation.y += 0.01;
        obj05.rotation.y += 0.01;*/

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