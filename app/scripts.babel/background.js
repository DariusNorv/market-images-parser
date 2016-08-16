'use strict';

chrome.runtime.onInstalled.addListener(details => {
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (typeof request.msg !== 'undefined') {
    if (request.msg == 'openPopup' || request.msg == 'startUpload') {
      sendResponse(runContentScript());  
    }
  }
})

chrome.tabs.onActiveChanged.addListener(function(tabId, changeInfo, tab) {
  chrome.tabs.getSelected(null,function(tab) {
      var url = tab.url;
      runContentScript();
   });
});

function runContentScript(query) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let url = tabs[0].url,
        market = url.indexOf('itunes') > 0 ? 'itunes' : ( url.indexOf('play.google') ? 'googleplay' : false);
    chrome.tabs.sendMessage(tabs[0].id, {msg: 'updateMarket', market: market}, function(response) {
      console.log(response);
      if (typeof response !== 'undefined' && typeof response.error !== 'undefined' && !response.error) {
          chrome.browserAction.setBadgeText({text: `${response.total}`});
      } else {
        chrome.browserAction.setBadgeText({text: ''});  
      }
      
      return response;
    });
  });
}