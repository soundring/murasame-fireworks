import * as THREE from 'three';
import {
  BatchedRenderer,
  IntervalValue,
  ConstantValue,
  ConstantColor,
  PointEmitter,
  ParticleSystem,
  RenderMode,
  ParticleSystemParameters,
  ColorOverLife,
  ColorRange,
  SizeOverLife,
  PiecewiseBezier,
  Bezier,
  FrameOverLife,
} from 'three.quarks';

const addMuzzle = (scene: THREE.Scene): BatchedRenderer => {
  const batchSystem = new BatchedRenderer();
  const texture = new THREE.TextureLoader().load('particle_texture.png');
  // Particle system configuration
  const muzzle: ParticleSystemParameters = {
    duration: 1,
    looping: true,
    startLife: new IntervalValue(0.1, 0.5),
    startSpeed: new ConstantValue(5),
    startSize: new IntervalValue(0.5, 1.5),
    startColor: new ConstantColor(new THREE.Vector4(1, 1, 1, 1)),
    worldSpace: false,

    // maxParticle: 5,
    emissionOverTime: new ConstantValue(20),
    emissionBursts: [
      {
        time: 0,
        count: 1,
        cycle: 1,
        interval: 0.01,
        probability: 1,
      },
    ],

    shape: new PointEmitter(),
    material: new THREE.MeshBasicMaterial({
      map: texture,
      blending: THREE.AdditiveBlending,
      transparent: true,
    }),
    renderMode: RenderMode.BillBoard,
  };

  // Create particle system based on your configuration
  const muzzle1 = new ParticleSystem(muzzle);
  // developers can customize how the particle system works by
  // using existing behavior or adding their own Behavior.
  //   muzzle1.addBehavior(
  //     new ColorOverLife(
  //       new ColorRange(
  //         new THREE.Vector4(1, 0.3882312, 0.125, 1),
  //         new THREE.Vector4(1, 0.826827, 0.3014706, 1)
  //       )
  //     )
  //   );
  //   muzzle1.addBehavior(
  //     new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]]))
  //   );
  // texture atlas animation
  //   muzzle1.addBehavior(
  //     new FrameOverLife(new PiecewiseBezier([[new Bezier(91, 94, 97, 100), 0]]))
  //   );
  muzzle1.emitter.name = 'muzzle1';
  muzzle1.emitter.position.x = 0;

  batchSystem.addSystem(muzzle1);

  // Add emitter to your Object3D
  scene.add(muzzle1.emitter);
  scene.add(batchSystem);

  return batchSystem;
};

export default addMuzzle;
