import json
from src.custom_types import Opportunity, Profile
from src.evaluations import evaluateProfileAgainstOpportunities
from typing import List


# For a given profile, go through each opportunity and calculate the scores (maybe in batches of 10), and calculate an overall score.
# Match against elements of their profile and past opportunities.


if __name__ == "__main__":
    # Get all opportunities as an array of Opportunities
    all_opportunities: List[Opportunity] = []
    with open("./data/project_202307061838.json", encoding='utf-8') as f:
        for each in json.load(f):
            each_opportunity = Opportunity()
            each_opportunity.loadFromDict(each)
            all_opportunities.append(each_opportunity)

    # Get my profile
    all_profiles: List[Profile] = []
    with open("./data/profiles.json", encoding='utf-8') as f:
        for each in json.load(f):
            each_profile = Profile()
            each_profile.loadFromDict(each)
            all_profiles.append(each_profile)


    best_opportunity = evaluateProfileAgainstOpportunities(
        all_profiles[0], all_opportunities[0: 7])
    
    # print(best_opportunity)
