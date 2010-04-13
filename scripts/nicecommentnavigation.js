ifEnabled("nicecommentnavigation", function(){

function drawBorder(element) {
	$("#" + element.id + " .dt").addClass("dt_border");
	$("#" + element.id + " .p").addClass("p_border");
}

function removeBorder(element) {
	$("#" + element.id + " .dt").removeClass("dt_border");
	$("#" + element.id + " .p").removeClass("p_border");
}

function flashColor(element)
{
	var dt = $("#" + element.id + " .dt");
	var p = $("#" + element.id + " .p")
	var originalColor = dt.css("backgroundColor");
	

	dt.css({backgroundColor: options.highliteColor});
	p.css({backgroundColor: options.highliteColor});
	setTimeout(function(){
		dt.css({backgroundColor: originalColor});
		p.css({backgroundColor: originalColor});
	}, 350);
}


function ScrollToNextNewComment() {
	var pos = 0;

	if(options.drawBorder){
		removeBorder(newComms[index]);
	}
	index++;
	index %= newComms.length;
	pos = $(newComms[index]).offset().top - 10;
	if(options.showParentComment){
		var parent_link = $(newComms[index]).find("a.show_parent");

		if(parent_link.length){
			pos = $(parent_link.attr("href")).offset().top - 10;
		}
	}
	if(options.drawBorder){
		drawBorder(newComms[index]);
	}
	if(options.smoothScroll){
		$('html,body').animate({scrollTop:  pos}, 250);
	} else {
		window.scroll(0, pos);
	}
	if(options.highliteComment){
		flashColor(newComms[index]);
	}
	$("#current_comment").text(index + 1);
}

function ScrollToPrevNewComment() {
	var pos = 0;
		
	if(options.drawBorder){
		removeBorder(newComms[index]);
	}
	index--;
	index %= newComms.length;
	if (index < 0) {
		index += newComms.length;
	}
	pos = $(newComms[index]).offset().top - 10;
	if(options.showParentComment){
		var parent_link = $(newComms[index]).find("a.show_parent");

		if(parent_link.length){
			pos = $(parent_link.attr("href")).offset().top - 10;
		}
	}
	if(options.drawBorder){
		drawBorder(newComms[index]);
	}
	if(options.smoothScroll){
		$('html,body').animate({scrollTop: pos}, 250);
	} else {
		window.scroll(0, pos);
	}
	if(options.highliteComment){
		flashColor(newComms[index].id);
	}
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
var options;

if (newComms.length > 0) {
	readSettings('getCommentNavigationOptions()', function(value){
		options = value; 
		if(options.navigateWith === "arrows"){
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
