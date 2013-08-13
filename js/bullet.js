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
    var pitch = game.controls.pitchObject;
    var vector = new THREE.Vector3(
      yaw.position.x * Math.cos(pitch.rotation.x),
      yaw.position.y * Math.sin(yaw.rotation.y),
      0
    );
    var dir = vector.sub(yaw.position).normalize();
    this.ray = new THREE.Raycaster(yaw.position.clone(), dir);
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
Bullet.speed = 0.2; //5
Bullet.geometry = new THREE.SphereGeometry(2, 15, 15);
Bullet.material = new THREE.MeshLambertMaterial(
  {
    color: 0xff0000
  }
);