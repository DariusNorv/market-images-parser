'use strict';

const form = document.querySelector('#imageFinder');
let data = false,
    xhr = new XMLHttpRequest();

document.addEventListener('DOMContentLoaded', () => {
  console.log('loaded');
   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let url = tabs[0].url,
        market = url.indexOf('itunes') > 0 ? 'itunes' : ( url.indexOf('play.google') ? 'googleplay' : false);
    chrome.tabs.sendMessage(tabs[0].id, {action: 'updateMarket', market: market}, function(response) {
      //console.log(response);
      if (typeof response !== 'undefined' && typeof response.error !== 'undefined' && !response.error) {
        console.log(response);

        if (response.files.length > 0) {
          const list = document.querySelector('#imageList');
          response.files.forEach((image) => {
            let img = new Image();
            //img.src = image.indexOf('http') > -1 || image.indexOf('https') > -1 ? image : 'http:' + image;
            img.src = image;
            console.log(img.src)
            img.classList.add('preview');
            list.appendChild(img);
          })
        }

        data = response;

      } else {
        data = false;
      }
    });
  });
})

form.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (typeof data.files !== 'undefined') {
    if (data.files.length > 0) {
      let directory = Date.now(), downloadedItems = [];

      // let extension = chrome.downloads.onCreated.addListener((item) => {
      //   downloadedItems.push(item.mime);
      // })

      let extensions = [];
      const xhr = new XMLHttpRequest();

      data.files.forEach((img, index) => {

        xhr.open('GET', img, false);

        xhr.onreadystatechange = () => {
          if(xhr.readyState == 4 && xhr.status == 200) {
            chrome.downloads.download({ url: img, filename: `${directory}/img${index++}.${xhr.getResponseHeader('Content-Type').split('/')[1]}`})
          }
        }
        xhr.send()

        // console.log(downloadedItems)
        // chrome.downloads.download({ url: img, filename: `${directory}/img${index++}`}, (item) => {
        // });
        //
        // chrome.downloads.onDeterminingFilename.addListener((item) => {
        //   console.log(item)
        // })

      })

    }
  } else {

  }
})
/*
document.querySelector('.minify').addEventListener('click', (e) => {
  e.preventDefault();

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

    let imgsData = {
      source: {
        url: 'http://a3.mzstatic.com/us/r30/Purple49/v4/d0/82/df/d082df3e-3dd3-af08-c7c5-7f7047f72823/screen696x696.jpeg'
      }
    };

    const tinyParams = {
      token: 'zCpXBTrVjD4JspyIGBoNJFFDAdHQuQNE',
      url : 'https://api.tinify.com/shrink'
    }

    // const req = new XMLHttpRequest();
    //
    // req.open('POST', tinyParams.url, true);
    // //req.setRequestHeader('Authorization', 'Basic ' + tinyParams.token);
    // req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    //
    //
    // req.onload = function () {
    //
    // }
    //
    // req.send("data=" + JSON.stringify(imgsData));
//
//     const xhr = new XMLHttpRequest();
//     xhr.open('POST','https://api.tinify.com/shrink', true);
//     xhr.withCredentials = true;
// //    xhr.useDefaultHeader = false;
//     xhr.setRequestHeader('Authorization', 'zCpXBTrVjD4JspyIGBoNJFFDAdHQuQNE');
//    xhr.setRequestHeader('Content-Type', 'application/jsonp; charset=UTF-8');
//    xhr.onload = function () {
//      console.log(xhr.responseText);
//    };

//    xhr.onload = function () {
//      xhr.setRequestHeader('Authorization', 'Basic zCpXBTrVjD4JspyIGBoNJFFDAdHQuQNE');
//    }
   //
  //  //xhr.setRequestHeader('Request-Method', 'POST');
  //  //xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  //  //xhr.setRequestHeader('Access-Control-Allow-Headers', 'x-requested-with,Content-Type');
  //  //xhr.setRequestHeader('Content-Length', JSON.stringify(imgsData).length);
  //  //xhr.setRequestHeader('Authorization', 'Basic zCpXBTrVjD4JspyIGBoNJFFDAdHQuQNE');
  //  //xhr.setRequestHeader('Accept', 'application/json');
  //  //xhr.setRequestHeader('Accept', 'application/json');
  //  //xhr.setRequestHeader('Access-Control-Request-Method', 'POST');
  //  //xhr.setRequestHeader('Content-Type', 'application/json; utf-8');
  //  //xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  //  console.log(xhr.withCredentials)

  });
})
*/
