from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

data = {
    "result": 22,
    "name": "Pamella"
}

# get  http://127.0.0.1:5000/result
@app.route('/result', methods=['GET'])
def disp():
    return jsonify({'data': 100 ** 2})


# driver function
if __name__ == '__main__':
    app.run(debug=True)

