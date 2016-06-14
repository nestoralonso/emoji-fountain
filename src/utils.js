export function renderMarkdown(text) {
  const md = new Remarkable();
  const rawMarkup = md.render(text);

  return rawMarkup;
}

export function onUpdatedTextArea(textArea, resultsNode) {
  const text = textArea.value;
  const resultHtml = renderMarkdown(text);
  resultsNode.innerHTML = resultHtml;
}


export function fileDragHover(e) {
  e.stopPropagation();
  e.preventDefault();

  if(e.type == "dragover") {
    e.target.classList.toggle("hover");
  }
}

export function fileSelectHandler(e, callback=(x) => console.log('YEAHHH', x)) {
  fileDragHover(e);
  var files = e.target.files || e.dataTransfer.files;
  if(files.length > 1) {
    console.log('Too much files');
    return;
  }

  readTextFile(files[0], callback);
}

export function readTextFile(file, callback) {
  if (file.type.indexOf("text") == 0) {
    var reader = new FileReader();
    reader.onload = function(e) {
      callback(e.target.result);
    }
    reader.readAsText(file);
  }
}
