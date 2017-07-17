var trackingNumbers = new Array();

var nodeUrl = "";
if (window.location.href.endsWith("node")) {
    nodeUrl = window.location.origin + "/proxy?url=";
}

var urlPosta = nodeUrl + "http://www.posta.com.mk:82/Magic.asmx/TrackAndTrace";

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function httpGetAsync(theUrl, callback, param)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            callback(xmlHttp.responseText, param);
    };
    xmlHttp.open("POST", theUrl, true); // true for asynchronous 
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xmlHttp.send("code=" + param + "&language=MK");
}

var callbackJson = function (res, param) {
    var xmlRes = $.parseXML(res);
    $xml = $(xmlRes);

    $TrackingData = $xml.find("TrackingData");
    $Date = $TrackingData.find("Date");
    $Notice = $TrackingData.find("Notice");


    var trInfoDiv = document.getElementById(trackingNumbers.indexOf(param));
    trInfoDiv.appendChild(document.createElement("br"));

    for (var i = 0; i < $Date.length; i++) {
        var dateTime = $Date[i].textContent.split(" ");
        
        var trInfoTimeDiv = document.createElement("div");
        
        var timeSpan = document.createElement("span");
        timeSpan.className = "glyphicon glyphicon-time";
        
        var lockSpan = document.createElement("span");
        lockSpan.className = "glyphicon glyphicon-lock";
        
        trInfoTimeDiv.appendChild(lockSpan);
        trInfoTimeDiv.appendChild(document.createTextNode(" " + $Notice[i].textContent));
        
        var trInfoTimeDivR = document.createElement("span");
        trInfoTimeDivR.style.cssText = "float: right;";
        trInfoTimeDivR.appendChild(timeSpan);
        trInfoTimeDivR.appendChild(document.createTextNode(" " + dateTime[0] + "<br/>" + dateTime[1]));
        trInfoTimeDiv.appendChild(trInfoTimeDivR);
        
        trInfoTimeDiv.appendChild(document.createElement("br"));
        trInfoTimeDiv.appendChild(document.createElement("hr"));
        
        trInfoDiv.appendChild(trInfoTimeDiv);
    }
};

var getData = function () {
    for (var param in trackingNumbers) {
        var parameter = trackingNumbers[param];
//        document.getElementById(parameter).innerHTML = "\u043D\u0435\u043C\u0430 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0458\u0430";
        httpGetAsync(urlPosta, callbackJson, parameter);
    }
};

var addTrackingNumber = function () {
    var trackingNumber = document.getElementById('trackingNumber').value;

    for (var i = 0; i < trackingNumbers.length; i++) {
        if (trackingNumbers[i] === trackingNumber) {
            alert('Item Exist');
            return;
        }
    }

    trackingNumbers[trackingNumbers.length] = trackingNumber;
    localStorage.setItem('trackingNumbers', JSON.stringify(trackingNumbers));
    document.getElementById('trackingNumber').value = "";
    showTrackingNumbers();
    reloadClicks();
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
        trSpan.style.cssText = "font-size: 10px;";
        $(trSpan).attr('id', 'span' + tr);

        trDiv.style.cssText = "\
            font-size: 15px; \n\
            text-align: left; \n\
            padding-left: 5px; \n\
            background-color: AliceBlue; \n\
            width: 330px;\n\
        ";
        var trB = document.createElement("b");
        var trNum = document.createTextNode(" " + trackingNumbers[tr]);
        trB.appendChild(trSpan);
        trB.appendChild(trNum);
        trDiv.appendChild(trB);

        var trInfoDiv = document.createElement("div");

        var idAtt = document.createAttribute("id");
        idAtt.value = tr;
        trInfoDiv.setAttributeNode(idAtt);
        trInfoDiv.className = "collapse";
        trInfoDiv.style.cssText = "text-align: left; font-size: 12px; width: 330px;";
//        trInfoDiv.appendChild(document.createTextNode("\u041D\u0435\u043C\u0430 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438"));

        var trashSpan = document.createElement("span");
        trashSpan.className = "glyphicon glyphicon-trash";
        trashSpan.style.cssText = "font-size: 12px; float: right; padding-top: 4px; padding-right: 4px;";
        $(trashSpan).attr('id', 'trashSpan' + tr);
        trInfoDiv.appendChild(trashSpan);

        trDivTemp.appendChild(trDiv);
        trDivTemp.appendChild(trInfoDiv);

        var blankDiv = document.createElement("div");
        blankDiv.style.cssText = "height: 3px;";
        trDivTemp.appendChild(blankDiv);
    }
};

var init = function () {
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
            trackingNumbers.splice(tr, 1);
            localStorage.setItem('trackingNumbers', JSON.stringify(trackingNumbers));
            showTrackingNumbers();
            reloadClicks();
        });
    }
};

document.addEventListener('DOMContentLoaded', function () {
    init();
    reloadClicks();
});