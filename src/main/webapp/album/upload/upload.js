window.URL = window.URL || window.webkitURL;

var fileSelect, fileElem, fileList

function initPage() {
    fileSelect = document.getElementById("fileSelect");
    fileElem = document.getElementById("fileElem");
    fileList = document.getElementById("fileList");

    fileSelect.addEventListener("click", function (e) {
        if (fileElem) {
            fileElem.click();
        }
        e.preventDefault(); // prevent navigation to "#"
    }, false);
}

function handleFiles(files) {
    if (!files.length) {
        fileList.innerHTML = "<p>No files selected!</p>";
    } else {
        fileList.innerHTML = "";
        var list = document.createElement("ul");
        fileList.appendChild(list);
        for (var i = 0; i < files.length; i++) {
            var li = document.createElement("li");
            list.appendChild(li);

            var img = document.createElement("img");
            img.classList.add("obj");
            img.src = window.URL.createObjectURL(files[i]);
            img.height = 60;
            img.onload = function () {
                window.URL.revokeObjectURL(this.src);
            }
            li.appendChild(img);
            var info = document.createElement("span");
            info.innerHTML = files[i].name + ": " + files[i].size + " bytes";
            li.appendChild(info);

        }
        var UploadBtn = document.createElement("button");
        UploadBtn.id = "UploadBtn";
        UploadBtn.innerText = "Upload";
        UploadBtn.onclick = sendFiles;
        fileList.appendChild(UploadBtn);

    }
}

function sendFiles() {
    var imgs = document.querySelectorAll(".obj");

    for (var i = 0; i < imgs.length; i++) {
        new FileUpload(imgs[i], imgs[i].file);
    }
}



function FileUpload(img, file) {
    var reader = new FileReader();
    this.ctrl = createThrobber(img);
    var xhr = new XMLHttpRequest();
    this.xhr = xhr;

    var self = this;
    this.xhr.upload.addEventListener("progress", function(e) {
        if (e.lengthComputable) {
            var percentage = Math.round((e.loaded * 100) / e.total);
            self.ctrl.update(percentage);
        }
    }, false);

    xhr.upload.addEventListener("load", function(e){
        self.ctrl.update(100);
        var canvas = self.ctrl.ctx.canvas;
        canvas.parentNode.removeChild(canvas);
    }, false);
    xhr.open("POST", "/webapp_demo/file_upload/upload");
    xhr.overrideMimeType('text/plain; charset=utf-8');
    reader.onload = function(evt) {
        xhr.send(evt.target.result);
    };
    reader.readAsBinaryString(file); //Todo: debug - Failed to execute 'readAsBinaryString' on 'FileReader': parameter 1 is not of type 'Blob'. Alternative: use FormData like ajaxupload.html
}


function createThrobber(img) {
    var progress = document.createElement("span");
    progress.innerText = "_0%_";
    var li = img.parentNode;
    li.insertBefore(progress, img);
    return new Throbber(progress);
}

function Throbber(element) {
    this.element = element;
    this.update = function (percentage) {
        element.innerText = "_" + percentage + "_";
    }
}

window.addEventListener("load", initPage);