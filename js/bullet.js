var Bullet = Class.extend({
  init: function() {
    this.mesh = new THREE.Mesh(Bullet.geometry, Bullet.material);
    var yaw = game.controls.getObject();
    this.mesh.position = new THREE.Vector3(yaw.position.x, yaw.position.y, yaw.position.z);
    this.setupTarget();
    this.time = Date.now();
  },

  setupTarget: function() {
    var yaw = game.controls.getObject();
    this.ray = new THREE.Raycaster(yaw.position.clone(), game.controls.getDirection());
  },

  update: function(delta) {
    var direction = this.ray.ray.direction;
    this.mesh.translateX(direction.x * Bullet.speed);
    this.mesh.translateZ(direction.z * Bullet.speed);
    this.mesh.translateY(direction.y * Bullet.speed);
    return Date.now() - this.time > Bullet.maxage;
  }
});

Bullet.maxage = 10000;
Bullet.speed = 5;
Bullet.geometry = new THREE.SphereGeometry(2, 15, 15);
Bullet.material = new THREE.MeshLambertMaterial(
  {
    color: 0xff0000
  }
);