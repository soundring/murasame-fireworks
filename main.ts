import * as THREE from 'three';

import { scene, camera, renderer, init } from './init';

import { particleMesh, FireworksParticle } from './particle';
import addMuzzle from './quark_example';

init();

// three.quarks テスト用
const batchSystem = addMuzzle(scene);

let time = 0;
const endTime = 2;
const clock = new THREE.Clock();

// 球体作成
const sphereGeometry = new THREE.SphereGeometry(0.13);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x6699ff,
  roughness: 0.4,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.y = 0;

scene.add(sphere);

// パーティクルクラスのインスタンス
let particleInstance: FireworksParticle;

// setTimeoutが連続で実行されないようにするフラグ
let timeoutFlag = false;

const resetScene = () => {
  sphere.scale.set(1, 1, 1);
  sphere.position.y = 0;
  time = 0;
  scene.remove(particleMesh);
  timeoutFlag = false;
};

const animate = () => {
  time += 0.01;

  if (time > endTime && !timeoutFlag) {
    timeoutFlag = true;
    particleInstance = new FireworksParticle({
      startPosition: sphere.position,
      radius: 10,
      quantity: 2000,
      gravity: 20,
    });
    particleInstance.createParticle({ scene });
    setTimeout(() => {
      resetScene();
    }, 2000);
    sphere.scale.set(0, 0, 0);
  } else {
    sphere.position.y += 0.09;
  }

  if (particleInstance) {
    const elapesedTime = (time - endTime) * 0.6;
    particleInstance.updateParticle(elapesedTime);
  }

  // three.quarks テスト用
  batchSystem.update(clock.getDelta());

  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);
