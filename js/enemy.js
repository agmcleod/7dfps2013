var Enemy = Class.extend({
  init: function(x, y, z) {
    this.mesh = new THREE.Mesh(Enemy.geometry, Enemy.material);
    this.mesh.position = new THREE.Vector3(x, y, z);
  }
});

Enemy.geometry = new THREE.SphereGeometry(8, 80, 80);

Enemy.material = new THREE.MeshPhongMaterial(
  { 
    color: 0x33aa33,
    specular: 0xffffff,
    shading: THREE.FlatShading,
    vertexColors: THREE.VertexColors
  }
);