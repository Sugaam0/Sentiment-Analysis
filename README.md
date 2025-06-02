# Sentiment Analysis Web App

A Django web app for real-time sentiment analysis using the **cardiffnlp/twitter-roberta-base-sentiment** model. It classifies text into **happy** 😊👍, **sad** 😔😢, **angry** 😣😣, **excited** 🤩🎉, or **neutral** 😐.  
Features a white-themed, neumorphic UI with particle animations and a centered, responsive layout.

---

## Features

- Accurate sentiment analysis with a RoBERTa-based transformer model  
- Classifies emotions with keyword overrides (e.g., "thrilled" → excited)  
- Modern UI with loading spinner, animated results, and confidence scores  
- Secure Django backend with CSRF protection and error logging  

---

## Installation

### Prerequisites

- Python 3.8+  
- Git  
- Dependencies: `django`, `transformers`, `torch`  

### Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/sentiment-analysis-app.git
    cd sentiment-analysis-app
    ```

2. Create and activate a virtual environment:

    ```bash
    python -m venv venv
    # Linux/Mac:
    source venv/bin/activate
    # Windows:
    venv\Scripts\activate
    ```

3. Install dependencies:

    ```bash
    pip install django transformers torch
    ```

4. Apply migrations:

    ```bash
    python manage.py migrate
    ```

5. Collect static files:

    ```bash
    python manage.py collectstatic
    ```

6. Run the development server:

    ```bash
    python manage.py runserver
    ```

---

## Usage

- Open your browser and go to `http://127.0.0.1:8000/`  
- Enter text in the input box and submit  
- See the classified sentiment along with confidence scores and animated results  
