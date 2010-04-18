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
function getNextCommentPos(){
	var pos = 0;
	do{
		index++;
		index %= newComms.length;
		pos = $(newComms[index]).offset().top;
		if(index === 0){
			break;
		}
	}while(window.pageYOffset > pos)
	return pos - 10;
}
function getPrevCommentPos(){
	var pos = 0;
	do{
		index--;
		index %= newComms.length;
		if (index < 0) {
			index += newComms.length;
		}
		pos = $(newComms[index]).offset().top;
		if(index === 0){
			break;
		}
	}while(window.pageYOffset > $("#js-commentsHolder").offset().top && window.pageYOffset < pos - 10);
	return pos - 10;
}
function ScrollToComment(getPos, e){
	var pos = 0;

	if(options.drawBorder){
		removeBorder(newComms[index]);
	}
	pos = getPos();
	if(!$(newComms[index]).hasClass("indent_0") && (options.showParentComment || e.ctrlKey)){
		var prev = $(newComms[index]).prev();

		if(prev.length){
			pos = prev.offset().top - 10;
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

function ScrollToNextNewComment(e) {
	ScrollToComment(getNextCommentPos, e);
}

function ScrollToPrevNewComment(e) {
	ScrollToComment(getPrevCommentPos, e);
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
			ScrollToNextNewComment(e);
		} else if (e.keyIdentifier == "U+004B" || e.which == e.DOM_VK_K) {
			ScrollToPrevNewComment(e);
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
