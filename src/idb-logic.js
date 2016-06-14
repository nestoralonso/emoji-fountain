'use strict';
import {
  onUpdatedTextArea,
  fileDragHover,
  fileSelectHandler,
  readTextFile } from './utils';

function openDB() {
  let openRequest = indexedDB.open("bootc", 1);
  let promise = new Promise((resolve, reject) => {
    openRequest.onupgradeneeded = function(e) {
      console.log("running onupgradeneeded");
      let db = e.target.result;

      if(!db.objectStoreNames.contains("blog-posts")) {
        let objectStore = db.createObjectStore("blog-posts");
        objectStore.transaction.oncomplete = (e) => resolve(db);
      }
    }

    openRequest.onsuccess = (e) => resolve(e.target.result);
    openRequest.onerror = (e) => reject(e);
  });

  return promise;
}

function readText(db) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(["blog-posts"], "readwrite");
    let blogPosts = transaction.objectStore('blog-posts');
    console.log(blogPosts);
    let storedText = blogPosts.get(1);
    storedText.onerror = function(e) {
      console.log('error, no text', e);
      reject(e);
    };
    storedText.onsuccess = function(e) {
      var data = storedText.result;
      console.log('retrieved text success', data);
      resolve(data);
    };
  });
}

function saveTextIDB(db, text) {
  let transaction = db.transaction(["blog-posts"], "readwrite");
  let blogPosts = transaction.objectStore('blog-posts');
  blogPosts.put({text}, 1);
}

function deleteTextFromIDB(db) {
  let transaction = db.transaction(["blog-posts"], "readwrite");
  let blogPosts = transaction.objectStore('blog-posts');
  blogPosts.delete(1);
}

function updateTextarea(textArea, resultsDiv, newText) {
  textArea.value = newText;
  onUpdatedTextArea(textArea, resultsDiv);
}

function onDBReady(db) {
  const btnSave = document.getElementById('btn-save-idb');
  const btnLoad = document.getElementById('btn-load-idb');
  const btnDelete = document.getElementById('btn-delete-idb');
  const resultsDiv = document.getElementById('results-text-idb');
  const textArea = document.getElementById('main-text-idb');

  console.log('IDB ctrls present? => ', [btnSave, btnLoad, btnDelete, resultsDiv, textArea].map(x => x.id));

  const fileDropDiv = document.getElementById('drop-files-here-idb');
  console.log('drop div? => ', [fileDropDiv].map(x => x.id));
  fileDropDiv.addEventListener("dragover", fileDragHover, false);
	fileDropDiv.addEventListener("dragleave", fileDragHover, false);

  let parsefileCallback = (text) => updateTextarea(textArea, resultsDiv, text);
	fileDropDiv.addEventListener("drop", (e) => fileSelectHandler(e, parsefileCallback), false);


  textArea.onkeypress = (e) => onUpdatedTextArea(textArea, resultsDiv);
  btnSave.onclick = (e) => saveTextIDB(db, textArea.value);
  btnDelete.onclick = (e) => deleteTextFromIDB(db);

  btnLoad.onclick = (e) => {
    readText(db)
      .then(textObj => {
        // Beware of the ugly ternary operator
        textArea.value = textObj? textObj.text : '';
        onUpdatedTextArea(textArea, resultsDiv);
      });
  }

  // Prepopulate the textarea with db contents
  readText(db)
    .then(textObj => {
      // Beware of the ugly ternary operator
      textArea.value = textObj? textObj.text : '';
      onUpdatedTextArea(textArea, resultsDiv);
    });
}

export default function main() {
  let myDB = openDB().then(db => {
    console.log(db);
      onDBReady(db);
  }).catch(e => {
    console.log('Something bad happen');
    console.log(e);
  });
}
