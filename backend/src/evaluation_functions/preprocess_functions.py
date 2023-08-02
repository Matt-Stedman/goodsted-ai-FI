import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer

# nltk.download("stopwords")
# nltk.download("punkt")

# Initialize stemmer and stop words
stemmer = PorterStemmer()
stop_words = set(stopwords.words("english"))


def wordContractions(text, max_length=100, DEBUG=False, to_step=100):
    # Tokenize the text into words
    if DEBUG:
        print("\n1. ")
        print(text)

    # STEP 1
    words = word_tokenize(text)
    if DEBUG:
        print("\n2. ")
        print(" ".join(words))

    # STEP 2
    # Remove stopwords and convert to lowercase
    if (to_step >= 2):
        words = [word.lower() for word in words if word.lower() not in stop_words]
        if DEBUG:
            print("\n3. ")
            print(" ".join(words))

    # STEP 3
    # Perform stemming to reduce words to their base form
    if (to_step >= 3):
        words = [stemmer.stem(word) for word in words]
        if DEBUG:
            print("\n4. ")
            print(" ".join(words))

    # STEP 4
    # Truncate the text to the specified maximum length
    if (to_step >= 4):
        words = words[:max_length]
        if DEBUG:
            print("\n5. ")
            print(" ".join(words))

    # Reconstruct the preprocessed text
    preprocessed_text = " ".join(words)

    return preprocessed_text


if __name__ == "__main__":
    for each_sentence in [
            # "We need inspiring material to promote BUD and\/or help with our training session.",
            # "Storytelling is a process which resonates really well with what we teach at BUD and how we teach it.",
            "Eating a healthy, balanced diet is an important part of maintaining good health, and can help you feel your best.\nThis means eating a wide variety of foods in the right proportions, and consuming the right amount of food and drink to achieve and maintain a healthy body weight.\n\nFruit and vegetables are a good source of vitamins and minerals and fibre, and should make up just over a third of the food you eat each day.\nIt's recommended that you eat at least 5 portions of a variety of fruit and vegetables every day. They can be fresh, frozen, canned, dried or juiced.\nThere's evidence that people who eat at least 5 portions of fruit and vegetables a day have a lower risk of heart disease, stroke and some cancers.\nEating 5 portions is not as hard as it sounds.\nA portion is:\n80g of fresh, canned or frozen fruit and vegetables\n30g of dried fruit – which should be kept to mealtimes\n150ml glass of fruit juice or smoothie – but do not have more than 1 portion a day as these drinks are sugary and can damage teeth\nJust 1 apple, banana, pear or similar-sized fruit is 1 portion each.\nA slice of pineapple or melon is also 1 portion, and 3 heaped tablespoons of vegetables is another portion.\nAdding a tablespoon of dried fruit, such as raisins, to your morning cereal is an easy way to get 1 portion.\nYou could also swap your mid-morning biscuit for a banana, and add a side salad to your lunch. \nIn the evening, have a portion of vegetables with dinner and fresh fruit with plain, lower fat yoghurt for dessert to reach your 5 A Day. ",
            # "At Mabadiliko we aim to normalise conversations around race. One of our main areas of work is delivering Cultural Humility Workshops, and we’re looking to pursue a blended learning approach, offering our workshops as a 3-part hybrid e-learning and in-person experience to companies.  There will also be a 3-month add on to these workshops, in the form of a behaviour change ‘coach’ which we hope to deliver through a chat bot. \n\nTo successfully deliver this hybrid learning experience, we need help identifying the right online platform to host our video content and e-learning resources. We are also looking for support identifying which chatbot or engagement platform to use, and help to navigate this landscape in which we have limited expertise in. \n"
    ]:
        print(f"Original sentence ({len(each_sentence)}):\n\t{each_sentence}")
        new_sentence = wordContractions(each_sentence, DEBUG=True)
        print(f"became ({len(new_sentence)}):\n\t{new_sentence}")
