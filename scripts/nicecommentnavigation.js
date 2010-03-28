ifEnabled("nicecommentnavigation", function(){
// ==UserScript==
// @name Lepra nice new comments navigation 
// @namespace http://leprosorium.ru
// @include http://leprosorium.ru/comments/*
// @include http://*.leprosorium.ru/comments/*
// @include http://leprosorium.ru/my/inbox/*
// ==/UserScript==

function findPos(obj) {
	var curtop = 0;

	if (obj.offsetParent) {
		do {
			curtop += obj.offsetTop;
		}
		while (obj = obj.offsetParent);
		return curtop;
	}
}

function drawBorder(element) {
	$("#" + element.id + " .dt").addClass("dt_border");
	$("#" + element.id + " .p").addClass("p_border");
}

function removeBorder(element) {
	$("#" + element.id + " .dt").removeClass("dt_border");
	$("#" + element.id + " .p").removeClass("p_border");
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

var newComms = $("#js-commentsHolder div.new").get();
var index = 0;

if (newComms.length > 0) {
	$("<div />", {className: "lc-next-block"})
		.append($("<span />", { text: "↑", click: ScrollToPrevNewComment }))
		.append($("<span />", { text: "↓", click: ScrollToNextNewComment }))
		.appendTo("body");
	document.addEventListener('keydown', keyDownHandler, false);
}
});
