ifEnabled("nicecommentnavigation", function(){
// ==UserScript==
// @name Lepra nice new comments navigation 
// @namespace http://leprosorium.ru
// @include http://leprosorium.ru/comments/*
// @include http://*.leprosorium.ru/comments/*
// @include http://leprosorium.ru/my/inbox/*
// ==/UserScript==
///{{{ utility functions, taken from web
function getElementsByClass(searchClass, node, tag) {
	var classElements = new Array();
	if (node == null) node = document;
	if (tag == null) tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
	for (i = 0, j = 0; i < elsLen; i++) {
		if (pattern.test(els[i].className)) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
}

window.size = function() {
	var w = 0;
	var h = 0;

	//IE
	if (!window.innerWidth) {
		//strict mode
		if (! (document.documentElement.clientWidth == 0)) {
			w = document.documentElement.clientWidth;
			h = document.documentElement.clientHeight;
		}
		//quirks mode
		else {
			w = document.body.clientWidth;
			h = document.body.clientHeight;
		}
	}
	//w3c
	else {
		w = window.innerWidth;
		h = window.innerHeight;
	}
	return {
		width: w,
		height: h
	};
}

window.center = function() {
	var hWnd = (arguments[0] != null) ? arguments[0] : {
		width: 0,
		height: 0
	};

	var _x = 0;
	var _y = 0;
	var offsetX = 0;
	var offsetY = 0;

	//IE
	if (!window.pageYOffset) {
		//strict mode
		if (! (document.documentElement.scrollTop == 0)) {
			offsetY = document.documentElement.scrollTop;
			offsetX = document.documentElement.scrollLeft;
		}
		//quirks mode
		else {
			offsetY = document.body.scrollTop;
			offsetX = document.body.scrollLeft;
		}
	}
	//w3c
	else {
		offsetX = window.pageXOffset;
		offsetY = window.pageYOffset;
	}

	_x = ((this.size().width - hWnd.width) / 2) + offsetX;
	_y = ((this.size().height - hWnd.height) / 2) + offsetY;

	return {
		x: _x,
		y: _y
	};
}
///}}}
function getNewComments() {
	var comments = document.getElementById("js-commentsHolder");
	var newComments = null;

	if (comments) {
		newComments = getElementsByClass("new", comments, "div");
	}

	return newComments;
}

function findPos(obj) {
	var curtop = 0;

	if (obj.offsetParent) {
		do {
			curtop += obj.offsetTop;
		}
		while (obj = obj.offsetParent);
		return [curtop];
	}
}

function drawBorder(element) {
	var dt = getElementsByClass("dt", element, "div")[0];
	var p = getElementsByClass("p", element, "div")[0];

	dt.style.border = "1px solid black";
	dt.style.borderWidth = "1px 1px 0 1px";

	p.style.border = "1px solid black";
	p.style.borderWidth = "0 1px 1px 1px";
}

function removeBorder(element) {
	var dt = getElementsByClass("dt", element, "div")[0];
	var p = getElementsByClass("p", element, "div")[0];

	dt.style.border = "";
	dt.style.borderWidth = "";

	p.style.border = "";
	p.style.borderWidth = "";
}

function ScrollToNextNewComment() {
	removeBorder(newComms[index]);
	index++;
	index %= newComms.length;
	drawBorder(newComms[index]);
	window.scroll(0, findPos(newComms[index]) - 100);
}

function ScrollToPrevNewComment() {
	removeBorder(newComms[index]);
	index--;
	index %= newComms.length;
	if (index < 0) {
		index += newComms.length;
	}
	drawBorder(newComms[index]);
	window.scroll(0, findPos(newComms[index]));
}

function keyDownHandler(e) {
	var targ = e.target;
	var editTags = {
		'TEXTAREA': '',
		'INPUT': '',
		'TEXT': '',
		'PASSWORD': ''
	};

	if (targ && ! (targ.tagName in editTags)) {
		if (e.keyIdentifier == "U+004A" || e.which == e.DOM_VK_J) {
			ScrollToNextNewComment();
		} else if (e.keyIdentifier == "U+004B" || e.which == e.DOM_VK_K) {
			ScrollToPrevNewComment();
		}
	}
}

var newComms = getNewComments();
var index = 0;
var css = ".lc-next-block { \
		position: fixed; \
		top: 50%; \
		right: 0px; \
		z-index: 100; \
	} \
	.lc-next-block span { \
		display: block; \
		color: #ccc; \
		border: 1px solid #ccc; \
		padding: 5px 10px; \
		margin-bottom: 1px; \
		font-size: 75%; \
		cursor: pointer; \
	} \
	.lc-next-block span:hover { \
		color: #000; \
		border: 1px solid #000; \
	} \
";

if (newComms.length > 0) {
	var style = document.createElement("STYLE");
	style.type = "text/css";
	style.appendChild(document.createTextNode(css));
	document.body.appendChild(style);

	var navBlock = document.createElement("DIV");
	navBlock.className = "lc-next-block";

	navLinkNext = document.createElement("SPAN");
	navLinkNext.appendChild(document.createTextNode("↓"));
	navLinkNext.addEventListener("click", ScrollToNextNewComment, false);

	navLinkPrev = document.createElement("SPAN");
	navLinkPrev.appendChild(document.createTextNode("↑"));
	navLinkPrev.addEventListener("click", ScrollToPrevNewComment, false);

	navBlock.appendChild(navLinkPrev);
	navBlock.appendChild(navLinkNext);
	document.body.appendChild(navBlock);
	document.addEventListener('keydown', keyDownHandler, false);
}
});
