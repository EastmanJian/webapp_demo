var dropzone;


window.onload = function () {
    dropzone = document.getElementById("dropzone");
    dropzone.ondragover = dropzone.ondragenter = function (event) {
        dropzone.style.backgroundColor = "gray";
        event.stopPropagation();
        event.preventDefault();
    }

    dropzone.ondragleave = function () {
        dropzone.style.backgroundColor = "white";
    }

    dropzone.ondrop = function (event) {
        dropzone.style.backgroundColor = "white";
        event.stopPropagation();
        event.preventDefault();

        var filesArray = event.dataTransfer.files;
        showFiles(filesArray);
    }
}

function showFiles(files) {
    dropzone.innerHTML = "";
    var list = document.createElement("ul");
    dropzone.appendChild(list);
    for (var i = 0; i < files.length; i++) {
        var li = document.createElement("li");
        list.appendChild(li);

        var info = document.createElement("span");
        info.innerHTML = files[i].name + ": " + files[i].size + " bytes";
        info.file = files[i];
        info.classList.add("obj");
        li.appendChild(info);

    }
    var UploadBtn = document.createElement("button");
    UploadBtn.id = "UploadBtn";
    UploadBtn.innerText = "Upload";
    UploadBtn.onclick = sendFiles;
    dropzone.appendChild(UploadBtn);
}

function sendFiles() {
    document.getElementById("UploadBtn").style.display = "none";
    var items = document.querySelectorAll(".obj");

    for (var i = 0; i < items.length; i++) {
        new FileUpload(items[i], items[i].file);
    }
}

function FileUpload(item, file) {
    this.ctrl = createThrobber(item);
    var xhr = new XMLHttpRequest();
    this.xhr = xhr;
    var self = this;
    var fd = new FormData();

    this.xhr.upload.addEventListener("progress", function (e) {
        if (e.lengthComputable) {
            var percentage = Math.round((e.loaded * 100) / e.total);
            self.ctrl.update(percentage);
        }
    }, false);

    xhr.upload.addEventListener("load", function (e) {
        self.ctrl.update(100);
    }, false);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
        }
    };


    xhr.open("POST", "/webapp_demo/file_upload/upload", true);
    fd.append('destination', '/home/eastman');
    fd.append('file', file);

    xhr.send(fd);


}


function createThrobber(item) {
    var progress = document.createElement("span");
    progress.innerText = "[0%] ";
    var li = item.parentNode;
    li.insertBefore(progress, item);
    return new Throbber(progress);
}

function Throbber(element) {
    this.element = element;
    this.update = function (percentage) {
        this.element.innerText = "[" + percentage + "%] ";
    }
}
