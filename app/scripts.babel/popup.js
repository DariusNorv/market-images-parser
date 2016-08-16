'use strict';

const form = document.querySelector('#imageFinder');

document.addEventListener('DOMContentLoaded', () => {
  console.log('loaded');
  
  let resp = chrome.runtime.sendMessage({msg: 'openPopup'}, (response) => {
    return response;
  });
  
  console.log(resp);
})

form.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  let folder = form.querySelector('#folder').value;
  
  if (folder.length > 0) {
    console.log(folder);
    chrome.runtime.sendMessage({msg: 'startUpload'}, (response) => {
      console.log(response);  
    })
  }
})