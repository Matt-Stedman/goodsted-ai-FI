import pandas as pd
from src.custom_types import Opportunity, Profile
from src.evaluation_functions.preprocess_functions import wordContractions
from src.evaluation_functions.model_functions import evaluateSentenceAgainstListOfSentences
from typing import List
from multiprocessing import Pool, cpu_count
from src.logging.logging_functions import measure_elapsed_time

preprocessText: callable = wordContractions
# volunteer_text = "I would like to volunteer in opportunities centred around ethnic identity, teaching others and providing courses/sessions both in-person and online, to individuals and companies. Happy to work a few months on these endeavours, and I would be excited to include technologies such as AI to help normalize further. I have a lot of experience in setting up e-learning resources, and basic experience in setting up chatbots for previous projects where I have quite a lot of experience."
volunteer_text = "I want to work on something design/marketing focussed. I’m not really into computers or technology, and I don’t really like working on educational tools. I think the biggest problems are climate change, and anyone working on other problems are just wasting their time. All lives matter! Also I can only work one night a month for about 2 hours each time."
opportunity_text = "At Mabadiliko we aim to normalise conversations around race. One of our main areas of work is delivering Cultural Humility Workshops, and we’re looking to pursue a blended learning approach, offering our workshops as a 3-part hybrid e-learning and in-person experience to companies.  There will also be a 3-month add on to these workshops, in the form of a behaviour change ‘coach’ which we hope to deliver through a chat bot. To successfully deliver this hybrid learning experience, we need help identifying the right online platform to host our video content and e-learning resources. We are also looking for support identifying which chatbot or engagement platform to use, and help to navigate this landscape in which we have limited expertise in."

results = {}
for each_step in [1, 2, 3, 4]:
    # Convert profile attributes to DataFrame
    profile_data = {
        "about": [preprocessText(volunteer_text, to_step=each_step)]
    }

    # Convert opportunities attributes to DataFrame
    opportunities_data = {
        "problem": [preprocessText(opportunity_text, to_step=each_step)],
    }

    # to_step against score
    results[f"toStep{each_step}"] = evaluateSentenceAgainstListOfSentences(
        profile_data["about"][0], opportunities_data["problem"])

print("Scores: ", results)
