let stream; //not best practice, but this application is very small

function openCamera(){
    mainBox = document.getElementById("main_page");
    mainBox.style.display = 'none';

    cameraBox = document.getElementById("camera_page");
    cameraBox.style.display = 'block';

    startCamera();
}

async function startCamera(){
    let video = document.querySelector("#video");
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
}

function takePicture(){
    let canvas = document.querySelector("#canvas");
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    let image_data_url = canvas.toDataURL('image/jpeg');

    console.log(image_data_url);
}

function goBackToMain(currentScreen) {
    let screen = document.getElementById(currentScreen);
    screen.style.display = 'none';

    mainBox = document.getElementById("main_page");
    mainBox.style.display = 'block';

    if(currentScreen == 'camera_page') {
        stream.getTracks()[0].stop();
    }
}

function openUploadPage(){
    mainBox = document.getElementById("main_page");
    mainBox.style.display = 'none'; 

    cameraBox = document.getElementById("upload_page");
    cameraBox.style.display = 'block';
}

function handleFileSelect(event) {
    event.stopPropagation();
    event.preventDefault();

    var files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    var file = files[0];

    if (file.type.match('image.*')) {
        var reader = new FileReader();

        reader.onload = (function(theFile) {
            return function(e) {
                var img = document.createElement('img');
                img.src = e.target.result;

                // Do something with the image here
                // For example, add it to the DOM
                var imageContainer = document.querySelector('#image-container');
                imageContainer.appendChild(img);
            };
        })(file);

        reader.readAsDataURL(file);
    } else {
        alert('Please select an image file');
    }
}

var dropZone = document.querySelector('#drop-zone');

dropZone.addEventListener('dragover', function(event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
});

dropZone.addEventListener('drop', handleFileSelect);

var fileInput = document.querySelector('#file-input');

fileInput.addEventListener('change', handleFileSelect);