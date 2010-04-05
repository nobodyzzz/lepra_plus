ifEnabled("totalcomments", function(){

String.prototype.fmt = function() {
	var txt = this;
	for (var i = 0; i < arguments.length; i++) {
		var exp = new RegExp('\\{' + (i) + '\\}', 'gm');
		txt = txt.replace(exp, arguments[i]);
	}
	return txt;
};

var current_selector = "";

function applyFilter(selector){
	return function(e){
		$("#js-commentsHolder .post").show();
		if(!e.ctrlKey){
			$("#totalcommentsspan span").removeClass("selected");
			$("#totalcommentsspan input").attr("value", "");
			current_selector = selector;
		} else {
			current_selector += selector;
		}

		if (selector){
			$("#js-commentsHolder .post:not({0})".fmt(current_selector)).hide();
		}
		$(e.target).addClass("selected");
	}
}
function applyAuthorFilter(author){
	if(!author){
		author = $("#totalcommentsspan input").val(); 
	}
	if($("#js-commentsHolder .post:visible.by-" + author).length){
		if(current_selector.indexOf(".by-") !== -1){
			current_selector = current_selector.substr(0, current_selector.indexOf(".by-"));
		}
		current_selector += ".by-" + author;
		$("#js-commentsHolder .post").show();
		$("#js-commentsHolder .post:not({0})".fmt(current_selector)).hide();
		$("#totalcommentsspan span:last").addClass("selected");
	}
	$("#author_selector").hide();	
}
function calcStats(){
	var abovenull = 0;
	var rating_square_sum = 0;
	var rating_sum = 0;
	var standard_deviation = 0;

	$("#js-commentsHolder div.post div.vote span em").each(function(){
		var rating = Number(this.innerText);

		if(rating >= 0){
			abovenull += 1;
			rating_sum += rating;
			rating_square_sum += Math.pow(rating, 2);
		}
	});
	standard_deviation = Math.sqrt((rating_square_sum - (Math.pow(rating_sum, 2) / abovenull)) / (abovenull - 1));
	$("#js-commentsHolder div.post").each(function(){
		var rating = Number($("#{0}  div.vote span em".fmt(this.id)).text());
		
		if(rating > 0 && ((rating / standard_deviation) >= 0.8)){
			$(this).addClass("cool");
		}	
	});	
}

jQuery.fn.liveUpdate = function(list){
    var rows = $(list + ' ul li'),
      cache = rows.map(function(){
        return this.innerHTML.toLowerCase();
      });
      
    this.keyup(filter).keyup()

    
  return this;
    
  function filter(){
    var term = jQuery.trim( jQuery(this).val().toLowerCase() ), scores = [];
    
    if ( !term ) {
      rows.show();
    } else {
      rows.hide();

      cache.each(function(i){
	   if(this.indexOf(term) != -1){
		  scores.push(i);
	   }        
      });

      jQuery.each(scores, function(){
        jQuery(rows[ this ]).show();
      });
    }
  }
};


function buildAuthorList(){
	var pos = $("#totalcommentsspan input").offset();
	var authors = [];

	pos.top += 18;
	$("#author_selector").empty()
					 .append("<ul />")
					 .css({top: pos.top + "px", left: pos.left + "px"})
					 .show();

	$("#js-commentsHolder .post" + current_selector).each(function(){
		var author = $("#{0} .dd .p a[href*='users']".fmt(this.id)).text();

		if(authors.indexOf(author) === -1){
			authors.push(author);
		}
	});
	for(var i = 0, n = authors.length; i < n; i += 1){
		$("#author_selector ul").append($("<li />", { 
			text: "{0}({1})".fmt(authors[i], $("#js-commentsHolder .post{0}.by-{1}".fmt(current_selector,authors[i])).length),
			css: { cursor: "default" },
		}))
	}
	$("#author_selector ul li").click(function(e){
		var author = e.target.innerText;

		author = author.substr(0, author.indexOf("("));
		$("#totalcommentsspan input").val(author); 
		applyAuthorFilter(author);
	});
	$("#totalcommentsspan input").val("")
						    .liveUpdate("#author_selector");
}

var modes = [
	{
		title: 'все',
		selector: ''
	},
	{
		title: 'новые',
		selector: '.new'
	},
	{
		title: 'с картинками',
		selector: ':has(img)'
	},
	{
		title: 'клеви',
		selector: '.cool'
	},
	{
		title: 'мои',
		selector: '.mine'
	}
];
$("<tr />", {id: "totalcomments" }).insertAfter("#content_left_inner table.category tr");
$("#totalcomments").append($("<td />", { class: "system", colspan: 4 }).
			     append($("<span />", {id:"totalcommentsspan", text: "TotalComments: "})));

calcStats();
$("#js-commentsHolder div.post a[href*='\\/users\\/']").each(function(){
		$(this).parents(".post").addClass("by-" + this.innerText);
});
for(var i = 0; i < modes.length; i += 1){
	var count = $("#js-commentsHolder .post" + modes[i].selector).length;

	$("#totalcommentsspan").append($("<span />", {
		id: modes[i].id, 
		className: "filter", 
		text: modes[i].title + " (" + count + ")", 
		click: applyFilter(modes[i].selector)
	}));
}

$("#totalcommentsspan").append($("<span />", {
    text: "автор:",
    className: "filter",
    title: "Показать комментарии только этого юзернейма",
    click: buildAuthorList,
    id: "control_author"
})).append($("<input>", {
    id: "author_filter",
    css: {
        width: "80px"
    }
}).focus(buildAuthorList).keydown(function (e) {
    if (e.which === 13) {
        applyAuthorFilter();
    }
}));

$(document).click(function(e){
	if($("#author_selector:visible").length){
		if(e.target.id !== "control_author" && e.target.id !== "author_selector" && e.target.id !== "author_filter"){
			applyAuthorFilter();
		}
	}
});
$("<div />", { id: "author_selector"}).appendTo("body");
$("#js-commentsHolder .post .dd .p a.u").click(function(){
	var author = $(this).parent().find("a[href*='users']").text();

	applyAuthorFilter(author);
	$("#totalcommentsspan input").val(author);
	return true;
});
$("#js-commentsHolder .post .dd .p a.show_parent").click(function(){
	$(this.getAttribute("href")).show();
	return true;
})
});
