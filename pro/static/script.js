function startRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Your browser does not support speech recognition.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function() {
        console.log("Speech recognition started...");
    };

    recognition.onspeechend = function() {
        recognition.stop();
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        const outputDiv = document.getElementById("output");

        // Example Emotion Recognition Logic (for demo purposes)
        const emotions = ['happy', 'sad', 'angry', 'neutral', 'tired', 'emotional'];
        const emotionScores = emotions.map(() => Math.random());
        const totalScore = emotionScores.reduce((a, b) => a + b, 0);
        const emotionPercentages = emotionScores.map(score => ((score / totalScore) * 100).toFixed(2));

        let resultHTML = `Recognized Text: ${transcript}<br>Confidence: ${confidence}<br><br>Emotion Distribution:<br>`;
        emotions.forEach((emotion, index) => {
            resultHTML += `${emotion}: ${emotionPercentages[index]}%<br>`;
        });
        outputDiv.innerHTML = resultHTML;

        // Generate the graph
        generateEmotionGraph(emotions, emotionPercentages);
    };

    recognition.onerror = function(event) {
        console.error("Error occurred in speech recognition: ", event.error);
    };

    recognition.start();
}

function uploadFile(event) {
    const file = event.target.files[0];
    console.log("Selected file:", file);  // Debug: Check selected file

    if (file) {
        if (!file.type.startsWith('audio/')) {
            alert("Please upload a valid audio file");
            console.log("Invalid file type:", file.type);  // Debug: Check file type
            return;
        }

        const formData = new FormData();
        formData.append('audio_file', file);
        console.log("FormData object:", formData);  // Debug: Check FormData object

        fetch('/analyze_emotion', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log("Response status:", response.status);  // Debug: Check response status
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Received data:", data);  // Debug: Check received data
            const outputDiv = document.getElementById("output");
            outputDiv.innerHTML = `Detected Emotion: ${data.emotion}`;
        })
        .catch(error => {
            console.error('Error:', error);  // Debug: Log any errors
            alert("Error processing the file");
        });
    } else {
        alert("No file selected!");
        console.log("No file selected");  // Debug: Check if no file is selected
    }
}



function generateEmotionGraph(emotions, emotionPercentages) {
    const ctx = document.getElementById('emotionChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: emotions,
            datasets: [{
                label: 'Emotion Percentage',
                data: emotionPercentages,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function downloadResults() {
    const outputDiv = document.getElementById("output");
    const resultText = outputDiv.innerText;

    if (!resultText) {
        alert("No results to download!");
        return;
    }

    const blob = new Blob([resultText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'emotion_recognition_results.txt';
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

