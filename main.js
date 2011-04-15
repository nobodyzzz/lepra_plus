String.prototype.fmt = function () {
    var txt = this;
    for (var i = 0; i < arguments.length; i++) {
        var exp = new RegExp('\\{' + (i) + '\\}', 'gm');
        txt = txt.replace(exp, arguments[i]);
    }
    return txt;
};
String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function setInfo(lepra) {
    var lastVote = lepra.karmavotes.pop();
    if (lastVote.attitude[0] !== "-") {
        lastVote.attitude = "+" + lastVote.attitude;
    }
    if (getClickBehavior() === "glagne") {
        chrome.browserAction.setTitle({
            title: "Карма: {0} ({1} {2})\nРейтинг: {3}\nМои вещи: {4}/{5}\nИнбокс: {6}/{7}".fmt(
            lepra.karma, lastVote.login, lastVote.attitude, lepra.rating, lepra.myunreadposts, lepra.myunreadcomms, lepra.inboxunreadposts, lepra.inboxunreadcomms)
        });
    }
    var showOnBadge = getShowOnBadge();
    if (showOnBadge !== "none") {
        var badgeText = lepra[showOnBadge] !== '0' ? lepra[showOnBadge] : '';
        chrome.browserAction.setBadgeText({
            text: badgeText
        });
    }

}

function updateInfo() {
    $.ajax({
        url: "http://leprosorium.ru/api/lepropanel",
        dataType: "json",
        error: function (xhr) {
            if (xhr.readyState == 4 && xhr.status == 404) {
                setInfo(JSON.parse(xhr.responseText))
            } else {
                chrome.browserAction.setTitle({
                    title: "Балет :("
                });
            }
        }
    });
}