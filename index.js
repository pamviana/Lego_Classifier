let stream; //not best practice, but this application is very small

function openCamera(){
    let mainBox = document.getElementById("main_page");
    mainBox.style.display = 'none';

    let cameraBox = document.getElementById("camera_page");
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

    if(stream != undefined) {
        stream.getTracks()[0].stop();
    }

    openResultScreen(image_data_url, "camera_page");

}

function goBackToMain(currentScreen) {
    let screen = document.getElementById(currentScreen);
    screen.style.display = 'none';

    let mainBox = document.getElementById("main_page");
    mainBox.style.display = 'block';

    if(stream != undefined) {
        stream.getTracks()[0].stop();
    }
}

function openResultScreen(picture, previousScreen){
    let pictureOutput = document.getElementById('output');
    pictureOutput.style.display = "block";
    pictureOutput.innerHTML = '<img src="' + picture + '" style="height: 100%; width: 80%; object-fit: cover;"/>';

    let resultText = document.getElementById('result-text');
    resultText.innerHTML = "Harry Potter minifigure";
        
    let previousContent = document.getElementById(previousScreen);
    previousContent.style.display = 'none'; 

    let cameraBox = document.getElementById("upload_page");
    cameraBox.style.display = 'block';

    testAPI();
}

function testAPI() {
    fetch('http://127.0.0.1:5000/result')
    .then(function (response) {
        console.log('success!', response);
    })
    .catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });
}


// Listener for when "Upload a picture" button is pressed
const file = document.getElementById('file');

file.addEventListener('change', function(){
    const files = file.files[0];
    if (files) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(files);
    fileReader.addEventListener("load", function () {
        openResultScreen(this.result, "main_page");
    });    
  }
});