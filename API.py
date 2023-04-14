from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# get  http://127.0.0.1:5000/result
@app.route('/result', methods=['POST'])
def disp():
    picture = request.json['picture']

    result = get_result(picture)

    return jsonify({'result': picture}), 201


# We will get the classification for the picture here
def get_result(picture):
    return "result"


# driver function
if __name__ == '__main__':
    app.run(debug=True)

