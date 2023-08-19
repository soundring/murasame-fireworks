import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// シーンの作成
export const scene = new THREE.Scene();

//カメラの作成
export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// レンダラーを作成
export const renderer = new THREE.WebGLRenderer();

export const init = () => {
  //カメラセット
  const cameraPosition = new THREE.Vector3(0, 0, 30);
  const cameraTarget = new THREE.Vector3(0, 10, 0);
  camera.position.copy(cameraPosition);
  camera.lookAt(cameraTarget);

  //光源
  const dirLight = new THREE.DirectionalLight(0xffffff, 3); //color,強度
  scene.add(dirLight);

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 背景色の設定
  renderer.setClearColor(0x888888);

  //glbファイルの読み込み
  const loader = new GLTFLoader();
  loader.load(
    '/public/launcher.glb',
    (gltf) => {
      const model = gltf.scene;
      model.position.x = 0;
      model.position.y = 0;
      model.position.z = 0;
      scene.add(model);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  // マウスボタンが押されたかどうかのフラグ
  let mouseDown = false;

  // マウスダウン時のイベントリスナー
  document.addEventListener('mousedown', () => {
    mouseDown = true;
  });

  // マウスアップ時のイベントリスナー
  document.addEventListener('mouseup', () => {
    mouseDown = false;
  });

  // マウス移動時のイベントリスナー
  document.addEventListener('mousemove', (event) => {
    if (mouseDown) {
      // マウスの移動量に応じてカメラを回転させる
      const rotationSpeed = 0.01;
      camera.position.x += event.movementX * rotationSpeed;
      camera.position.y += event.movementY * rotationSpeed;
      camera.lookAt(cameraTarget);
    }
  });
};
