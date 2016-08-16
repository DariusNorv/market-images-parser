'use strict';

var form = document.querySelector('#imageFinder');

document.addEventListener('DOMContentLoaded', function () {
  console.log('loaded');

  var resp = chrome.runtime.sendMessage({ msg: 'openPopup' }, function (response) {
    return response;
  });

  console.log(resp);
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  e.stopPropagation();

  var folder = form.querySelector('#folder').value;

  if (folder.length > 0) {
    console.log(folder);
    chrome.runtime.sendMessage({ msg: 'startUpload' }, function (response) {
      console.log(response);
    });
  }
});