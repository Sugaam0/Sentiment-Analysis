from django.shortcuts import render
from django.http import JsonResponse
from transformers import pipeline
import logging

# Set up logging
logger = logging.getLogger(__name__)

# Initialize transformer model (loaded once at startup)
sentiment_analyzer = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment")

def index(request):
    return render(request, 'sentiment/index.html')

def analyze_sentiment(request):
    if request.method == 'POST':
        text = request.POST.get('text', '')
        if not text.strip():
            return JsonResponse({'error': 'Text cannot be empty'}, status=400)

        try:
            # Run transformer-based sentiment analysis
            result = sentiment_analyzer(text)[0]
            label = result['label'].lower()  # LABEL_0 (negative), LABEL_1 (neutral), LABEL_2 (positive)
            score = result['score']

            # Keyword overrides for specific emotions
            excited_keywords = ['excited', 'thrilled', 'amazing', 'awesome']
            angry_keywords = ['frustrated', 'annoyed', 'angry', 'can\'t', 'supposed to', 'fail', 'broken', 'terrible', 'awful']

            # Map transformer output to custom sentiments
            if label == 'label_2' and score > 0.7:  # Positive
                if any(keyword in text.lower() for keyword in excited_keywords):
                    sentiment = 'excited'
                    emoji = '🤩🎉'
                else:
                    sentiment = 'happy'
                    emoji = '😊👍'
            elif label == 'label_0' and score > 0.7:  # Negative
                if any(keyword in text.lower() for keyword in angry_keywords):
                    sentiment = 'angry'
                    emoji = '😣😣'
                else:
                    sentiment = 'sad'
                    emoji = '😔😢'
            else:  # Neutral or low-confidence
                sentiment = 'neutral'
                emoji = '😐'

            logger.info(f"Input: {text}, Label: {label}, Score: {score}, Sentiment: {sentiment}")
            return JsonResponse({
                'sentiment': sentiment,
                'emoji': emoji,
                'score': round(score, 2)
            })
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {str(e)}")
            return JsonResponse({'error': f'Analysis failed: {str(e)}'}, status=500)
    return JsonResponse({'error': 'Invalid request'}, status=400)