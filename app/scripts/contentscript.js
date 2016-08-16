'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var carousel = void 0,
    total = void 0;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  var resp = {
    error: true
  };
  if (typeof request !== 'undefined') {
    var _resp = getCarouselInfo(request.market);
    _resp.error = false;
    console.log(_resp);

    if (_typeof(request.msg) != undefined) {
      if (request.msg == 'updateMarket') {
        sendResponse(_resp);
      }
      if (request.msg == 'startUpload') {
        console.log('prepareUpload');
      }
    }
  }
});

function getCarouselInfo(store) {
  var market = false,
      files = [],
      response = {};

  if (typeof store !== 'undefined' && store) {
    market = store;
  } else {
    market = window.location.host.indexOf('itunes') > -1 ? 'itunes' : window.location.host.indexOf('play.google') > -1 ? 'googleplay' : false;
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

    Array.prototype.slice.call(carousel.querySelectorAll('img')).forEach(function (item) {
      files.push(item.getAttribute('src'));
    });

    response.total = total;
    response.files = files;

    return response;
  }
}