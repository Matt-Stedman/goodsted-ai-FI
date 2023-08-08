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

    console.log("Opportunity: ", opportunity);
    console.log("Profile: ", profile);

    // STEP 1 - Unpack the relevant opportunity and profile elements as a string
    const opportunity_string = opportunity_elements_AI.map((op) => `${op}: ${opportunity[op]}\n`);
    const profile_string = profile_elements_AI.map((pr) => `${pr}: ${profile[pr]}\n`);

    // STEP 2 - Compile the prompt
    const prompt = `
    I need a rigorous evaluation of my volunteering profile's fit with this opportunity. Please be critical and precise, aiming to identify only the best-aligned opportunities.
    Your feedback should be data-driven and rigorous, with a focus on strong alignment, and personal to me and my profile, using the second person!
    
    Evaluate my profile's elements based on a JSON-parsable format:
    {
        ${profile_elements_AI.map(
            (pr) => `"${pr}": {
            "score": [0 to 100],
            "reason": [Up to 20 words]
        },
        `
        )}
    }
    
    MY PROFILE:
    ${profile_string}
    
    OPPORTUNITY:
    ${opportunity_string}
    
        `;

    console.log(prompt);
    // STEP 3 - Get the results
    const response = await chatGPTClient.post("/", {
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    // TODO STEP 4 - Unpack the pastOpportunityScores

    // TODO STEP 5 - Put in the 👍 and 👎 scores, either here or as weights on the other side?

    console.log(response);

    try {
        var scores = JSON.parse(response.data.choices[0].message.content);

        // Calculate the average score
        var totalScores = Object.values(scores).reduce((total, sc) => total + sc.score, 0);
        var numberOfCategories = Object.keys(scores).length;
        var averageScore = totalScores / numberOfCategories;

        scores["average"] = { score: averageScore };

        console.log("Average Score:", averageScore);

        return scores;
    } catch {
        console.log(`Failed to get a scoring for ${opportunity.id}`);
        return null;
    }
}
