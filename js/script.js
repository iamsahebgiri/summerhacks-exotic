import "../css/style.css";
import "../css/timeline.css";
import * as THREE from "three";
import zipperImg from "../assets/images/textures/zipper.png";
import rightImg from "../assets/images/textures/right.png";
import leftImg from "../assets/images/textures/left.png";
import frontImg from "../assets/images/textures/front.png";

let camera, scene, renderer;
let world, minecraft;
let hemiLight, dirLight, backLight, isUp;

let container = {
  width: 0,
  height: 0,
};
let mouse = {
  x: {
    current: 0,
    previous: 0,
    calc: 0,
  },
  y: {
    current: 0,
    previous: 0,
    calc: 0,
  },
};

function init() {
  container.width = window.innerWidth;
  container.height = window.innerHeight;

  camera = new THREE.PerspectiveCamera(
    65,
    container.width / container.height,
    1,
    2000
  );
  camera.position.z = 2000;
  camera.position.y = 400;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  world = document.getElementById("minecraft");
  world.appendChild(renderer.domElement);
  const overlay = document.querySelector(".overlay");
  window.addEventListener("load", function () {
    overlay.addEventListener("mousemove", mousemove, false);
    window.addEventListener("resize", onWindowResize, false);
    overlay.addEventListener("mouseup", mouseup, false);
    overlay.addEventListener("mousedown", mousedown, false);
    // overlay.addEventListener("touchend", touchend, { passive: false });
    // overlay.addEventListener("touchmove", touchmove, { passive: false });
  });
}

function onWindowResize() {
  container.width = window.innerWidth;
  container.height = window.innerHeight;
  camera.aspect = container.width / container.height;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function mousemove(e) {
  mouse.x.current = e.clientX;
  mouse.y.current = e.clientY;
  mouse.x.calc = mouse.x.current - container.width / 2;
  mouse.y.calc = mouse.y.current - container.height / 2;
}

function touchend(e) {
  if (isUp) {
    isUp = false;
  } else {
    mousedown(e);
  }
}

function touchmove(e) {
  if (e.touches.length === 1) {
    e.preventDefault();
    (mouse.x.current = e.touches[0].pageX),
      (mouse.y.current = e.touches[0].pageY);
    mouse.x.calc = mouse.x.current - container.width / 2;
    mouse.y.calc = mouse.y.current - container.height / 2;
  }
}

function mouseup(e) {
  isUp = false;
}

function mousedown(e) {
  isUp = true;
}

function addLights() {
  hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);

  dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(200, 200, 200);
  dirLight.castShadow = true;

  backLight = new THREE.DirectionalLight(0xffffff, 0.4);
  backLight.position.set(-200, 200, 50);
  backLight.castShadow = true;

  scene.add(backLight);
  scene.add(hemiLight);
  scene.add(dirLight);
}

function createMinecraft() {
  minecraft = new Minecraft();
  scene.add(minecraft.threegroup);
}

