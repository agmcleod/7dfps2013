var Game = Class.extend({
  init: function() {
    this.objects = [];
    this.bullets = [];
    this.mouse = {};
    this.time = Date.now();
    document.addEventListener('mousedown', this.shoot.bind(this), false);
  },

  animate: function() {
    requestAnimationFrame(this.animate.bind(this));

    this.controls.isOnObject(false);

    this.ray.ray.origin.copy(this.controls.getObject().position);
    this.ray.ray.origin.y -= 10;

    var intersections = this.ray.intersectObjects(this.objects);

    if (intersections.length > 0) {
      var distance = intersections[ 0 ].distance;
      if ( distance > 0 && distance < 10 ) {
        this.controls.isOnObject( true );
      }
    }

    this.update(Date.now() - this.time);
  },

  load: function() {
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

    var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
    light.position.set( 1, 1, 1 );
    this.scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff, 0.75 );
    light.position.set( -1, - 0.5, -1 );
    this.scene.add( light );

    this.projector = new THREE.Projector();

    this.controls = new THREE.PointerLockControls( this.camera );
    this.scene.add( this.controls.getObject() );

    this.ray = new THREE.Raycaster();
    this.ray.ray.direction.set( 0, -1, 0 );

    this.loadFloor();
    this.loadObjects();
    this.loadEnemies();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild(this.renderer.domElement);
    var _this = this;
    window.addEventListener( 'resize', function() {
      _this.onWindowResize()
    }, false );
  },

  loadEnemies: function() {
    this.enemies = [
      new Enemy(30, 10, 20)
    ];

    for(var i = 0; i < this.enemies.length; i++) {
      this.scene.add(this.enemies[i].mesh);
    }
  },

  loadFloor: function() {
    this.geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
    this.geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

    for ( var i = 0, l = this.geometry.vertices.length; i < l; i ++ ) {
      var vertex = this.geometry.vertices[ i ];
      vertex.x += Math.random() * 20 - 10;
      vertex.y += Math.random() * 2;
      vertex.z += Math.random() * 20 - 10;
    }

    for ( var i = 0, l = this.geometry.faces.length; i < l; i ++ ) {
      var face = this.geometry.faces[ i ];
      face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
      face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
      face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
      face.vertexColors[ 3 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
    }

    this.material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

    var mesh = new THREE.Mesh( this.geometry, this.material );
    this.scene.add(mesh);
  },

  loadObjects: function() {
    this.geometry = new THREE.CubeGeometry( 20, 20, 20 );

    for ( var i = 0, l = this.geometry.faces.length; i < l; i ++ ) {

      var face = this.geometry.faces[ i ];
      face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
      face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
      face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
      face.vertexColors[ 3 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
    }

    for ( var i = 0; i < 10; i ++ ) {
      this.material = new THREE.MeshPhongMaterial( { specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

      var mesh = new THREE.Mesh(this.geometry, this.material);
      mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
      mesh.position.y = Math.floor( Math.random() * 5 ) * 20 + 10;
      mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
      this.scene.add( mesh );

      this.material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

      this.objects.push( mesh );
    }
  },

  onWindowResize: function() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
  },

  rotateAroundWorldAxis: function(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis, radians);
    rotWorldMatrix.multiply(object.matrix);
    object.matrix = rotWorldMatrix;
    object.rotation.setEulerFromRotationMatrix(object.matrix);
  },

  shoot: function() {
    if(this.controls && this.controls.enabled) {
      var b = new Bullet();
      this.bullets.push(b);
      this.scene.add(b.mesh);
    }
  },

  update: function(delta) {
    this.controls.update(delta);
    this.renderer.render(this.scene, this.camera);

    for(var i = this.bullets.length-1; i >= 0; i--) {
      var bullet = this.bullets[i];
      var remove = bullet.update(delta);
      if(remove) {
        this.scene.remove(bullet.mesh);
        this.bullets.splice(i, 1);
      }
    }
    this.time = Date.now();
  }
});