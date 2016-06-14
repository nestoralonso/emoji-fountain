'use strict';
import {
  onUpdatedTextArea,
  fileDragHover,
  fileSelectHandler,
  readTextFile } from './utils';


function loadFromLS(textArea) {
  const storedText = localStorage.getItem("main-text");
  textArea.value = storedText;
  console.log(`Retrieved text from LS: \n\n${storedText}`);

  return false;
}


function saveToLocalStorage(srcTextArea) {
  const text = srcTextArea.value;
  localStorage.setItem("main-text", text);
}


function updateTextarea(textArea, resultsDiv, newText) {
  textArea.value = newText;
  onUpdatedTextArea(textArea, resultsDiv);
}

export default function main() {
  const btnSaveLS = document.getElementById('btn-save-ls');
  const btnLoadLS = document.getElementById('btn-load-ls');
  const btnDeleteLS = document.getElementById('btn-delete-ls');
  const resultsDiv = document.getElementById('results-text-ls');
  const textArea = document.getElementById('main-text-ls');

  const fileDropDiv = document.getElementById('drop-files-here-ls');
  console.log('LS ctrls present? => ', [fileDropDiv].map(x => x.id));
  fileDropDiv.addEventListener("dragover", fileDragHover, false);
	fileDropDiv.addEventListener("dragleave", fileDragHover, false);

  let parsefileCallback = (text) => updateTextarea(textArea, resultsDiv, text);
	fileDropDiv.addEventListener("drop", (e) => fileSelectHandler(e, parsefileCallback), false);

  textArea.onkeypress = (e) => onUpdatedTextArea(textArea, resultsDiv);
  btnSaveLS.onclick = (e) => saveToLocalStorage(textArea);
  btnLoadLS.onclick = (e) => {
    loadFromLS(textArea);
    onUpdatedTextArea(textArea, resultsDiv);
  };
  btnDeleteLS.onclick = (e) => localStorage.removeItem("main-text");
}
