function setPopupInformation(lepra) {
	var lastkarmavotes = "Last votes: \r\n";

	for (var i = 0; i < 3; i++) {
		var vote = lepra.karmavotes.pop();
		if (vote.attitude[0] !== "-") {
			vote.attitude = "+" + vote.attitude;
		}
		lastkarmavotes += vote.login + " " + vote.attitude + "\r\n";
	}
	$("#loading").hide();
	$("#result").show();
	$("#piska").text(lepra.karma + "/" + lepra.rating).attr({
		title: lastkarmavotes
	});
	$("#inbox").text(lepra.inboxunreadposts + "/" + lepra.inboxunreadcomms);
	$("#my").text(lepra.myunreadposts + "/" + lepra.myunreadcomms);
	$("#glagne").click(function() {
		gotourl('http://leprosorium.ru/');
	});
	$("#things").click(function() {
		gotourl('http://leprosorium.ru/my/');
	});
	$("#inboxes").click(function() {
		gotourl('http://leprosorium.ru/my/inbox/');
	});
}
function gotourl(_url) {
	chrome.windows.getCurrent(function(w) {
		chrome.tabs.getAllInWindow(w.id, function(tabs) {
			for (var i = 0, n = tabs.length; i < n; i += 1) {
				if (tabs[i].url && tabs[i].url === _url) {
					chrome.tabs.update(tabs[i].id, {
						selected: true
					});
					return;
				}
			}
			chrome.tabs.getSelected(w.id, function(tab) {
				if (tab.url === "chrome://newtab/") {
					chrome.tabs.update(tab.id, {
						url: _url
					});
					window.close();
				} else {
					chrome.tabs.create({
						url: _url
					});
				}
			});
		});
	});
}

$(function() {
	if (getClickBehavior() === 'popup') {
		var lastUpdate = Number(localStorage["lastupdatetime"] || "0");
		var lastUpdateSuccessed = localStorage["lastupdatesuccess"] || "false";

		if (lastUpdateSuccessed === "false" || (new Date().getTime() - lastUpdate) > 300000) {
			setTimeout(function() {
				$.ajax({
					url: "http://leprosorium.ru/api/lepropanel/",
					dataType: "json",
					success: function(lepra) {
						setPopupInformation(lepra);
						localStorage["lastupdatesuccess"] = true;
						localStorage["lastupdatelepra"] = JSON.stringify(lepra);
						localStorage["lastupdatetime"] = new Date().getTime();
					},
					error: function() {
						localStorage["lastupdatesuccess"] = false;
						$("#loading").hide();
						$("#error").show();
					}
				});
			},
			0);
		} else {
			setPopupInformation(JSON.parse(localStorage["lastupdatelepra"]));
		}
	} else {
		chrome.tabs.create({
			url: 'http://leprosorium.ru/'
		});
		window.close();
	}
});

