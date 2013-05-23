/**
 * Should be called by the content script.
 */
function proxyXHR(xhrOptions) {
  xhrOptions = xhrOptions || {};
  xhrOptions.onComplete = xhrOptions.onComplete || function(){};
  
  var port = chrome.extension.connect({name: 'XHRProxy_'});
  port.onMessage.addListener(function(msg) {
    xhrOptions.onComplete(msg.status, msg.data, msg.xhr);
  });
  port.postMessage(xhrOptions);
}
