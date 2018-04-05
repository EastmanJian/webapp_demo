var webSocketUrl = "wss://eastmanjian.cn/webapp_demo/timeClock";
var ws;
var regexpSessionID = /session_ID: /;
var regexpUserCnt = /Total users: /;
var regexpRobotCnt = /Total robots: /;
var regexpCheckIn = /^.*Hi Robot, please help me check in. My Lan ID is: /;
var regexpSuccessful = /Clock in successfully/i;
var msgbox = document.getElementById("msgDiag");
var urlPara = location.search;
var heartbeatMsg = "Robot heartbeat.";
var regexpHeartbeat = /^.*Robot heartbeat./;
var heartbeatStatus = true;

//get the land ID from URL
var regexpLanID = /^.*LanID=/;
var lanID = urlPara.replace(regexpLanID, "");
document.getElementById("checkLanID").value = lanID;

initBridge();

setInterval(keepConnection, 300 * 1000);

function initBridge() {
    ws = new WebSocket(webSocketUrl);

    ws.onopen = function (evt) {
        log("Connected to Time Clock Bridge.");
        ws.send("-----ROBOT-----");
    };

    ws.onmessage = function (evt) {
        let msg = evt.data;
        let isLogMsg = true;

        //if the msg contains the current user session ID information, update it in the panel.
        if (regexpSessionID.test(msg)) {
            document.getElementById("sessionID").innerText = msg.replace(regexpSessionID, "");
        }

        //if the msg contains the number of users information, update it in the panel.
        if (regexpUserCnt.test(msg)) {
            document.getElementById("Users").innerText = msg.replace(regexpUserCnt, "");
        }

        //if the msg contains the number of users information, update it in the panel.
        if (regexpRobotCnt.test(msg)) {
            document.getElementById("Robots").innerText = msg.replace(regexpRobotCnt, "");
        }

        //if the msg is asking for check in.
        if (regexpCheckIn.test(msg)) {
            let requestLanID = msg.replace(regexpCheckIn, "");
            //let loginLanID = document.getElementById("loginLanID").value;
            document.getElementById("checkLanID").value = requestLanID;
            document.getElementById("robotAction").value = "TapCard";
        }

        if (regexpHeartbeat.test(msg)) {
            heartbeatStatus = true;
            console.log(heartbeatMsg);
            isLogMsg = false;
        }

        if (isLogMsg) log(msg);

    };

    ws.onclose = function (evt) {
        log("Connection to the bridge is closed.");
    };

    ws.onerror = function (evt) {
        log("WebSocket Err: " + evt.data);
    }
}


function sendMsg() {
    let msg = document.getElementById("msgInput").value;
    ws.send(msg);

    //if the msg indicates check in successfully, update the action field.
    if (regexpSuccessful.test(msg)) {
        document.getElementById("robotAction").value = "Done";
    }
}

function log(msg) {
    msgbox.value += msg + "\n";
    msgbox.scrollTop = msgbox.scrollHeight;
}

function closeCon() {
    ws.close();
}

function closeAllRobotCon () {
    ws.send("Close All Robot Connections!");
}

function keepConnection() {
    heartbeatStatus = false;
    if (ws.readyState == 1) ws.send(heartbeatMsg);
    setTimeout(checkHeartbeatAndReconnect, 2000);
}

function checkHeartbeatAndReconnect() {
    if (ws.readyState != 1 || heartbeatStatus == false) {
        log("WebSocket connection maybe lost, try to reconnect...");
        ws.close();
        initBridge();
    }
}