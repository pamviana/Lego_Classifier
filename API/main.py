from flask import Flask, jsonify, request
from flask_cors import CORS
import tensorflow
import numpy as np
import cv2
from PIL import Image
from io import BytesIO
import base64

app = Flask(__name__)
CORS(app)


# get  http://127.0.0.1:5000/result
@app.route('/result', methods=['POST'])
def disp():
    classes = ['10247', '11090', '11211', '11212', '11214', '11458', '11476', '11477', '14704', '14719', '14769',
               '15068', '15070', '15100', '15379', '15392', '15535', '15573', '15712', '18651']
    index = [i for i in range(len(classes))]
    indexToClass = dict(zip(index, classes))
    picture = request.json['picture']
    picture_split = picture.split(";base64,")[-1]
    picture_binary = base64.b64decode(picture_split)
    image = Image.open(BytesIO(picture_binary))
    image.save('image.jpg', 'PNG')

    lego_model = tensorflow.keras.models.load_model('vgg16_lego20')
    img = cv2.imread('image.jpg')
    resized_img = cv2.resize(img, (64, 64))
    preprocess_input = tensorflow.keras.applications.mobilenet_v2.preprocess_input(resized_img)
    preds = lego_model.predict(np.array([preprocess_input]))

    indexPred = np.argmax(preds[0])
    classPred = indexToClass[indexPred]

    return jsonify({'partId': classPred}), 201


# We will get the classification for the picture here
def get_result(picture):
    return "result"


# driver function
if __name__ == '__main__':
    app.run(debug=True)

