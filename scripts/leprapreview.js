ifEnabled("leprapreview", function(){
// ==UserScript==
// @include http://leprosorium.ru/*
// @include http://*.leprosorium.ru/*
// ==/UserScript==
	var textarea = false;
	var toolbar = false;

	if (window.location.href.indexOf("comments") != - 1 || window.location.href.indexOf("inbox") != - 1) {
		textarea = document.getElementById('comment_textarea');
		if (textarea) toolbar = textarea.parentNode.previousSibling.previousSibling;
	}

	if (window.location.href.indexOf("write") != - 1) {
		textarea = document.getElementById('comment_textarea');
		toolbar = document.querySelector('.textarea_editor');
	}

	if (window.location.href.indexOf("asylum") != - 1) {
		textarea = document.getElementById('comment_textarea');
		toolbar = textarea.parentNode.parentNode.parentNode.rows[0].cells[0];
	}

	if (textarea) {
		var d = document.createElement('a');
		var preview = document.createElement(window.location.href.indexOf("asylum") != - 1 ? 'tr' :'div');

		d.innerHTML = " <b>Предпросмотр<b>";
		d.href = "#";
		d.addEventListener("click", function(e){
			document.getElementById("lp_preview").innerHTML = textarea.value
													.replace(/<irony>/g, '<span class=irony>')
													.replace(/<\/irony>/g, '</span>')
													.replace(/\n/g, '<br />');
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		if(window.location.href.indexOf("asylum") != - 1){
			preview = document.createElement('tr');
			preview.innerHTML = '<td colspan="3"><div id="lp_preview"></div></td>';
			toolbar.parentNode.parentNode.insertBefore(preview, toolbar.parentNode);			
		} else {
			preview = document.createElement('div');
			preview.id = "lp_preview";
			toolbar.parentNode.insertBefore(preview, toolbar);
		}		
		toolbar.appendChild(d);
		
	}

});
