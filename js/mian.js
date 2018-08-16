document.addEventListener('DOMContentLoaded', init);

var converter;
var html;
var text;
var view;
var editor;
var fileName;
var tempKey;

function init() {
  editor = document.querySelector('.mark-editor');

  var switcher = document.querySelector('.switcher input');
  switcher.onchange = swithContent;

  var open = document.querySelector('.open');
  open.onchange = openFile;

  editor.onkeydown = updateContent;
  editor.onchange = updateContent;
  editor.focus = updateContent;

  converter = new showdown.Converter({
    tables: true,
    noHeaderId: true,
    strikethrough: true
  }),

  view = document.querySelector('.content-right');
}

function updateContent(e) {

  if (e.keyCode) {
    if (tempKey === 91 && e.keyCode === 83) {
      saveFile();
    }
    tempKey = e.keyCode;
  }

  setTimeout(function() {

    text = e.target.value;
    html = converter.makeHtml(text);
    view.innerHTML = html;

  }, 1);
}

function swithContent(e) {
  if (e.target.checked) {
    document.querySelector('.content-left').classList.add('none');
    document.querySelector('.content-right').classList.add('full-width');
  } else {
    document.querySelector('.content-left').classList.remove('none');
    document.querySelector('.content-right').classList.remove('full-width');
  }
}

function openFile(e) {
  var file = e.target.files[0];
  fileName = file.name.split('.')[0];
  var reader = new FileReader();
  reader.onload = function() {
    editor.value = reader.result;
    html = converter.makeHtml(editor.value);
    view.innerHTML = html;
  }
  reader.readAsText(file);
}

function saveFile() {
  if (editor.value && editor.value.length > 10) {
    download(editor.value, fileName || view.innerText.split(' ').join('').substring(0, 7).toLowerCase(), 'md');
  }
}

function download(data, filename, type) {
  var file = new Blob([data], {type: type});
  if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
      var a = document.createElement("a"),
              url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename + '.' +  type;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
      }, 0);
  }
}