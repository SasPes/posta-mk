var min = 15;
var update = 0;
var urlPosta = "http://www.posta.com.mk/tnt/api/query?id=";

function httpGetAsync(theUrl, callback, param) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            callback(xmlHttp.responseText, param);
    };
    xmlHttp.open("GET", theUrl + param, true); // true for asynchronous 
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xmlHttp.send();
}

var callbackJson = function (res, param) {
    var xmlRes = $.parseXML(res);
    $xml = $(xmlRes);
    $TrackingData = $xml.find("TrackingData");
    setTrackingNumberUpdates(param, $TrackingData.length);
};

var setTrackingNumberUpdates = function (trackingNumber, dataLength) {
    // tracking number updates
    var trNo = parseInt(localStorage.getItem(trackingNumber));
    if (trNo === undefined || trNo === null) {
        trNo = 0;
    }
    if (trNo !== dataLength) {
        setIconText();
    }

};

var setIconText = function () {
    update++;
    chrome.browserAction.setBadgeText({text: update.toString()});
    chrome.browserAction.setBadgeBackgroundColor({"color": [255, 0, 0, 255]}); // zelena
};

var getData = function () {
    for (var param in trackingNumbers) {
        var parameter = trackingNumbers[param];
        httpGetAsync(urlPosta, callbackJson, parameter);
    }
    if (update === 0) {
        chrome.browserAction.setBadgeText({text: ""});
    }
};

var init = function () {
    var trackingNumbersLS = localStorage.getItem("trackingNumbers");
    if (trackingNumbersLS !== null) {
        trackingNumbers = JSON.parse(trackingNumbersLS);
    }

    localStorage.setItem('trackingNumbers', JSON.stringify(trackingNumbers));

    // data get
    update = 0;
    getData();
};

init();

window.setInterval(function () {
    init();
}, 1000 * 60 * min); // 15 min