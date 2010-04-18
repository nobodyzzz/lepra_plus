var CLICK_BEHAVIOR_KEY = 'click-behavior';
var REFRESH_INTERVAL_KEY = 'refresh-interval';
var SHOW_ON_BADGE_KEY = 'show-on-badge';
var TEXT_AREA_SHORTCUTS_KEY = 'text-area-shortcuts';
var NAVIGATION_OPTIONS = "navigation-options";
var USER_SCRIPTS = [
'inline_info_ex',
'leprapreview',
'nicecommentnavigation',
'personal_hell',
'sublepras',
'textareashortcuts',
'totalcomments'
]


function getClickBehavior() {
  return localStorage[CLICK_BEHAVIOR_KEY] || 'popup';
}

function setClickBehavior(value) {
  localStorage[CLICK_BEHAVIOR_KEY] = value;
}

function getRefreshInterval() {
  return parseInt(localStorage[REFRESH_INTERVAL_KEY] || '300000', 10);
}

function setRefreshInterval(value) {
  localStorage[REFRESH_INTERVAL_KEY] = value;
}

function getShowOnBadge(){
	return localStorage[SHOW_ON_BADGE_KEY] || 'none';
}

function setShowOnBadge(value){
	localStorage[SHOW_ON_BADGE_KEY] = value;
}

function setUserJsEnabled(userjs, enabled){
	localStorage[userjs] = enabled;
}

function getUserJsEnabled(userjs){
	var enabled = localStorage[userjs] || "true";
	
	return enabled === "true";
}

function ifEnabled(userjs, callback){
	var port = chrome.extension.connect({name: "userjs"});
	
	port.onMessage.addListener(function(enabled){
		if(enabled){
			callback();
		}
	});
	port.postMessage(userjs);
}

function getTextareaShortcuts(){
	var scuts = localStorage[TEXT_AREA_SHORTCUTS_KEY];
	
	if(scuts){
		return JSON.parse(scuts);
	} else {
		return {
			'bold' : 'alt+b',
			'italic' : 'alt+i',
			'underline' : 'alt+u',
			'irony' : 'alt+r',
			'sup' : 'alt+v',
			'sub' : 'alt+n',
			'link' : 'alt+l',
			'image' : 'alt+p',
		};
	}
}

function setTextareaShortcuts(value){
	localStorage[TEXT_AREA_SHORTCUTS_KEY] = JSON.stringify(value);
}

function getCommentNavigationOptions(){
	var options = localStorage[NAVIGATION_OPTIONS];

	if(options){
		return JSON.parse(options);
	} else {
		return {
			navigateWith: "arrows",
			drawBorder: true,
			highliteComment: false,
			highliteColor: "#f4fbac",
			showPrevComment: false,
			smoothScroll: false
		}
	}
}

function setCommentNavigationOptions(options){
	localStorage[NAVIGATION_OPTIONS] = JSON.stringify(options);
}

function getShortcutsBindings(callback){
	var port = chrome.extension.connect({name: "textarea-shortcuts"});
	
	port.onMessage.addListener(function(bindings){
		if(bindings){
			callback(bindings);
		}
	});
	port.postMessage(undefined);	
}

function readSettings(options, fn){
	var port = chrome.extension.connect({name: "readsettings"});

	port.onMessage.addListener(function(settings){
		fn(settings);
	});
	port.postMessage(options);
}

