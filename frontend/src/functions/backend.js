// Load AI functions
import { scoreOpportunityAgainstProfile } from "../functions/OpenAi";

// Load Airtable functions
import { doScoresExistForOpportunies, setScoreForOpportunity } from "./Airtable";

/**
Get the scores for given opportunities
*/
export const getScoresForOpportunities = async (profile, opportunities) => {
    const updatedBatchScores = {}; // Create a copy of batchScores

    const scorePromises = opportunities.map(async (each_op) => {
        if (updatedBatchScores[each_op.id] == null) {
            const existing_score = doesScoreExistForOpportunity(profile, each_op);
            if (existing_score.length) {
                if (existing_score[0] !== null) {
                    console.log(`We already have a score for ${each_op.id}: ${existing_score}`);
                    updatedBatchScores[each_op.id] = existing_score[0]; // Update the score for the opportunity ID
                    return;
                }
            }

            const new_score = await scoreOpportunityAgainstProfile(each_op.fields, profile.fields);
            console.log(`For ${each_op.id} the score is ${new_score}`);
            updatedBatchScores[each_op.id] = new_score; // Update the score for the opportunity ID
        }
    });

    await Promise.all(scorePromises); // Wait for all scores to be calculated
    console.log("opportunities: ", opportunities);
    console.log("updatedBatchScores: ", updatedBatchScores);
    setScoreForOpportunity(profile, opportunities, updatedBatchScores);
    return updatedBatchScores;
};

/**
 * Give feedback to reasons (on scores)
 */
export const giveFeedbackToScore = async (score, feedback) => {
    console.log(`Feedback given to score ${score} of ${feedback}`);
};
