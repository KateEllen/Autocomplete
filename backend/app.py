from flask import Flask, jsonify, request
import json

app = Flask(__name__)

# Load the JSON data from the file
with open('./data/data.json', 'r') as file:
    data = json.load(file)
    print(data)


@app.route('/suggestions', methods=['GET'])
def get_suggestions():
    songs = []
    for band in data:
        for album in band['albums']:
            for song in album['songs']:
                songs.append({"artist": band["name"], "title": song["title"], "album":album["title"]})

    query = request.args.get('q', '').lower()
    if not query:
        return jsonify({'results': []})

    filtered_suggestions = [
        song for song in songs if query in song['title'].lower()
    ]

    return jsonify({'results': filtered_suggestions})


if __name__ == '__main__':
    app.run(debug=True)
