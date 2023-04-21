let stream; //not best practice, because it is a global variable, but this application is very small, so it is fine here
let height = 0;
let width = 400;

// It is called when the 'Take a picture' button is called
// It opens the camera page, and hide the main page
function openCamera(){
    let mainBox = document.getElementById("main_page");
    mainBox.style.display = 'none';

    let cameraBox = document.getElementById("camera_page");
    cameraBox.style.display = 'block';

    startCamera();
}

// It turns on the webcam
async function startCamera(){
    let video = document.querySelector("#video");
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
    height = (video.videoHeight / video.videoWidth) * width;

    if (isNaN(height)) {
        height = width / (4 / 3);
    }

    video.setAttribute("width", width);
    video.setAttribute("height", height);
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
}


function takePicture(){
    let canvas = document.querySelector("#canvas");
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    let image_data_url = canvas.toDataURL('image/jpeg');

    // It makes sure to turn off the camera before it takes you to the result screen
    if(stream != undefined) {
        stream.getTracks()[0].stop();
    }

    openResultScreen(image_data_url, "camera_page");

}

// It is called when the button "Back" is pressed.
function goBackToMain(currentScreen) {
    let screen = document.getElementById(currentScreen);
    screen.style.display = 'none';

    let mainBox = document.getElementById("main_page");
    mainBox.style.display = 'block';

    if(stream != undefined) {
        stream.getTracks()[0].stop();
    }
}

// It gets the result and opens the screen 
function openResultScreen(picture, previousScreen){
    console.log(picture.slice(0,20));
    evalutePicture("hardcoded result");
    let pictureOutput = document.getElementById('output');
    //Adds the picture to the result screen
    pictureOutput.style.display = "block";
    pictureOutput.innerHTML = '<img src="' + picture + '" object-fit: cover;"/>';
    
    //It hides the main screen before showing the result screen
    let previousContent = document.getElementById(previousScreen);
    previousContent.style.display = 'none'; 

    let cameraBox = document.getElementById("upload_page");
    cameraBox.style.display = 'block';
}

// It does a post to our API using the picture that was uploaded or taken. 
async function getResultForPicture(picture) {
    const data = { 'picture': picture }
    try {
        const response = await fetch('http://127.0.0.1:5000/result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return result.result;
    } catch (error) {
        console.warn('Something went wrong.', error);
        return "There was an error";
    }
}

// This function is called when the "Upload a picture" button or the button that takes a picture are pressed.
// It will send the picture to our back-end using the API we created in Python.
async function evalutePicture(picture){
    output = await getResultForPicture(picture);
    console.log(output);

    //It sets the <p> tag for the result text, for example "Harry Potter Minifigure"
    document.getElementById('result-text').innerHTML = output;
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