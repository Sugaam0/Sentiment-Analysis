document.getElementById('sentimentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    analyzeSentiment();
});

function analyzeSentiment() {
    const text = document.getElementById('inputText').value;
    const spinner = document.getElementById('loadingSpinner');
    const resultSection = document.getElementById('resultSection');
    const sentimentBox = document.getElementById('sentimentResult');

    if (!text.trim()) {
        alert('Please enter some text to analyze.');
        return;
    }

    spinner.classList.remove('hidden');
    spinner.classList.add('active');
    resultSection.style.display = 'none';
    sentimentBox.classList.remove('show');

    console.log('Sending request with text:', text);

    fetch('/analyze/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCSRFToken()
        },
        body: `text=${encodeURIComponent(text)}`
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Received data:', data);
        spinner.classList.remove('active');
        spinner.classList.add('hidden');

        if (data.error) {
            alert(data.error);
            return;
        }

        const sentimentText = document.getElementById('sentimentText');
        const sentimentEmoji = document.getElementById('sentimentEmoji');
        const polarityScore = document.getElementById('polarityScore');

        sentimentText.textContent = `Sentiment: ${data.sentiment.charAt(0).toUpperCase() + data.sentiment.slice(1)}`;
        sentimentEmoji.textContent = data.emoji;
        polarityScore.textContent = `Confidence Score: ${data.score}`;
        
        sentimentBox.className = 'sentiment-box';
        sentimentBox.classList.add(data.sentiment);

        resultSection.style.display = 'block';
        setTimeout(() => {
            sentimentBox.classList.add('show');
        }, 100);
    })
    .catch(error => {
        spinner.classList.remove('active');
        spinner.classList.add('hidden');
        console.error('Fetch error:', error);
        alert('An error occurred while analyzing the sentiment: ' + error.message);
    });
}

function getCSRFToken() {
    const token = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    console.log('CSRF Token:', token);
    return token || '';
}

// Particle animation
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 50;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = 'rgba(45, 212, 191, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});