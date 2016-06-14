'use strict';

export function vLength({x, y}) {
  let length = Math.sqrt(x * x + y * y);
  return length;
}

export function normalize(v) {
  length = vLength(v)
  return {
    x: v.x / length,
    y: v.y / length
  }
}

export function randomVector(xRange=2, yRange=2) {
  let x = -(xRange / 2) + Math.random() * xRange;
  let y = -(yRange / 2) + Math.random() * yRange;

  let res = normalize({x, y});
  return res;
}

export function scalarMul(scalar, v) {
  return {x: scalar * v.x, y: scalar * v.y};
}
