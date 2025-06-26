from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze_emotion', methods=['POST'])
def analyze_emotion():
    # Simulate emotion detection logic for the uploaded file
    file = request.files.get('audio_file')

    if file:
        emotions = ['happy', 'sad', 'angry', 'tired', 'emotional', 'neutral']
        detected_emotion = random.choice(emotions)
        return jsonify({'emotion': detected_emotion})
    else:
        return jsonify({'error': 'No file uploaded'}), 400

if __name__ == '__main__':
    app.run(debug=True)
