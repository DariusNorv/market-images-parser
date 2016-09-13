'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

//chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//  
//  let files = request.files;
//  
//  if (typeof request.counter !== 'undefined') {
//    chrome.browserAction.setBadgeText({text: `${request.counter}`});  
//  } else {
//    chrome.browserAction.setBadgeText({text: ''});  
//  }
//  
//  if (typeof request.msg !== 'undefined') {
//    if (request.msg == 'startUpload') {
//      console.log('prepareUpload', files);
//       chrome.tabs.getSelected(null,function(tab) {
//        var url = tab.url;
//        console.log(`url = ${url.indexOf('itunes') > 0 || url.indexOf('play.google') > 0}`);
//        runContentScript(tab.url);
//     });
//    }
//  }
//})


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (typeof request.action !== 'undefined') {
    if (request.action == 'openPopup' || request.action == 'startUpload') {
      chrome.tabs.getSelected(null, function (tab) {
        var data = runContentScript();
        console.log(data);
      });
    }
  }
});

chrome.tabs.onActiveChanged.addListener(function (tabId, changeInfo, tab) {
  chrome.tabs.getSelected(null, function (tab) {
    runContentScript();
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  chrome.tabs.getSelected(null, function (tab) {
    runContentScript();
  });
});

function runContentScript(query) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var url = tabs[0].url,
        market = url.indexOf('itunes') > 0 ? 'itunes' : url.indexOf('play.google') ? 'googleplay' : false;
    chrome.tabs.sendMessage(tabs[0].id, { action: 'updateMarket', market: market }, function (response) {
      //console.log(response);
      if (typeof response !== 'undefined' && typeof response.error !== 'undefined' && !response.error) {
        chrome.browserAction.setBadgeText({ text: '' + response.total });
      } else {
        chrome.browserAction.setBadgeText({ text: '' });
      }
      return response;
    });
  });
}