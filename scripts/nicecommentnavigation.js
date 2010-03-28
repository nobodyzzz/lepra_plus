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
	var pos = 0;

	removeBorder(newComms[index]);
	do{
		index++;
		index %= newComms.length;
		pos = findPos(newComms[index])
	}while(window.pageYOffset > pos);
	drawBorder(newComms[index]);
	window.scroll(0, pos - 10);
	$("#current_comment").text(index + 1);
}

function ScrollToPrevNewComment() {
	var pos = 0;

	removeBorder(newComms[index]);
	do{	
		index--;
		index %= newComms.length;
		if (index < 0) {
			index += newComms.length;
		}
		pos = findPos(newComms[index])
	}while(window.pageYOffset > findPos(document.getElementById("js-commentsHolder")) && window.pageYOffset < pos - 10);
	drawBorder(newComms[index]);
	window.scroll(0, pos);
	$("#current_comment").text(index + 1);
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
	readSettings(NAVIGATE_WITH_KEY, function(navigateWith){
		if(navigateWith === "arrows"){
			$("<div />", {className: "lc-next-block"})
				.append($("<span />", { text: "↑", click: ScrollToPrevNewComment }))
				.append($("<span />", { text: "↓", click: ScrollToNextNewComment }))
				.appendTo("body");
		} else {
			$("<div />", { id: "scroll_buttons" })
				.append($("<button />", { id: "current_comment", text: "1", click: ScrollToPrevNewComment}))
				.append($("<span />",{ text:" / "}))
				.append($("<button />", { text: newComms.length, click: ScrollToNextNewComment}))
				.appendTo("body");
		}
	});
	document.addEventListener('keydown', keyDownHandler, false);
}
});
