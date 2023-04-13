function openCamera(){
    mainBox = document.getElementById("main_page");
    mainBox.style.display = 'none';

    cameraBox = document.getElementById("camera_page");
    cameraBox.style.display = 'block';

    startCamera();
}

async function startCamera(){
    let video = document.querySelector("#video");
    let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
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
    console.log(screen)
    screen.style.display = 'none';

    mainBox = document.getElementById("main_page");
    mainBox.style.display = 'block';
}