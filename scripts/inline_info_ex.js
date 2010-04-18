ifEnabled("inline_info_ex", function() {
	// Inline UserInfo (tender)
	// version 1.4.6
	// version 1.4.6
	// Copyright (c) 2008-2009, mcm69, tender, inga, nobodyzzz
	// Released under the GPL license
	//
	// --------------------------------------------------------------------
	//
	// ==UserScript==
	// @name          Inline UserInfo (tender)
	// @namespace     http://leprosorium.ru/*
	// @description   Show additional user info for leprosorium.ru.
	// @include       http://*.leprosorium.ru/*
	// @include       http://leprosorium.ru/*
	// ==/UserScript==
	// all patch by //tender
	// 10.03.2010 - redisign, recoding all! (:
	var processed_links = [];

	function GM_logEx(msg) {
		if (window.opera) {
			// fuuuuuuuuuu
		} else {
			//    GM_log(msg);
		}
	}

	function onLoadInserted(e) {
		if (!e) return;
		if (!e.target) return;
		if (!e.target.className) return;

		GM_logEx("element with id " + e.target.id + " has been added");
		//	GM_logEx("!!"+ e.target.className +"!!!!");
		//себя нафиг!
		if (e.target.id == "hoverinfo") return;
		GM_logEx("inserting: OK");

		onLoad(e);
		return;
	}

	function onLoad(e) {
		var SEND_INTERVAL = 10;
		var div_obj = document.getElementById("hoverinfo");
		var c_link = null;
		var hid = 0;
		var tid = 0;
		var div_html = "";

		// по хорошему нужно бы пересоздать бы его... 
		// если инсертят...

		// create a hidden div
		if (!div_obj) {
			div_obj = document.createElement("div");
			div_obj.id = "hoverinfo";
			div_obj.style.display = "none";
			div_obj.style.position = "absolute";
			//div_obj.style.position="relative";
			//z-index: 2
			div_obj.style.border = "1px solid #aaa";
			div_obj.style.minWidth = "200px";
			div_obj.style.minHeight = "100px";
			div_obj.style.zIndex = "9999";
			div_obj.style.color = "#999";
			div_obj.style.fontSize = "10px";
			div_obj.style.padding = "10px 10px 50px 10px";
			div_obj.style.whiteSpace = "nowrap";
			div_obj.addEventListener("mouseover", hoverDiv, false);
			div_obj.addEventListener("mouseout", hideDiv, false);
			document.body.appendChild(div_obj);
		}

		for (i = 0; i < document.links.length; i++) {
			var a = document.links[i].getAttribute("href")

			// GM_logEx(a);
			var u = a.match(/\/users\/(.+)/); //
			var l = document.links[i];

			if (u && processed_links.indexOf(l) === - 1) {
				l.setAttribute("usernum", u[1]);
				l.addEventListener('mouseover', mouseOver, false);
				l.addEventListener('mouseout', mouseOut, false);
				processed_links.push(l);
			}

		}

		function mouseOver(e) {
			e = e || window.event

			if (e.pageX == null && e.clientX != null) {
				var html = document.documentElement
				var body = document.body

				e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0)
				e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0)
			}

			div_obj.style.left = e.pageX + 'px';
			div_obj.style.top = e.pageY + 'px';

			clearInterval(hid);
			tid = setInterval(hoverInfo, 1500);
			c_link = this;
		}

		function mouseOut(e) {
			clearInterval(tid);
			hid = setInterval(hideDiv, 500);
		}

		function hoverDiv() {
			clearInterval(hid);
		}

		function hideDiv(e) {
			if (!e) return;
			var t = e.relatedTarget;

			//  дома?
			if (t && (t.id == "hoverinfo")) return;

			// кто здесь?
			while (t && t.parentNode) {
				if (t.parentNode.id == "hoverinfo") return;
				t = t.parentNode;
			}
			// bye! bye!
			div_obj.style.display = "none";
			clearInterval(hid);
		}

		//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------  
		var login = "";
		// лепрономер
		var uid = 0;
		var uid_father = "0";
		//
		var base_response = "";
		var add_response = "";

		function onFillbase(e) {
			html = e.responseText;
			//.................................................................................
			var m;
			//реальное имя, город
			m = html.match(/<div class=\"userbasicinfo\">\s*<h3>(.+)\s*<\/h3>\s*<div class=\"userego\">\s*(.+)\s*<\/div>/);

			var extinfo = "";

			if (m) {
				if (m[1]) extinfo += m[1];
				extinfo += ",<br/>";
				if (m[2]) extinfo += m[2];
			}

			m = html.match(/<div class=\"vote\"\s*uid=\"(.+)\">/);

			if (m) {
				uid = m[1];
			}

			// жопка для юзера
			var ugopka = "Жопок нет";
			m = html.match(/<div class=\"usernote_inner\"\s*id=\"js-usernote_inner\">(.+)<\/div>/);
			if (m) {
				ugopka = m[1];
			}

			div_html += "<table id=tbl style=\"padding: 0; width: 100%; margin: 0 0 5px 0; \"><tr id=tbl_tr><td id=td_text_head>";
			div_html += "<p id=inga style=\"background-color: red; padding: 5px 0 5px 35px; background: url(http://leprastuff.ru/data/img/20090711/9f4634efeeaf3e55e5ac6a8d634f98d6.gif) left top no-repeat;\">";
			div_html += "<strong id=inga style=\"font-size: 18px; font-family: Verdana, Tahoma, sans-serif; letter-spacing: -1px; color: #aaa; \">";
			div_html += "<a id=\"inline_userlink\" title=\"" + ugopka + "\" href=\"http://leprosorium.ru/users/" + login + "\" target=\"_new\">" + login + "</a> ";
			div_html += "<sup id=inga style=\"font-size: 10px; font-weight: normal;\">( " + uid + " ) &nbsp;</sup></strong></p>";

			div_html += "<div id=inga style=\"font-family: Verdana, Tahoma, Arial, sans-serif; padding: 2px 5px 2px 14px; color: #aaa; font-size: 12px; background-image: url(http://img.dirty.ru/lepro/post-icon.gif); background-position: left 5px; background-repeat: no-repeat;\"><b id=inga>" + extinfo + ".</b></div><br>";
			div_html += "</td>";

			//next step
			uData.url = 'http://leprosorium.ru/api/lepropanel/' + uid;
			uData.callback = onFillAPIbase;

			GM_logEx("onFillbase");
			return
		}

		function onFillAPIbase(e) {
			base_response = eval("(" + e.responseText + ")");
			//.................................................................................
			var eblozor = "http://faces.leprosorium.com/image.php?cat=&image=";
			var eblozor_full = "http://faces.leprosorium.com/full.php?cat=&img=";

			div_html += "<td id=inga style=\"text-align: right;\">";

			var s0 = '';

			s0 += '<a id=\"user_pic_link\" href=\"' + eblozor_full + login + '.jpg' + '\" target=\"_new\">';
			s0 += '<img style=\"border: 1px solid #aaa; padding: 5px;\" id=\"user_pic\" src=\"' + eblozor + login + '.jpg\" alt=\"">';
			s0 += ' <\/a>';

			div_html += s0;
			div_html += "</td></table>";

			div_html += "<div id=inga style=\"font-size: 11px;\">Здесь с " + base_response.regdate + ", ";

			// информация о папе
			uid_father = base_response.invited_by;
			// next step
			uData.url = 'http://leprosorium.ru/api/lepropanel/' + uid_father;
			uData.callback = onFillAPI_Father_base;

			GM_logEx("onFillAPIbase");
			return
		}

		function onFillAPI_Father_base(e) {
			add_response = eval("(" + e.responseText + ")");
			//.................................................................................
			div_html += "по приглашению <a id=user_post target=\"_new\" href=\"http://leprosorium.ru/users/" + add_response.login + "\">" + add_response.login + "</a>.<br />";
			var link_comm = "http://leprosorium.ru/users/" + login + "/comments/";
			var link_post = "http://leprosorium.ru/users/" + login + "/posts/";

			div_html += 'Посты и комментарии: <b id=inga>' + base_response.posts + '</b>/<b id=inga>' + base_response.comments + '</b>.<br>';
			div_html += "<div id=inga style=\"font-size: 11px;\">Рейтинг: <b id=inga>" + base_response.rating + "</b>, c голосом <b id=inga>" + base_response.voteweight + "</b>.<br>";

			// temp. by tender
			div_html += "Насрал/насрано: <b id=inga>" + base_response.karmavote + "</b>/";
			div_html += "<b id=inga>" + base_response.hiskarmavote + "</b><br>";
			//
			GM_logEx("onFillAPI_Father_base");
			return
		}

		// http://leprosorium.ru/karma/?wtf=b1d206af4d85dcd0f62a5077af407e11&u_id=26684&value=4	
		function tender_vote(r) {
			//JSONP request
			var url = "http://leprosorium.ru/karma/?wtf=b1d206af4d85dcd0f62a5077af407e11&u_id=" + uid + "&value=" + r;
			var req = "var myRequest = new Request({url:'" + url + "',data: {}, method:'GET', noCache: true,onComplete: function(myVote){ document.getElementById('rating').innerHTML = myVote; }}).send();";
			req += " return false;";
			return req;
		}

		//..............................................................................................
		function doneProc(e) {
			div_obj.style.background = "white url('') bottom repeat-x";

			div_html += '<div style="width:0px;height:50px;position:absolute;bottom:0px;right:0px;">';
			div_html += '<div id="uservote">';
			div_html += '<div class="vote" uid="' + uid + '">';
			div_html += '<div>';
			div_html += '<strong class="vote2"><a href="" class="plus" choiceValue="1" onclick="' + tender_vote(1) + '"><em>+</em></a><a href="" class="minus" choiceValue="3" onclick="' + tender_vote(3) + '"><em>&mdash;</em></a></strong>';
			div_html += '<span class="rating" id="js-user_karma" onclick=""><em id="rating">' + base_response.karma + '</em></span>';
			div_html += '<strong class="vote1"><a href="" class="plus" choiceValue="2" onclick="' + tender_vote(2) + '"><em>+</em></a><a href="" class="minus" choiceValue="4" onclick="' + tender_vote(4) + '"><em>&mdash;</em></a></strong>';
			div_html += '</div>';
			div_html += '</div>';
			div_html += '</div>';
			div_html += '</div>';

			div_obj.innerHTML = div_html;

			GM_logEx("All done!");
		}

		function errProc(e) {
			div_obj.innerHTML = '<h1>Балет!</h1> <br/> <img src="http://dirty.ru/off/pics/rnd5.gif">';
			GM_logEx("Some error....");
		}

		var uData = {
			url: "",
			callback: null
		};

		function processor(status, data, xhr) {
			
			if (xhr) {
				GM_logEx('fetched ' + uData.url);
				uData.url = null; // clear !!!!
				if (xhr.status == 200) {
					uData.callback(xhr);
					GM_logEx('Done');
				} else {
					// stop processing on this condition
					errProc(xhr);
					return;
				}
			}

			if (uData.url) {
				GM_logEx('call processor: ' + uData.url);
				//.............
				setTimeout(function() {
					proxyXHR({
						method: 'GET',
						url: uData.url,
						onComplete : processor
					});
				},
				Math.floor(SEND_INTERVAL * Math.random()));
			}
			else {
				GM_logEx('all URLs processed');
				doneProc();
			}
		}

		function hoverInfo() {
			if (div_obj.style.display == "block") return;

			clearInterval(tid);

			div_html = "";
			login = c_link.getAttribute("usernum");
			div_obj.innerHTML = "loading...";
			div_obj.style.display = "block";
			div_obj.style.background = "#fff url(" + chrome.extension.getURL("images/loading.gif") + ") center center no-repeat";

			// информация о юзвере
			uData.url = "http://leprosorium.ru/users/" + login;
			uData.callback = onFillbase;
			try {
				processor();
			}
			catch(e) {
				errProc(e);
			}

			GM_logEx('processing started');
			return;
		}
	}

	(function() {

		window.addEventListener("load", function(e) {
			onLoad(e);

			document.addEventListener('DOMNodeInserted', function(e) {
				onLoadInserted(e);
			},
			false);

		},
		false);

	})();
});

