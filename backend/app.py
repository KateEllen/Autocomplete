from flask import Flask, jsonify

app = Flask(__name__)


@app.route('/suggestions', methods=['GET'])
def get_suggestions():
    return jsonify({'results': ["test"]})


if __name__ == '__main__':
    app.run(debug=True)
