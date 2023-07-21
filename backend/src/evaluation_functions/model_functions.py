import torch
from transformers import BertTokenizer, BertModel
from sklearn.metrics.pairwise import cosine_similarity
from typing import List

# Load model for widespread use
model_name = "bert-base-uncased"  # You can choose other pre-trained models
tokenizer = BertTokenizer.from_pretrained(model_name)
model = BertModel.from_pretrained(model_name)


def getSentenceEmbedding(sentence, model, tokenizer):
    inputs = tokenizer(sentence, return_tensors="pt",
                       truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).numpy()


def getContextualSimilarity(sentence1, sentence2, model, tokenizer):
    embedding1 = getSentenceEmbedding(sentence1, model, tokenizer)
    embedding2 = getSentenceEmbedding(sentence2, model, tokenizer)
    similarity = cosine_similarity(embedding1, embedding2)[0][0]
    return similarity


def evaluateSentenceAgainstListOfSentences(profile_sentence: str, list_of_sentences: List[str]):
    return [getContextualSimilarity(profile_sentence, sent, model, tokenizer) for sent in list_of_sentences]
