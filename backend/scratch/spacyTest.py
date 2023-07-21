## BASIC GETTING STARTED EXAMPLE
# # pip install -U spacy
# # python -m spacy download en_core_web_sm
# import spacy

# # Load English tokenizer, tagger, parser and NER
# nlp = spacy.load("en_core_web_sm")

# # Process whole documents
# text = ("When Sebastian Thrun started working on self-driving cars at "
#         "Google in 2007, few people outside of the company took him "
#         "seriously. “I can tell you very senior CEOs of major American "
#         "car companies would shake my hand and turn away because I wasn’t "
#         "worth talking to,” said Thrun, in an interview with Recode earlier "
#         "this week.")
# doc = nlp(text)

# # Analyze syntax
# print("Noun phrases:", [chunk.text for chunk in doc.noun_chunks])
# print("Verbs:", [token.lemma_ for token in doc if token.pos_ == "VERB"])

# # Find named entities, phrases and concepts
# for entity in doc.ents:
#     print(entity.text, entity.label_)

## WORD SIMILARITY EXAMPLES
# import spacy
# import numpy as np
# from sklearn.metrics.pairwise import cosine_similarity

# def get_sentence_vector(sentence, nlp_model):
#     doc = nlp_model(sentence)
#     # Calculate the average vector representation of the sentence
#     return np.mean([token.vector for token in doc if not token.is_stop], axis=0)

# def get_contextual_similarity(sentence1, sentence2, nlp_model):
#     vector1 = get_sentence_vector(sentence1, nlp_model)
#     vector2 = get_sentence_vector(sentence2, nlp_model)
#     # Calculate cosine similarity between the sentence vectors
#     similarity = cosine_similarity(vector1.reshape(1, -1), vector2.reshape(1, -1))[0, 0]
#     return similarity

# def get_contextual_similarity_scores_for_list(sentence, sentence_list, nlp_model):
#     similarity_scores = []
#     for other_sentence in sentence_list:
#         similarity_score = get_contextual_similarity(sentence, other_sentence, nlp_model)
#         similarity_scores.append(similarity_score)
#     return similarity_scores

# # Example usage:
# nlp_model = spacy.load("en_core_web_md")

# given_sentence = "Work on inspiring product ideas"
# other_sentences = [
#     "Develop prototypes",
#     "Work on interesting music production ideas",
#     "Create innovative product designs",
#     "Perform product testing"
# ]

# similarity_scores = get_contextual_similarity_scores_for_list(given_sentence, other_sentences, nlp_model)
# print(similarity_scores)


## CONTEXTUAL EXAMPLE
from transformers import BertTokenizer, BertModel
import torch
from sklearn.metrics.pairwise import cosine_similarity

def get_sentence_embedding(sentence, model, tokenizer):
    inputs = tokenizer(sentence, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).numpy()

def get_contextual_similarity(sentence1, sentence2, model, tokenizer):
    embedding1 = get_sentence_embedding(sentence1, model, tokenizer)
    embedding2 = get_sentence_embedding(sentence2, model, tokenizer)
    similarity = cosine_similarity(embedding1, embedding2)[0][0]
    return similarity

# Example usage:
model_name = "bert-base-uncased"  # You can choose other pre-trained models
tokenizer = BertTokenizer.from_pretrained(model_name)
model = BertModel.fxrom_pretrained(model_name)

given_sentence = "Work on inspiring product ideas"
other_sentences = [
    "Develop prototypes",
    "Work on interesting music production ideas",
    "Create innovative product designs",
    "Perform product testing"
]

similarity_scores = [get_contextual_similarity(given_sentence, sent, model, tokenizer) for sent in other_sentences]
print(similarity_scores)

