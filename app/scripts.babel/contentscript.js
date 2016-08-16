'use strict';

let carousel, total;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);
  let resp = {
    error : true
  }
  if (typeof request !== 'undefined') {
    let resp = getCarouselInfo(request.market);
    resp.error = false;
    console.log(resp);
    
    if (typeof request.msg != undefined) {
      if (request.msg == 'updateMarket') {
        sendResponse(resp);  
      }
       if (request.msg == 'startUpload') {
        console.log('prepareUpload')
      }
    }
    
  }
})

function getCarouselInfo (store) {
  let market = false, files = [], response = {};
  
  if (typeof store !== 'undefined' && store) {
    market = store;
  } else {
    market = window.location.host.indexOf('itunes') > -1 ? 'itunes' : (window.location.host.indexOf('play.google') > -1 ? 'googleplay' : false);
  }

  if (market) {
    if (market == 'itunes') {
      carousel = document.querySelector('#content .iphone-screen-shots .image-wrapper');
      total = parseInt(carousel.parentNode.getAttribute('num-items'));
    }
    if (market == 'googleplay') {
      carousel = document.querySelector('.thumbnails-wrapper > .thumbnails');
      total = carousel.querySelectorAll('img').length;
    }
    
    Array.prototype.slice.call(carousel.querySelectorAll('img')).forEach((item) => {
     files.push(item.getAttribute('src'))  
    });
    
    response.total = total;
    response.files = files;
    
    return response;
    
  }
}
