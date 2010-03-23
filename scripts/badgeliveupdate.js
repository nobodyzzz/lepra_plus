/**
*
*  Javascript trim, ltrim, rtrim
*  http://www.webtoolkit.info/
*
**/

function trim(str, chars) {
	return ltrim(rtrim(str, chars), chars);
}

function ltrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

function rtrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

readSettings(SHOW_ON_BADGE_KEY, function(showOnBadge) {
	if (["myunreadposts", "myunreadcomms", "inboxunreadposts", "inboxunreadcomms"].indexOf(showOnBadge) !== - 1) {
		var things = trim($("#things a span em").text().replace("мои вещи", ""));
		var inbox = $("#inbox a span em").text();
		var badgeText = '';

		switch (showOnBadge) {
		case "myunreadposts":
			if (things.indexOf("/") !== - 1) {
				badgeText = things.split("/")[0];
			}
			break;
		case "myunreadcomms":
			if (things.indexOf("/") !== - 1) {
				badgeText = things.split("/")[1].replace(/^0/, "");
			} else {
				badgeText = things;
			}
			break;
		case "inboxunreadposts":
			if (things.indexOf("/") !== - 1) {
				badgeText = inbox.split("/")[0];
			}
			break;
		case "inboxunreadcomms":
			if (things.indexOf("/") !== - 1) {
				badgeText = inbox.split("/")[1].replace(/^0/, "");
			} else {
				badgeText = inbox;
			}
		}
		chrome.extension.connect({ name: "setbadgetext" }).postMessage(badgeText);

	}
});

