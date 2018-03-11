var dropzone;

/**
 * init the dropzone allowing drag and drop files in it.
 */
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

/**
 * show the dropped files' name and size in the dropzone
 * @param files
 */
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

/**
 * wrapper function to call FileUpload for the list of files
 */
function sendFiles() {
    document.getElementById("UploadBtn").style.display = "none";
    var items = document.querySelectorAll(".obj");

    for (var i = 0; i < items.length; i++) {
        new FileUpload(items[i], items[i].file);
    }
}

/**
 * FileUpload Object.
 * use XMLHttpRequest and FormData to POST file to server
 * @param item - the file UI item
 * @param file - the file object
 * @constructor
 */
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


    xhr.open("POST", "/webapp_demo/file_tran/upload", true);
    fd.append('destination', '/srv/www/htdocs/userfiles');
    fd.append('file', file);

    xhr.send(fd);


}

/**
 * create the progress Throbber
 * @param item
 * @returns {Throbber}
 */
function createThrobber(item) {
    var progress = document.createElement("span");
    progress.innerText = "[0%] ";
    var li = item.parentNode;
    li.insertBefore(progress, item);
    return new Throbber(progress);
}

/**
 * Throbber Object
 * @param element - the element to display the throbber (use text progress here only for demo)
 * @constructor
 */
function Throbber(element) {
    this.element = element;
    this.update = function (percentage) {
        this.element.innerText = "[" + percentage + "%] ";
    }
}
