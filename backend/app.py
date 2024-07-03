from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import openai
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access environment variables
api_key = os.getenv('OPENAI_API_KEY')


app = Flask(__name__, static_folder='./build', static_url_path='')
CORS(app)

# Load the JSON data from the file
with open('./data/data.json', 'r') as file:
    data = json.load(file)


@app.route('/suggestions', methods=['GET'])
def get_suggestions():
    songs = []
    for band in data:
        for album in band['albums']:
            for song in album['songs']:
                songs.append(
                    {"artist": band["name"], "title": song["title"], "album": album["title"]})

    query = request.args.get('q', '').lower()
    search_by = request.args.get('search_by', 'title').lower()
    print(f"Search query: {query}, search by: {search_by}")  # Debugging print

    if not query:
        return jsonify({'results': []})

    if search_by == 'title':
        filtered_suggestions = [
            song for song in songs if query in song['title'].lower()
        ]
    elif search_by == 'artist':
        filtered_suggestions = [
            song for song in songs if query in song['artist'].lower()
        ]

    elif search_by == 'album':
        filtered_suggestions = [
            song for song in songs if query in song['album'].lower()
        ]
    else:
        return jsonify({'results': []})

    return jsonify({'results': filtered_suggestions})


@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

# Endpoint to fetch fun facts using OpenAI API

@app.route('/funfact', methods=['POST'])
def get_fun_fact():
    client = openai.OpenAI(api_key=api_key)
    data = request.get_json()
    query = data.get('query', '')
    context = data.get('context', '')

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": f"{query}: {context}"}],
            max_tokens=100,
        )
        
        if response.choices and response.choices[0].message and response.choices[0].message.content:
            fun_fact = response.choices[0].message.content
            print("Generated Fun Fact:", fun_fact)
            return jsonify({'fun_fact': fun_fact})
        else:
            return jsonify({'error': 'Invalid response from OpenAI'}), 500

    except Exception as e:
        print("Error from OpenAI API:", e)
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
