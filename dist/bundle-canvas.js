(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = main;

var _objects = require('./objects');

var _vector = require('./vector');

var _utils = require('./utils');

var ctx = void 0;

var initCanvas = function initCanvas(canvasNode) {
  if (canvasNode.getContext) {
    ctx = canvasNode.getContext('2d');
  } else {
    console.error('No canvas ctx available');
  }

  return ctx;
};

var NUM_PARTICLES = 200;

// Initialize and array with null, because the map function doesn't
// iterates over undefined
var objects = new Array(NUM_PARTICLES).fill(null);

var SCREEN_WIDTH = void 0;
var SCREEN_HEIGHT = void 0;
var fullScreen = true;
var start = function start(canvasNode, fullWidth, fullHeight) {

  if (!fullScreen) {
    SCREEN_WIDTH = canvasNode.width;
    SCREEN_HEIGHT = canvasNode.height;
  } else {
    console.log(fullWidth);
    canvasNode.width = fullWidth;
    canvasNode.height = fullHeight;
    SCREEN_WIDTH = fullWidth;
    SCREEN_HEIGHT = fullHeight;
  }
  ctx = initCanvas(canvasNode);
  console.log('DEBUG ctx', ctx);
  objects = objects.map(function (x) {
    return newRandomObject(SCREEN_WIDTH / 2, SCREEN_HEIGHT);
  });
  window.requestAnimationFrame(updateFrame);
};

function randomVelocity() {
  var vel = (0, _vector.randomVector)(1, 6);
  vel.y = vel.y < 0 ? vel.y : -vel.y;
  var speed = Math.random() * 16;
  vel = (0, _vector.scalarMul)(speed, vel);
  vel.y -= 2;

  return vel;
}

function newRandomObject(x, y) {
  var vel = randomVelocity();
  var transform = (0, _objects.createTransform)({ pos: { x: x, y: y }, vel: vel, accel: { x: 0, y: 0.3 } });

  // Simple coin toss
  var shape = void 0;
  var randomChoice = Math.random();
  if (randomChoice < 0.05) {
    shape = (0, _objects.createCircle)(ctx, { radius: 15, fillColor: (0, _utils.randomColor)(), borderColor: (0, _utils.randomColor)() });
  } else if (randomChoice < 0.95) {
    shape = (0, _objects.createText)(ctx, { text: (0, _utils.randomEmoji)(), fillColor: (0, _utils.randomColor)(), size: (0, _utils.randomInt)(30, 100) });
  } else {
    shape = (0, _objects.createRectangle)(ctx, { fillColor: (0, _utils.randomColor)(), borderColor: (0, _utils.randomColor)() });
  }

  var newObj = (0, _objects.createObject)(transform, shape);

  return newObj;
}

function randomizeExistingObject(obj, x, y) {
  var vel = randomVelocity();
  obj.transform.pos = { x: x, y: y };
  obj.transform.vel = vel;
  obj.transform.active = true;
}

var frameIdx = 0;
function updateFrame() {
  // ctx.globalCompositeOperation = 'destination-over';
  // ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _obj = _step.value;

      _obj.draw(_obj.transform.pos);
      (0, _objects.updatePhysics)(_obj.transform, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (frameIdx % 10 == 0) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = objects[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var obj = _step2.value;

        if (!obj.transform.active) {
          randomizeExistingObject(obj, SCREEN_WIDTH / 2, SCREEN_HEIGHT);
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }

  frameIdx++;
  window.requestAnimationFrame(updateFrame);
}

function main() {
  var canvas = document.getElementById('myCanvas');
  var canvasContainer = document.getElementById('canvas-container');
  // canvas.addEventListener('click', (e) => { newRandomObject(e.offsetX, e.offsetY); });
  start(canvas, canvasContainer.clientWidth, canvasContainer.clientHeight);
}

},{"./objects":2,"./utils":3,"./vector":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRectangle = createRectangle;
exports.createCircle = createCircle;
exports.createText = createText;
exports.createTransform = createTransform;
exports.createObject = createObject;
exports.updatePhysics = updatePhysics;
var PI2 = 2 * Math.PI;

function createRectangle(ctx) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 30 : _ref$width;
  var _ref$height = _ref.height;
  var height = _ref$height === undefined ? 30 : _ref$height;
  var _ref$borderWidth = _ref.borderWidth;
  var borderWidth = _ref$borderWidth === undefined ? 5 : _ref$borderWidth;
  var _ref$fillColor = _ref.fillColor;
  var fillColor = _ref$fillColor === undefined ? [200, 220, 255, 0.9] : _ref$fillColor;
  var _ref$borderColor = _ref.borderColor;
  var borderColor = _ref$borderColor === undefined ? [80, 80, 155, 0.9] : _ref$borderColor;


  var draw = function draw(pos) {
    ctx.fillStyle = 'rgba(' + fillColor.join(',') + ')';
    ctx.fillRect(pos.x, pos.y, width, height);
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = 'rgba(' + borderColor.join(',') + ')';
    ctx.strokeRect(pos.x, pos.y, width, height);
  };

  return {
    draw: draw
  };
}

function createCircle(ctx) {
  var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref2$radius = _ref2.radius;
  var radius = _ref2$radius === undefined ? 20 : _ref2$radius;
  var _ref2$borderWidth = _ref2.borderWidth;
  var borderWidth = _ref2$borderWidth === undefined ? 5 : _ref2$borderWidth;
  var _ref2$fillColor = _ref2.fillColor;
  var fillColor = _ref2$fillColor === undefined ? [250, 220, 255, 0.9] : _ref2$fillColor;
  var _ref2$borderColor = _ref2.borderColor;
  var borderColor = _ref2$borderColor === undefined ? [155, 80, 155, 0.9] : _ref2$borderColor;


  var draw = function draw(pos) {
    ctx.fillStyle = 'rgba(' + fillColor.join(',') + ')';

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, PI2);
    ctx.fill();
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = 'rgba(' + borderColor.join(',') + ')';

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, PI2);
    ctx.stroke();
  };

  return {
    draw: draw
  };
}

