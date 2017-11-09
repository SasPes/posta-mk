var trackingNumbers = new Array();

var nodeUrl = "";
if (window.location.href.endsWith("node")) {
    nodeUrl = window.location.origin + "/proxy?url=";
}

var urlPosta = nodeUrl + "http://www.posta.com.mk/tnt/api/query?id=";

function httpGetAsync(theUrl, callback, param)
{
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
    $Date = $TrackingData.find("Date");
    $Notice = $TrackingData.find("Notice");
    $Begining = $TrackingData.find("Begining");
    $End = $TrackingData.find("End");

    var trInfoDiv = document.getElementById(trackingNumbers.indexOf(param));
    trInfoDiv.appendChild(document.createElement("hr"));

    for (var i = 0; i < $Date.length; i++) {
        var dateTime = $Date[i].textContent;

        var trInfoTimeDiv = document.createElement("div");

        var trInfoTimeDivR = document.createElement("span");
        trInfoTimeDivR.appendChild(document.createTextNode("🕒 " + dateTime));
        trInfoTimeDiv.appendChild(trInfoTimeDivR);

        trInfoTimeDiv.appendChild(document.createElement("br"));
        trInfoTimeDiv.appendChild(document.createTextNode($Begining[i].textContent.split("(the former Yugoslav Republic of)")[0] + " ⇒ " + $End[i].textContent));

        trInfoTimeDiv.appendChild(document.createElement("br"));
        var trB = document.createElement("b");
        var note = document.createTextNode("🗒 " + $Notice[i].textContent);
        trB.appendChild(note);
        trInfoTimeDiv.appendChild(trB);

        trInfoTimeDiv.appendChild(document.createElement("hr"));

        trInfoDiv.appendChild(trInfoTimeDiv);
    }

    setTrackingNumberUpdates(param, $TrackingData.length);
};

var getData = function () {
    for (var param in trackingNumbers) {
        var parameter = trackingNumbers[param];
        httpGetAsync(urlPosta, callbackJson, parameter);
    }
};

var setTrackingNumberUpdates = function (trackingNumber, dataLength) {
    // tracking number updates
    var trNo = parseInt(localStorage.getItem(trackingNumber));
    if (trNo === undefined || trNo === null) {
        localStorage.setItem(trackingNumber, 0);
    } else {
        localStorage.setItem(trackingNumber, dataLength);
        if (trNo !== dataLength) {
            var bulletSpan = document.getElementById(trackingNumber);
            if (bulletSpan !== undefined && bulletSpan !== null) {
                bulletSpan.style.color = '#00AA00';
                var bullet = "";
                var i = 0;
                var bulletLength = dataLength > 10 ? 10 : dataLength;
                while (i < bulletLength) {
                    bullet = bullet + " " + String.fromCharCode(9679);
                    i++;
                }
                $(bulletSpan).text(bullet);

            }
        }
    }
};

var addTrackingNumber = function () {
    var trackingNumber = document.getElementById('trackingNumber').value;

    if (trackingNumber === '') {
        alert('Внеси број на пратка');
        return;
    }

    for (var i = 0; i < trackingNumbers.length; i++) {
        if (trackingNumbers[i] === trackingNumber) {
            alert('Број на пратката веќе постои');
            return;
        }
    }

    trackingNumbers[trackingNumbers.length] = trackingNumber;
    localStorage.setItem('trackingNumbers', JSON.stringify(trackingNumbers));
    document.getElementById('trackingNumber').value = "";
    showTrackingNumbers();
    reloadClicks();
    getData();
};

