import torch
from transformers import BertTokenizer, BertModel, RobertaTokenizer, RobertaModel, DistilBertTokenizer, DistilBertModel, GPT2Tokenizer, GPT2Model
from sklearn.metrics.pairwise import cosine_similarity
from typing import List

# Load model for widespread use
model_name: str = None
tokenizer: any = None
model: any = None


def loadModel(set_model_name: str):
    global model_name, tokenizer, model
    model_name = set_model_name
    print(f"Using the {model_name} model")
    if "roberta" in set_model_name:
        tokenizer = RobertaTokenizer.from_pretrained(model_name)
        model = RobertaModel.from_pretrained(model_name)
    elif "distilbert" in set_model_name:
        tokenizer = DistilBertTokenizer.from_pretrained(model_name)
        model = DistilBertModel.from_pretrained(model_name)
    elif "bert" in set_model_name:
        tokenizer = BertTokenizer.from_pretrained(model_name)
        model = BertModel.from_pretrained(model_name)
    elif "gpt2" in set_model_name:
        tokenizer = GPT2Tokenizer.from_pretrained(model_name)
        model = GPT2Model.from_pretrained(model_name)
    else:
        raise ModuleNotFoundError(f"No model found for: {set_model_name}")


def getSentenceEmbedding(sentences, model, tokenizer):
    inputs = tokenizer(sentences, return_tensors="pt",
                       truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).numpy()


def getContextualSimilarity(sentence1, sentence2, model, tokenizer):
    embedding1 = getSentenceEmbedding(sentence1, model, tokenizer)
    embedding2 = getSentenceEmbedding(sentence2, model, tokenizer)
    similarity = cosine_similarity(embedding1, embedding2)[0][0]
    return similarity


def evaluateSentenceAgainstListOfSentences(profile_sentence: str, list_of_sentences: List[str], bert_model: str = "bert-base-uncased"):
    global model_name
    if model is None or bert_model is not model_name:
        loadModel(bert_model)
    print(f"Runninng against {profile_sentence}")
    return [getContextualSimilarity(profile_sentence, sent, model, tokenizer) for sent in list_of_sentences]