function createText(ctx) {
  var _ref3 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref3$size = _ref3.size;
  var size = _ref3$size === undefined ? 20 : _ref3$size;
  var _ref3$text = _ref3.text;
  var text = _ref3$text === undefined ? 'M' : _ref3$text;
  var _ref3$fillColor = _ref3.fillColor;
  var fillColor = _ref3$fillColor === undefined ? [250, 220, 255, 1] : _ref3$fillColor;


  var draw = function draw(pos) {
    ctx.fillStyle = 'rgba(' + fillColor.join(',') + ')';
    ctx.font = size + 'px sanserif';
    ctx.fillText(text, pos.x, pos.y);
  };

  return {
    draw: draw
  };
}

function createTransform() {
  var _ref4 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref4$pos = _ref4.pos;
  var pos = _ref4$pos === undefined ? { x: 0, y: 0 } : _ref4$pos;
  var _ref4$vel = _ref4.vel;
  var vel = _ref4$vel === undefined ? { x: 0, y: 0 } : _ref4$vel;
  var _ref4$accel = _ref4.accel;
  var accel = _ref4$accel === undefined ? { x: 0, y: 0 } : _ref4$accel;
  var _ref4$active = _ref4.active;
  var active = _ref4$active === undefined ? true : _ref4$active;


  return {
    pos: pos,
    vel: vel,
    accel: accel,
    active: active
  };
}

function createObject(transform, shape) {
  return {
    transform: transform,
    draw: shape.draw
  };
}

function updatePhysics(transform, screenWidth, screenHeight) {

  if (!transform.active) return;

  if (transform.pos.y < 0 || transform.pos.y > screenHeight + 70) {
    transform.active = false;
    return;
  }

  transform.pos.x += transform.vel.x;
  transform.pos.y += transform.vel.y;

  transform.vel.x += transform.accel.x;
  transform.vel.y += transform.accel.y;
}

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomInt = randomInt;
exports.randomEmoji = randomEmoji;
exports.randomColor = randomColor;
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomEmoji() {
  var min = 0x1F300;
  var max = 0x1F5FF;

  return String.fromCodePoint(randomInt(min, max));
}

function randomColor() {
  return [randomInt(60, 255), randomInt(60, 255), randomInt(60, 255), 0.5 + Math.random() / 2];
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vLength = vLength;
exports.normalize = normalize;
exports.randomVector = randomVector;
exports.scalarMul = scalarMul;
function vLength(_ref) {
  var x = _ref.x;
  var y = _ref.y;

  var length = Math.sqrt(x * x + y * y);
  return length;
}

function normalize(v) {
  length = vLength(v);
  return {
    x: v.x / length,
    y: v.y / length
  };
}

function randomVector() {
  var xRange = arguments.length <= 0 || arguments[0] === undefined ? 2 : arguments[0];
  var yRange = arguments.length <= 1 || arguments[1] === undefined ? 2 : arguments[1];

  var x = -(xRange / 2) + Math.random() * xRange;
  var y = -(yRange / 2) + Math.random() * yRange;

  var res = normalize({ x: x, y: y });
  return res;
}

function scalarMul(scalar, v) {
  return { x: scalar * v.x, y: scalar * v.y };
}

},{}],5:[function(require,module,exports){
'use strict';

var _canvas = require('./canvas/canvas');

var _canvas2 = _interopRequireDefault(_canvas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('Hello from mainCanvas');
(0, _canvas2.default)();

},{"./canvas/canvas":1}]},{},[5]);
