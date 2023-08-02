import pandas as pd
from src.custom_types import Opportunity, Profile
from src.evaluation_functions.preprocess_functions import wordContractions
from src.evaluation_functions.model_functions import evaluateSentenceAgainstListOfSentences
from typing import List
from multiprocessing import Pool, cpu_count
from src.logging.logging_functions import measure_elapsed_time

preprocessText: callable = wordContractions

def calculateScore(score_batch):
    return_list = []
    # from the first to the second to last
    for each_i in range(len(score_batch[0])):
        return_list.append(sum(
            score_batch[each_key][each_i] ** 2 for each_key in list(score_batch.index)[0:-2]))
    return return_list


@measure_elapsed_time
def evaluateProfileAgainstOpportunities(profile: Profile, opportunities: List[Opportunity]) -> Opportunity:
    # Convert profile attributes to DataFrame
    profile_data = {
        "about": [preprocessText(profile.about)],
        "openTo": [preprocessText("What's needed: " + ", ".join(profile.openTo))],
        "skills": [preprocessText("Skills needed are: " + ", ".join(profile.skills))],
        "industryInterests": [preprocessText("Industries relevant: " + ", ".join(profile.industryInterests))],
        "causeInterests": [preprocessText("Causes: " + ", ".join(profile.causeInterests))]
    }
    profile_df = pd.DataFrame(profile_data)

    # Convert opportunities attributes to DataFrame
    opportunities_data = {
        "problem": [preprocessText(each.problem) for each in opportunities],
        "need": [preprocessText(each.need) for each in opportunities],
        "plan": [preprocessText(each.plan) for each in opportunities],
        "why": [preprocessText(each.why) for each in opportunities],
        "description": [preprocessText(each.description) for each in opportunities]
    }
    opportunities_df = pd.DataFrame(opportunities_data)

    # Initialize the results_matrix DataFrame with NaN values
    rows = list(opportunities_data.keys())
    rows.append("overall_score")
    results_matrix = pd.DataFrame(columns=profile_data.keys(), index=rows)

    # Prepare arguments for multiprocessing
    profile_sentences = [profile_df[profile_element].iloc[0]
                         for profile_element in profile_data.keys()]
    opportunity_sentences = [opportunities_df[opportunity_element].tolist(
    ) for opportunity_element in opportunities_data.keys()]

    # Create a Pool of workers with the number of available CPU cores
    num_workers = cpu_count()
    with Pool(processes=num_workers) as pool:
        # Evaluate each opportunity against the profile in parallel
        results_list = pool.starmap(
            evaluateSentenceAgainstListOfSentences,
            [((profile_sentence, opportunity_sentences[idx]))
             for profile_sentence in profile_sentences for idx in range(len(opportunity_sentences))]
        )

    # Unflatten the results_list to match the original structure
    num_opportunities_data = len(opportunities_data)
    results_list = [results_list[i:i+num_opportunities_data]
                    for i in range(0, len(results_list), num_opportunities_data)]

   # Fill the results_matrix with the evaluation results
    for profile_element, results in zip(profile_data.keys(), results_list):
        for opportunity_element, scores in zip(opportunities_data.keys(), results):
            results_matrix[profile_element][opportunity_element] = scores

    # Calculate the overall score for each profile element
        results_matrix[profile_element]["overall_score"] = calculateScore(
            results_matrix[profile_element])

    print("All options are")
    for each in opportunities:
        print(each.name)

    for profile_element in profile_data.keys():
        scores = results_matrix[profile_element]["overall_score"]
        index = scores.index(max(scores))
        print(
            f"Based on {profile_element}, the best opportunity is {opportunities[index].name} with a score of {scores[index]}")
        print(scores)

    # return opportunities[results_matrix[profile_element][opportunity_element].idxmax()]
