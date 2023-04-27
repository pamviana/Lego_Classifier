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
    document.getElementById('sets_page').style.display = 'none';
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
    let pictureOutput = document.getElementById('output');
    //Adds the picture to the result screen
    pictureOutput.style.display = "block";
    pictureOutput.innerHTML = '<img src="' + picture + '"/>';
    
    //It hides the main screen before showing the result screen
    let previousContent = document.getElementById(previousScreen);
    previousContent.style.display = 'none'; 

    let cameraBox = document.getElementById("upload_page");
    cameraBox.style.display = 'block';
}

// It does a post to our API using the picture that was uploaded or taken. 
async function getPartNum(picture) {
    console.log("Picture", picture)
    try {
        const response = await fetch('http://127.0.0.1:5000/result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ picture: picture })
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.warn('Something went wrong.', error);
        return "There was an error";
    }
}

async function getColors(part_num) {
    try {
        const response = await fetch(`https://rebrickable.com/api/v3/lego/parts/${part_num}/colors/`, {
            method: 'GET',
            headers: {
                'Authorization': 'key d530e073c6d7da7db3e90c73e3d8b9af'
            }
        });
        const result = await response.json();
        console.log("Colors: ", result)
        const colors_select = document.getElementById("part-color");

        while (colors_select.firstChild) {
            colors_select.removeChild(colors_select.firstChild);
        }

        var option = document.createElement("option");
        option.text = "Select a color";
        option.value = "select-color";
        colors_select.options.add(option);

        for(let i=0;i<result.count;i++) {
            var option = document.createElement("option");
            option.text = result.results[i].color_name;
            option.value = result.results[i].color_id;
            colors_select.options.add(option);
        }

    } catch (error) {
        console.warn("Rebrickable API failed", error);
        return "Rebrickable API failed"
    }
}

// This function is called when the "Upload a picture" button or the button that takes a picture are pressed.
// It will send the picture to our back-end using the API we created in Python.
async function evalutePicture(picture){
    document.getElementById("loading-page").style.display = "flex";
    partNum = await getPartNum(picture);
    await getColors(partNum.partId);
    console.log("Part Num: ", partNum);
    document.getElementById("loading-page").style.display = "none";
    document.getElementById("part-id").value = partNum.partId;    
}


// Listener for when "Upload a picture" button is pressed
const file = document.getElementById('file');

file.addEventListener('change', function(){
    const files = file.files[0];
    if (files) {
        const fileReader = new FileReader();     
        fileReader.readAsDataURL(files);   
        fileReader.addEventListener("load", async function () {            
            const picture = fileReader.result;
            await evalutePicture(picture);            
            openResultScreen(this.result, "main_page");
        });    
        
    }
});

const color_select = document.getElementById('part-color');

color_select.addEventListener('change', function() {
    console.log(color_select.value);
    console.log(document.getElementById("part-id").value);
    getSets(color_select.value, document.getElementById("part-id").value);
});

async function getSets(colorID, partID){
    const colors_select = document.getElementById("part-color");

    if (colors_select.value != "select-color") {
        try {
            const response = await fetch(`https://rebrickable.com/api/v3/lego/parts/${partID}/colors/${colorID}/sets/`, {
                method: 'GET',
                headers: {
                    'Authorization': 'key d530e073c6d7da7db3e90c73e3d8b9af'
                }
            });
            const result = await response.json();
            document.getElementById('sets_count').textContent = result.count;
            
            setWrapper = document.getElementById('sets-page-wrapper');
            setWrapper.innerHTML = '';
    
            for (let i=0; i<result.count; i++) {         
                setWrapper.innerHTML += `<div class="set-wrapper"><img src=${result.results[i].set_img_url}><div class="set-info-wrapper"><p>${result.results[i].name}</p><p>${result.results[i].set_num}</p></div></div>`
            }
    
            console.log("Sets count: ", result.count)
    
        } catch (error) {
            console.warn("Rebrickable API failed", error);
            return "Rebrickable API failed"
        }
    }
}

function goToSetsPage(event) {
    event.preventDefault();
    if (document.getElementById("part-color").value != "select-color") {
        document.getElementById('sets_page').style.display = 'block';
    }    
}

function redirectToBuy(){
    partID = document.getElementById("part-id").value;
    url = `https://www.toypro.com/us/search?search=${partID}`;
    window.location.href = url;
}