var showTrackingNumbers = function () {
    var trList = document.getElementById("tracking-numbers");
    trList.style.cssText = "padding-left: 35px;";

    var trDivTempRemove = document.getElementById("trDivTemp");
    if (trDivTempRemove) {
        trList.removeChild(trDivTempRemove);
    }

    var trDivTemp = document.createElement("div");
    $(trDivTemp).attr('id', 'trDivTemp');
    trList.appendChild(trDivTemp);

    for (var tr in trackingNumbers) {
        var trDiv = document.createElement("div");
        $(trDiv).attr('id', 'div' + tr);

        var dtAtt = document.createAttribute("data-toggle");
        dtAtt.value = "collapse";
        trDiv.setAttributeNode(dtAtt);

        var dttAtt = document.createAttribute("data-target");
        dttAtt.value = "#" + tr;
        trDiv.setAttributeNode(dttAtt);

        var trSpan = document.createElement("span");
        trSpan.className = "glyphicon glyphicon-menu-down";
        trSpan.style.cssText = "font-size: 10px; top: 0;";
        $(trSpan).attr('id', 'span' + tr);

        trDiv.className = "div-trno";
        var trB = document.createElement("b");
        var trNum = document.createTextNode(" " + trackingNumbers[tr]);
        trB.appendChild(trSpan);
        trB.appendChild(trNum);

        var trashSpan = document.createElement("span");
        trashSpan.className = "glyphicon glyphicon-trash";
        trashSpan.style.cssText = "font-size: 12px; float: right; padding-top: 4px; padding-right: 4px;";
        $(trashSpan).attr('id', 'trashSpan' + tr);
        trDiv.appendChild(trashSpan);

        var editSpan = document.createElement("span");
        editSpan.className = "glyphicon glyphicon-edit";
        editSpan.style.cssText = "font-size: 12px; float: right; padding-top: 4px; padding-right: 4px;";
        $(editSpan).attr('id', 'editSpan' + tr);
        trDiv.appendChild(editSpan);

        trDiv.appendChild(trB);

        var dataNoSpan = document.createElement("span");
        dataNoSpan.id = trackingNumbers[tr];
        var trNo = parseInt(localStorage.getItem(trackingNumbers[tr]));
        if (trNo !== 0) {
            var bullet = "";
            var i = 0;
            var bulletLength = trNo > 10 ? 10 : trNo; // max 10 bullets
            while (i < bulletLength) {
                bullet = bullet + " " + String.fromCharCode(9679);
                i++;
            }
            var dataNo = document.createTextNode(bullet);
            dataNoSpan.style.position = 'relative';
            dataNoSpan.style.float = 'right';
            dataNoSpan.style.top = '-2px';
            dataNoSpan.style.right = '10px';
            dataNoSpan.appendChild(dataNo);
            trDiv.appendChild(dataNoSpan);
        }

        var trInfoDiv = document.createElement("div");

        var idAtt = document.createAttribute("id");
        idAtt.value = tr;
        trInfoDiv.setAttributeNode(idAtt);
        trInfoDiv.className = "collapse";
        trInfoDiv.style.cssText = "text-align: left; font-size: 12px; width: 330px;";

        // add notes
        trDiv.title = localStorage.getItem(trackingNumbers[tr] + "-note");
        if (trDiv.title === "null") {
            trDiv.title = '';
        }

        trDivTemp.appendChild(trDiv);
        trDivTemp.appendChild(trInfoDiv);

        var blankDiv = document.createElement("div");
        blankDiv.style.cssText = "height: 3px;";
        trDivTemp.appendChild(blankDiv);
    }
};

var init = function () {
    chrome.browserAction.setBadgeText({text: ""});
    
    // tracking numbers
    var trackingNumbersLS = localStorage.getItem("trackingNumbers");
    if (trackingNumbersLS !== null) {
        trackingNumbers = JSON.parse(trackingNumbersLS);
    }

    localStorage.setItem('trackingNumbers', JSON.stringify(trackingNumbers));

    document.getElementById("trackingNumber")
            .addEventListener("keyup", function (event) {
                event.preventDefault();
                if (event.keyCode === 13) {
                    document.getElementById("addButton").click();
                }
            });

    showTrackingNumbers();

    // data get
    getData();
};

var reloadClicks = function () {
    for (let tr in trackingNumbers) {
        $('#div' + tr).click(function () {
            var collapse = $('#' + tr).attr("aria-expanded");
            if (collapse === undefined || collapse === "false") {
                $('#span' + tr).removeClass('glyphicon glyphicon-menu-down');
                $('#span' + tr).addClass('glyphicon glyphicon-menu-up');
            } else {
                $('#span' + tr).removeClass('glyphicon glyphicon-menu-up');
                $('#span' + tr).addClass('glyphicon glyphicon-menu-down');
            }
        });

        $('#trashSpan' + tr).click(function () {
            if (confirm('Дали навистина скате да го избришете бројот на пратка?')) {
                trackingNumbers.splice(tr, 1);
                localStorage.setItem('trackingNumbers', JSON.stringify(trackingNumbers));
                showTrackingNumbers();
                reloadClicks();
            }
        });

        $('#editSpan' + tr).click(function () {
            var itemNote = prompt('Внесете содржина на пратката:');
            localStorage.setItem(trackingNumbers[tr] + "-note", itemNote);
            showTrackingNumbers();
            reloadClicks();
        });
    }
};

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('addButton').addEventListener('click', addTrackingNumber);
    document.getElementById('reloadButton').addEventListener('click', init);
    init();
    reloadClicks();
});