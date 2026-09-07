import * as THREE from "three";
import { createClouds, createFoamLip, createSun, createWater, createWaveWall } from "./models.js";

export class World {
  constructor(scene) {
    this.scene = scene;
    this.water = createWater();
    this.wall = createWaveWall();
    this.foam = createFoamLip();
    this.clouds = createClouds();
    this.sun = createSun();
    scene.add(this.water, this.wall, this.foam, this.clouds, this.sun);

    const hemi = new THREE.HemisphereLight("#bfe9ff", "#0b4f78", 1.2);
    const sunLight = new THREE.DirectionalLight("#fff1c9", 1.45);
    sunLight.position.set(-12, 18, 8);
    sunLight.castShadow = true;
    const fill = new THREE.DirectionalLight("#9fe8ff", 0.55);
    fill.position.set(6, 8, 12);
    scene.add(hemi, sunLight, fill, new THREE.AmbientLight("#9fd7ff", 0.35));

    scene.background = new THREE.Color("#73c7ff");
    scene.fog = new THREE.Fog("#73c7ff", 38, 120);
  }

  update(time, scrollSpeed, dt) {
    const offset = (this.water.material.uniforms.uOffset.value + scrollSpeed * dt * 0.12) % 1000;
    this.water.material.uniforms.uTime.value = time;
    this.water.material.uniforms.uOffset.value = offset;
    this.wall.material.uniforms.uTime.value = time;
    this.wall.material.uniforms.uOffset.value = offset;
    this.clouds.position.z += dt * 1.4;
    if (this.clouds.position.z > 20) this.clouds.position.z = 0;
  }
}
