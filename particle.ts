import * as THREE from 'three';
import { scene } from './init';

export let particleMesh: THREE.Points;

const randomFireworkColor = () => {
  const colors = [
    { r: 1, g: 0, b: 0 }, // 赤
    { r: 1, g: 0.5, b: 0 }, // オレンジ
    { r: 1, g: 1, b: 0 }, // 黄色
    { r: 1, g: 0.75, b: 0.8 }, // ピンク
    { r: 0, g: 0, b: 1 }, // 青
    { r: 0, g: 1, b: 0 }, // 緑
    { r: 0.5, g: 0, b: 0.5 }, // 紫
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

export class FireworksParticle {
  private startPosition: THREE.Vector3;
  private geometry: THREE.BufferGeometry;
  private quantity: number;
  private gravity: number;
  private radius: number;
  private material: THREE.PointsMaterial;
  private targetPositions: THREE.Vector3[];
  private positionBufferAttr: THREE.Float32BufferAttribute;

  public constructor({
    startPosition,
    radius,
    quantity,
    gravity,
  }: {
    startPosition: THREE.Vector3;
    radius: number;
    quantity: number;
    gravity: number;
  }) {
    this.startPosition = startPosition.clone();
    this.geometry = new THREE.BufferGeometry();
    this.quantity = quantity;
    this.gravity = gravity;
    this.radius = radius;
    this.positionBufferAttr = new THREE.Float32BufferAttribute(
      new Float32Array(quantity * 3),
      3
    );
    this.targetPositions = [];

    this.initParticleInfo();
  }

  private initParticleInfo(): void {
    // 色情報を格納する配列
    const colors: number[] = [];

    // 配置する範囲
    const SIZE = this.radius;
    const LENGTH = this.quantity;

    for (let i = 0; i < LENGTH; i++) {
      const pos = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      );
      pos.normalize();
      pos.multiplyScalar(SIZE);
      pos.add(this.startPosition);

      this.targetPositions.push(pos);

      // ランダムな色を生成
      const fireworkColor = randomFireworkColor();
      colors.push(fireworkColor.r, fireworkColor.g, fireworkColor.b);
    }

    // 場所設定
    this.geometry.setAttribute('position', this.positionBufferAttr);

    // 色設定
    this.geometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    );

    // テクスチャ読み込み
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/public/particle_texture.png');

    // マテリアルを作成
    this.material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8,
      map: texture,
    });
  }

  public createParticle({ scene }: { scene: THREE.Scene }): void {
    // 物体を作成
    particleMesh = new THREE.Points(this.geometry, this.material);

    scene.add(particleMesh);
  }

  public updateParticle(normalizedTime: number): void {
    this.targetPositions.forEach((tPos, index) => {
      const currentPos = new THREE.Vector3()
        .copy(this.startPosition)
        .lerp(tPos, normalizedTime);
      const gravityDisplacement = new THREE.Vector3(
        0,
        -0.5 * normalizedTime * normalizedTime * this.gravity,
        0
      );
      currentPos.add(gravityDisplacement);
      this.positionBufferAttr.setXYZ(
        index,
        currentPos.x,
        currentPos.y,
        currentPos.z
      );
    });
    this.positionBufferAttr.needsUpdate = true;
    this.geometry.computeBoundingBox();
    this.geometry.computeBoundingSphere();
  }
}
