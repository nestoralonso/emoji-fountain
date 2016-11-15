'use strict';

import {
  createRectangle,
  createText,
  createCircle,
  createTransform,
  createObject,
  updatePhysics } from './objects'

import {
  randomVector,
  scalarMul
} from './vector';

import {
  randomEmoji,
  randomInt,
  randomColor
} from './utils';

let ctx;

let initCanvas = (canvasNode) => {
  if(canvasNode.getContext) {
    ctx = canvasNode.getContext('2d');
  }
  else {
    console.error('No canvas ctx available');
  }

  return ctx;
};

const NUM_PARTICLES = 20;

// Initialize and array with null, because the map function doesn't
// iterates over undefined
let objects = new Array(NUM_PARTICLES).fill(null);

let SCREEN_WIDTH;
let SCREEN_HEIGHT;
let fullScreen = true;
let start = (canvasNode, fullWidth, fullHeight) => {

  if(!fullScreen) {
    SCREEN_WIDTH = canvasNode.width;
    SCREEN_HEIGHT = canvasNode.height;
  }
  else {
    canvasNode.width = fullWidth;
    canvasNode.height = fullHeight;
    SCREEN_WIDTH = fullWidth;
    SCREEN_HEIGHT = fullHeight;
  }
  ctx = initCanvas(canvasNode);
  objects = objects.map(x => newRandomObject(SCREEN_WIDTH / 2, SCREEN_HEIGHT));
  window.requestAnimationFrame(updateFrame);
};


function randomVelocity() {
  let vel = randomVector(1, 6);
  vel.y = vel.y < 0? vel.y : -vel.y;
  let speed = Math.random() * 16;
  vel = scalarMul(speed, vel);
  vel.y -= 2;

  return vel;
}

function newRandomObject(x, y) {
  let vel = randomVelocity();
  let transform = createTransform({pos: {x, y}, vel, accel: {x:0, y: 0.3}});

  // Simple coin toss
  let shape;
  let randomChoice = Math.random();
  if(randomChoice < 0.05) {
    shape = createCircle(ctx, {radius: 15, fillColor: randomColor(), borderColor: randomColor()});
  }
  else if (randomChoice < 0.95) {
    shape = createText(ctx, {text: randomEmoji(), fillColor: randomColor(), size: randomInt(30, 100)});
  }
  else {
    shape = createRectangle(ctx, {fillColor: randomColor(), borderColor: randomColor()});
  }

  let newObj = createObject(transform, shape);

  return newObj;
}

function randomizeExistingObject(obj, x, y) {
  let vel = randomVelocity();
  obj.transform.pos = {x, y};
  obj.transform.vel = vel;
  obj.transform.active = true;
}

let frameIdx = 0;
function updateFrame() {
  //ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  for(let obj of objects) {
    obj.draw(obj.transform.pos);
    updatePhysics(obj.transform, SCREEN_WIDTH, SCREEN_HEIGHT);
  }

  if(frameIdx % 10 == 0) {
    for(let obj of objects) {
      if(!obj.transform.active) {
        randomizeExistingObject(obj, SCREEN_WIDTH / 2, SCREEN_HEIGHT);
      }
    }
  }

  frameIdx++;
  window.requestAnimationFrame(updateFrame);
}

export default function main() {
  const canvas = document.getElementById('myCanvas');
  const canvasContainer = document.getElementById('canvas-container');
  start(canvas, canvasContainer.clientWidth, canvasContainer.clientHeight);
}