function Minecraft() {
  this.threegroup = new THREE.Group();

  this.informalShoesMat = "#907637";

  this.formalSmokingMat = "#1D2337";
  this.formalLegsMMat = "#0F172A";
  this.formalZipperMat = "#FFF";
  this.formalShoesMat = "#CCC";

  const textureLoader = new THREE.TextureLoader();

  this.skinMat = new THREE.MeshLambertMaterial({
    color: "#e0bea5",
  });

  this.maskMat = new THREE.MeshLambertMaterial({
    color: "#fff",
  });

  const zipperTexture = textureLoader.load(zipperImg);

  this.zipperMat = new THREE.MeshLambertMaterial({
    color: this.formalZipperMat,
    map: zipperTexture,
  });

  this.smokingMat = new THREE.MeshLambertMaterial({
    color: this.formalSmokingMat,
  });

  this.legsMMat = new THREE.MeshLambertMaterial({
    color: this.formalLegsMMat,
  });

  this.shoesMat = new THREE.MeshLambertMaterial({
    color: this.formalShoesMat,
  });

  this.headMat = [
    new THREE.MeshLambertMaterial({
      map: textureLoader.load(rightImg),
    }),
    new THREE.MeshLambertMaterial({
      map: textureLoader.load(leftImg),
    }),
    new THREE.MeshLambertMaterial({ color: "#080808" }),
    new THREE.MeshLambertMaterial({ color: "#ffd79f" }),
    new THREE.MeshLambertMaterial({
      map: textureLoader.load(frontImg),
    }),
    new THREE.MeshLambertMaterial({ color: "#ffd79f" }),
  ];

  //head
  const head = new THREE.BoxGeometry(300, 300, 300);
  this.head = new THREE.Mesh(head, this.headMat);
  this.head.position.x = 0;
  this.head.position.y = 160;
  this.head.position.z = 400;

  // mask
  const mask = new THREE.BoxGeometry(240, 120, 10);
  this.mask = new THREE.Mesh(mask, this.maskMat);
  this.mask.position.x = 0;
  this.mask.position.z = 160;
  this.mask.position.y = -100;

  const maskRight = new THREE.BoxGeometry(40, 20, 10);
  this.maskRight = new THREE.Mesh(maskRight, this.maskMat);
  this.maskRight.position.x = 140;
  this.maskRight.position.z = 160;
  this.maskRight.position.y = -100;

  const maskLeft = new THREE.BoxGeometry(40, 20, 10);
  this.maskLeft = new THREE.Mesh(maskLeft, this.maskMat);
  this.maskLeft.position.x = -140;
  this.maskLeft.position.z = 160;
  this.maskLeft.position.y = -100;

  //body
  const body = new THREE.BoxGeometry(300, 250, 600);
  this.body = new THREE.Mesh(body, this.smokingMat);
  this.body.position.x = 0;
  this.body.position.y = -220;
  this.body.position.z = 100;

  //arms
  const arm = new THREE.BoxGeometry(50, 250, 100);

  this.armLeft = new THREE.Mesh(arm, this.smokingMat);
  this.armLeft.position.x = -170;
  this.armLeft.position.y = 0;
  this.armLeft.position.z = 200;

  this.armRight = new THREE.Mesh(arm, this.smokingMat);
  this.armRight.position.x = 170;
  this.armRight.position.y = 0;
  this.armRight.position.z = 200;

  // hands
  const hand = new THREE.BoxGeometry(50, 50, 50);

  this.handLeft = new THREE.Mesh(hand, this.skinMat);
  this.handLeft.position.x = -170;
  this.handLeft.position.y = -150;
  this.handLeft.position.z = 220;

  this.handRight = new THREE.Mesh(hand, this.skinMat);
  this.handRight.position.x = 170;
  this.handRight.position.y = -150;
  this.handRight.position.z = 220;

  //zipper
  const zipper = new THREE.BoxGeometry(80, 250, 10);
  this.zipper = new THREE.Mesh(zipper, this.zipperMat);
  this.zipper.position.x = 0;
  this.zipper.position.y = 0;
  this.zipper.position.z = 300;

  //legs
  const legs = new THREE.BoxGeometry(200, 300, 300);
  this.legs = new THREE.Mesh(legs, this.smokingMat);
  this.legs.position.x = 0;
  this.legs.position.y = -200;
  this.legs.position.z = 100;

  //legsMiddle
  const legsM = new THREE.BoxGeometry(10, 130, 5);
  this.legsM = new THREE.Mesh(legsM, this.legsMMat);
  this.legsM.position.x = 0;
  this.legsM.position.y = -280;
  this.legsM.position.z = 248;

  //shoes
  const shoes = new THREE.BoxGeometry(200, 50, 400);
  this.shoes = new THREE.Mesh(shoes, this.shoesMat);
  this.shoes.position.x = 0;
  this.shoes.position.y = -400;
  this.shoes.position.z = 100;

  this.head.add(this.mask);
  this.head.add(this.maskRight);
  this.head.add(this.maskLeft);

  this.body.add(this.armLeft);
  this.body.add(this.armRight);
  this.body.add(this.zipper);
  this.body.add(this.handLeft);
  this.body.add(this.handRight);
  this.body.add(this.legs);
  this.body.add(this.legsM);
  this.body.add(this.shoes);

  this.threegroup.add(this.head);
  this.threegroup.add(this.body);

  this.update = function () {
    //move body
    this.bodyRY = calc(mouse.x.calc, -400, 400, -Math.PI / 20, Math.PI / 20);
    this.bodyRX = calc(mouse.y.calc, -400, 400, -Math.PI / 90, Math.PI / 90);
    //move head
    this.headRY = calc(mouse.x.calc, -200, 200, -Math.PI / 4, Math.PI / 4);
    this.headRX = calc(mouse.y.calc, -200, 200, -Math.PI / 4, Math.PI / 4);

    this.rotate(10);
  };

  this.rotate = function (speed) {
    if (isUp) {
      world.classList.add("noBreathe");
      this.shoes.material.color = new THREE.Color(this.informalShoesMat);

      this.mask.visible = false;
      this.maskLeft.visible = false;
      this.maskRight.visible = false;
    } else {
      world.classList.remove("noBreathe");

      this.shoes.material.color = new THREE.Color(this.formalShoesMat);

      this.mask.visible = true;
      this.maskLeft.visible = true;
      this.maskRight.visible = true;
    }

    this.body.rotation.y += (this.bodyRY - this.body.rotation.y) / speed;
    this.body.rotation.x += (this.bodyRX - this.body.rotation.x) / speed;
    this.head.scale.x = this.head.scale.y = this.head.scale.z = 1;
    this.head.rotation.y += (this.headRY - this.head.rotation.y) / speed;
    this.head.rotation.x += (this.headRX - this.head.rotation.x) / speed;
  };
}

function calc(v, vmin, vmax, tmin, tmax) {
  var nv = Math.max(Math.min(v, vmax), vmin);
  var dv = vmax - vmin;
  var pc = (nv - vmin) / dv;
  var dt = tmax - tmin;
  var tv = tmin + pc * dt;
  return tv;
}

function loop() {
  renderer.render(scene, camera);
  minecraft.update();
  requestAnimationFrame(loop);
}

function displayConsole() {
  console.log(
    "%cSummerHacks Easter Egg",
    'background: red; padding: 2px 8px; font-weight: bold; color: white; font-size: 1.5rem; text-transform: uppercase; font-family: "Barlow";'
  );
  console.log(
    "%c🎉 Click me to remove my mask. 🎉",
    "font-size: 1rem; font-family: 'Inter', 'arial';"
  );
  console.log(
    "\n%cNOTE",
    "background-color: black; padding: 2px 6px; color: white;"
  );
  console.log(
    "Click doesn't work if responsive device toolbar in enabled. This is done to prevent scrolling issues in smartphone."
  );
}

init();
addLights();
createMinecraft();
loop();
displayConsole();
