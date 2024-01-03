import * as THREE from "three";

/**
 * Этот файл не нужен, тестировал шейдеры для крутой анимации,
 * но оказалось слишком долго делать... забил на это
 * */

const vertexShader = `
  attribute float size;
  varying vec3 vColor;

  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;

  void main() {
    if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.5) {
      discard;
    }
    gl_FragColor = vec4(vColor, 1.0);
  }
`;


export const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    alphaTest: 0.5,
    depthWrite: false
});
