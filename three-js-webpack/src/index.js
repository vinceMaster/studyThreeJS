import * as THREE from 'three'
import { WEBGL } from './webgl'

if (WEBGL.isWebGLAvailable()) {
//여기에 코드를 넣는다
console.log(THREE);
} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}