import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer

nltk.download("stopwords")
nltk.download("punkt")

# Initialize stemmer and stop words
stemmer = PorterStemmer()
stop_words = set(stopwords.words("english"))


def preprocess_text(text, max_length=100):
    # Tokenize the text into words
    words = word_tokenize(text)

    # Remove stopwords and convert to lowercase
    words = [word.lower() for word in words if word.lower() not in stop_words]

    # Perform stemming to reduce words to their base form
    words = [stemmer.stem(word) for word in words]

    # Truncate the text to the specified maximum length
    words = words[:max_length]

    # Reconstruct the preprocessed text
    preprocessed_text = " ".join(words)

    return preprocessed_text
