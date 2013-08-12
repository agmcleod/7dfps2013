var Bullet = Class.extend({
  init: function() {
    this.mesh = new THREE.Mesh(Bullet.geometry, Bullet.material);
    var yaw = game.controls.getObject();
    var pitch = game.controls.pitchObject;
    this.mesh.position = new THREE.Vector3(yaw.position.x, yaw.position.y, yaw.position.z);
    //game.rotateAroundWorldAxis(this.mesh, new THREE.Vector3(1, 0, 0), pitch.rotation.x);
    //game.rotateAroundWorldAxis(this.mesh, new THREE.Vector3(0, 1, 0), yaw.rotation.y);
    this.setupTarget();
    this.time = Date.now();
  },

  setupTarget: function() {
    var vector = new THREE.Vector3(game.mouse.x, game.mouse.y, 0.5);
    game.projector.unprojectVector(vector, game.camera);
    var yaw = game.controls.getObject();
    var dir = vector.sub(yaw.position).normalize();
    this.ray = new THREE.Raycaster(yaw.position, dir);
    //var distance = - game.camera.position.z / dir.z;
    //this.target = game.camera.position.clone().add(dir.multiplyScalar(distance));
  },

  update: function(delta) {
    var direction = this.ray.ray.direction;
    this.mesh.translateX(direction.x * Bullet.speed);
    this.mesh.translateZ(direction.z * Bullet.speed);
    this.mesh.translateY(direction.y * Bullet.speed);
    return Date.now() - this.time > Bullet.maxage;
  }
});

Bullet.maxage = 2000;
Bullet.speed = 1.5; //0.7
Bullet.geometry = new THREE.SphereGeometry(2, 15, 15);
Bullet.material = new THREE.MeshLambertMaterial(
  {
    color: 0xff0000
  }
);