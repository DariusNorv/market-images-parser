'use strict';

let carousel, total, logo;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);
  let resp = {
    error : true
  }
  if (typeof request !== 'undefined') {
    let resp = getCarouselInfo(request.market);
    resp.error = false;
    console.log(resp);

    if (typeof request.action != undefined) {
      if (request.action == 'updateMarket') {
        sendResponse(resp);
      }
       if (request.action == 'startUpload') {
        console.log('prepareUpload')
      }
    }

  }
});

chrome.extension.onRequest.addListener((request, sender, sendResponse) => {
  console.log(request);
});

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
      logo = document.querySelector('#left-stack img.artwork').getAttribute('src-swap-high-dpi');

      Array.prototype.slice.call(carousel.querySelectorAll('img')).forEach((item) => {
      files.push(item.getAttribute('src'))
      });

    }
    if (market == 'googleplay') {
      carousel = document.querySelectorAll('.full-screenshot');
      total = carousel.length;
      logo = document.querySelector('img.cover-image').getAttribute('src').replace(/-rw$/, '');

      Array.prototype.slice.call(carousel).forEach((item) => {
        files.push(item.getAttribute('src').indexOf('http') > -1 || item.getAttribute('src').indexOf('https') > -1 ? item.getAttribute('src').replace(/-rw$/, '') : 'http:' + item.getAttribute('src').replace(/-rw$/, ''))
      });
    }

    response.total = total;
    response.files = files;
    response.logo = logo;

    return response;

  }
}

document.addEventListener('DOMContentLoaded', () => {
  getCarouselInfo();
})
