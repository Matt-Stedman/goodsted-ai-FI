import axios from "axios";

const chatGPTClient = axios.create({
    baseURL: "https://europe-west1-goodsted-ai.cloudfunctions.net/chatProxy",
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
    },
});

export const opportunity_elements_AI = ["problem", "need", "about", "plan", "why", "description"];
export const profile_elements_AI = [
    "about",
    "openTo",
    "skills",
    "industryInterests",
    // "pastOpportunityScores", // I want to unpack previous high scores (>7) and the rational behind those scores
];

/**
 * Function to create general feedback for the entire posting
 */
export async function scoreOpportunityAgainstProfile(opportunity, profile) {
    // both opportunity and profile come in as a plain dict

    // console.log("Opportunity: ", opportunity);
    // console.log("Profile: ", profile);

    // STEP 1 - Unpack the relevant opportunity and profile elements as a string
    if (opportunity.fields === null || profile.fields === null) {
        return null;
    }

    const opportunity_string = opportunity_elements_AI.map((op) => `${op}: ${opportunity.fields[op]}\n`);
    const profile_string = profile_elements_AI.map((pr) => `${pr}: ${profile.fields[pr]}\n`);

    // STEP 2 - Compile the prompt
    const prompt = `
Evaluate Profile-Opportunity Alignment with Rigorous Analysis

Profile Evaluation Instructions:
Please provide a meticulous evaluation of how well my volunteering profile aligns with the given opportunity. Be highly critical and specific, focusing on strong alignments. You can be friendly referring to me as "you". Base your assessment strictly on the provided information. If any information is missing, treat it as a deficiency and evaluate it accordingly.
If any either my fields or the opportunity's fields are undefined or less than 20 words then I expect a very cautious and skeptical evaluation. Focus on thorough analysis and highlight potential mismatches or uncertainties in the opportunity details.

Scoring Format:
Provide evaluations for the following elements in a JSON-parsable format:
{
    ${profile_elements_AI.map(
        (pr) => `"${pr}": {
        "score": [0 to 100],
        "reason": [Up to 20 words]
    },
    `
    )}
}

Profile Information:
${profile_string}

Opportunity Information:
${opportunity_string}

    `;

    console.log(prompt);
    // STEP 3 - Get the results
    const response = await chatGPTClient.post("/", {
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4",
    });

    // TODO STEP 4 - Unpack the pastOpportunityScores

    // TODO STEP 5 - Put in the 👍 and 👎 scores, either here or as weights on the other side?

    // console.log(response);

    const potential_scores = response.data.choices[0].message.content.split("\n\n");
    var scores;
    potential_scores.map((each_potential_score) => {
        try {
            scores = JSON.parse(each_potential_score);
        } catch {}
    });
    if (!scores) {
        return null;
    }

    // Calculate the average score
    var totalScores = Object.values(scores).reduce((total, sc) => total + sc.score, 0);
    var numberOfCategories = Object.keys(scores).length;
    var averageScore = totalScores / numberOfCategories;

    scores["average"] = { score: averageScore };

    // console.log("Average Score:", averageScore);

    return scores;
}
