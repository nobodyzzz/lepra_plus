chrome.extension.onConnect.addListener(function(port){
  var updateInterval = null;
  if (getClickBehavior() === "glagne" || getShowOnBadge() !== "none") {
    updateInfo();
    updateInterval = setInterval(updateInfo, getRefreshInterval());
  }
  if(port.name === "XHRProxy_") {
    port.onMessage.addListener(function(xhrOptions) {
      var xhr = new XMLHttpRequest();
      xhr.open(xhrOptions.method || "GET", xhrOptions.url, true);
      xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
          port.postMessage({
            status: this.status,
            data: this.responseText,
            xhr: this
          });
        }
      }
      xhr.send();
    });
  }
  if(port.name === "userjs"){
    port.onMessage.addListener(function(msg){
      var enabled = localStorage[msg] || "true";

      port.postMessage(enabled === "true");
    });					
  } else if(port.name === "textarea-shortcuts"){
    port.onMessage.addListener(function(msg){
      port.postMessage(getTextareaShortcuts());
    });
  } else if(port.name === "updateinfo"){
    port.onMessage.addListener(function(msg){
      if(msg === "start"){
        if(!updateInterval){
          updateInterval = setInterval(updateInfo, getRefreshInterval());
        }
      } else if (msg === "stop"){
        if(updateInterval){
          clearInterval(updateInterval);
          updateInterval = null;
        }
      }
    });
  } else if(port.name === "readsettings"){
    port.onMessage.addListener(function(msg){
      var settings;

      if(typeof msg === "string"){
        if(msg.endsWith("()")){
          settings = eval(msg);									
        } else {
          settings = localStorage[msg];
        }

      } else if(msg instanceof Array){
        settings = new Object();
        for(var i = 0, n = msg.length; i < n; i += 1){
          settings[msg[i]] = localStorage[msg[i]];
        }
      }
      port.postMessage(settings);
    })
  } else if(port.name === "setbadgetext"){
    port.onMessage.addListener(function(msg){
      chrome.browserAction.setBadgeText({text: msg});
    });
  }
});
