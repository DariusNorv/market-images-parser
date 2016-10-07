'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var carousel = void 0,
    total = void 0,
    logo = void 0;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  var resp = {
    error: true
  };
  if (typeof request !== 'undefined') {
    var _resp = getCarouselInfo(request.market);
    _resp.error = false;
    console.log(_resp);

    if (_typeof(request.action) != undefined) {
      if (request.action == 'updateMarket') {
        sendResponse(_resp);
      }
      if (request.action == 'startUpload') {
        console.log('prepareUpload');
      }
    }
  }
});

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  console.log(request);
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
      logo = document.querySelector('#left-stack img.artwork').getAttribute('src-swap-high-dpi');

      Array.prototype.slice.call(carousel.querySelectorAll('img')).forEach(function (item) {
        files.push(item.getAttribute('src'));
      });
    }
    if (market == 'googleplay') {
      carousel = document.querySelectorAll('.full-screenshot');
      total = carousel.length;
      logo = document.querySelector('img.cover-image').getAttribute('src').replace(/-rw$/, '');

      Array.prototype.slice.call(carousel).forEach(function (item) {
        files.push(item.getAttribute('src').indexOf('http') > -1 || item.getAttribute('src').indexOf('https') > -1 ? item.getAttribute('src').replace(/-rw$/, '') : 'http:' + item.getAttribute('src').replace(/-rw$/, ''));
      });
    }

    response.total = total;
    response.files = files;
    response.logo = logo;

    return response;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  getCarouselInfo();
});