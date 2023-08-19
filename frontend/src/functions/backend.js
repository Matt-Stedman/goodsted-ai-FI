// Load AI functions
import { scoreOpportunityAgainstProfile } from "../functions/OpenAi";

// Load Airtable functions
import { doScoresExistForOpportunies, setScoreForOpportunities } from "./Airtable";

// Helper functino to render the score ids
export const getScoreId = (profile_id, opportunity_id) => {
    return `${profile_id}_${opportunity_id}`;
};

/**
Get the scores for given opportunities
*/
export const getScoresForOpportunities = async (profile, opportunities) => {
    const updatedBatchScores = {}; // Create a copy of batchScores

    const scoresExistArray = await doScoresExistForOpportunies(profile, opportunities); // Check if scores exist

    const scorePromises = opportunities.map(async (each_op, index) => {
        if (!scoresExistArray[index]) {
            const new_score = await scoreOpportunityAgainstProfile(each_op, profile);
            // console.log(`For ${each_op.id} the new score is: `, new_score);
            updatedBatchScores[`${getScoreId(profile.id, each_op.id)}`] = new_score; // Update the score for the opportunity ID
        } else {
            // console.log(`We already have a score for ${each_op.id}`);
            // console.log(`scoresExistArray[${index}]`, scoresExistArray[index])
            updatedBatchScores[`${getScoreId(profile.id, each_op.id)}`] = scoresExistArray[index]; // Update the score for the opportunity ID
        }
    });

    await Promise.all(scorePromises); // Wait for all scores to be calculated
    await setScoreForOpportunities(profile, opportunities, updatedBatchScores);
    return updatedBatchScores;
};

/**
 * Give feedback to reasons (on scores)
 */
export const giveFeedbackToScore = async (score, feedback) => {
    console.log(`Feedback given to score ${score} of ${feedback}`);
};
