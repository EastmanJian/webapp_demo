
var ws = new WebSocket("wss://eastmanjian.cn/webapp_demo/timeClock");
var pattSessionID = /session_ID: /;
var pattUserCnt = /Total online users: /;
var pattRobotCnt = /Total online robots: /;
var msgbox = document.getElementById("msgDiag");


ws.onopen = function (evt) {
    log("Connected to Time Clock Bridge.");
    ws.send("-----USER-----");
};

ws.onmessage = function (evt) {
    let msg = evt.data;
    log(msg);

    //if the msg contains the current user session ID information, update it in the panel.
    if (pattSessionID.test(msg)) {
        document.getElementById("sessionID").innerText = msg.replace(pattSessionID, "");
    }

    //if the msg contains the number of users information, update it in the panel.
    if (pattUserCnt.test(msg)) {
        document.getElementById("Users").innerText = msg.replace(pattUserCnt, "");
    }

    //if the msg contains the number of users information, update it in the panel.
    if (pattRobotCnt.test(msg)) {
        document.getElementById("Robots").innerText = msg.replace(pattRobotCnt, "");
    }
};

ws.onclose = function (evt) {
    log("Quit the bridge.");
};


function checkIn() {
    let lanID = document.getElementById("lanIDInput").value;
    let msg = "Hi Robot, please help me check in. My Lan ID is: " + lanID;
    ws.send(msg);
}

function sendMsg() {
    let msg = document.getElementById("msgInput").value;
    ws.send(msg);
}

function log(msg) {
    msgbox.append(msg + "\n");
    msgbox.scrollTop = msgbox.scrollHeight;
}

function closeCon() {
    ws.close();
}

function validateLanID() {
    let lanID = document.getElementById("lanIDInput").value;
    let checkInBtn = document.getElementById("chkInBtn");
    checkInBtn.disabled = (lanID == "") ? true : false;
}


validateLanID();
