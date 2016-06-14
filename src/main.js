'use strict';

import mainLogicStorage from './ls-logic';
import mainIndexedDB from './idb-logic';
import mainCanvasImp from './canvas/canvas';

export function main() {
  mainLogicStorage();
  mainIndexedDB();
}

export function mainCanvas() {
  console.log('Hello from mainCanvas');
  mainCanvasImp();
}
