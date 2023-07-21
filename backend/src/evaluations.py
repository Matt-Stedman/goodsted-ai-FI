import pandas as pd
from src.custom_types import Opportunity, Profile
from src.evaluation_functions.model_functions import evaluateSentenceAgainstListOfSentences
from typing import List


def calculateScore(score_batch):
    return_list = []
    for each_element in range(0, len(score_batch[0])):
        return_list.append(sum(
            score_batch[key][each_element] ** 2 for key in list(score_batch.keys())[0: -2]))

    return return_list


def evaluateProfileAgainstOpportunities(profile: Profile, opportunities: List[Opportunity]) -> Opportunity:
    # Convert profile attributes to DataFrame
    profile_data = {
        "about": [profile.about],
        "openTo": ["What's needed: " + ", ".join(profile.openTo)],
        "skills": ["Skills needed are: " + ", ".join(profile.skills)],
        "industryInterests": ["Industries relevant: " + ", ".join(profile.industryInterests)],
        "causeInterests": ["Causes: " + ", ".join(profile.causeInterests)]
    }
    profile_df = pd.DataFrame(profile_data)

    # Convert opportunities attributes to DataFrame
    opportunities_data = {
        "name": [each.name for each in opportunities],
        "problem": [each.problem for each in opportunities],
        "need": [each.need for each in opportunities],
        "plan": [each.plan for each in opportunities],
        "why": [each.why for each in opportunities],
        "description": [each.description for each in opportunities]
    }
    opportunities_df = pd.DataFrame(opportunities_data)
    rows = list(opportunities_data.keys())
    rows.append("overall_score")
    results_matrix = pd.DataFrame(
        columns=profile_data.keys(), index=rows)
    for profile_element in profile_data.keys():
        for opportunity_element in opportunities_data.keys():
            print(f"{profile_element} X {opportunity_element}")
            # Ensure profile sentence is a single string
            profile_sentence = profile_df[profile_element].iloc[0]
            # Ensure list of sentences for opportunities
            list_of_opportunity_sentences = opportunities_df[opportunity_element].tolist(
            )
            # May have a way to select which model used for lighter/heavier loads
            results_matrix[profile_element][opportunity_element] = evaluateSentenceAgainstListOfSentences(
                profile_sentence,
                list_of_opportunity_sentences
            )

        # Generate vertical score for each of the elements in profile_data
        # Temporary DataFrame without the "overall_score" row
        results_matrix[profile_element]["overall_score"] = calculateScore(
            results_matrix[profile_element])

    print(profile_df)
    print(results_matrix)

    return opportunities[results_matrix[profile_element][opportunity_element].idxmax()]
