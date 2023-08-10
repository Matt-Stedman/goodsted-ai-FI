// Load the data
import opportunities from "../data_tmp/opportunities.json";
import profiles from "../data_tmp/profiles.json";
import scores from "../data_tmp/scores.json";

// Load AI functions
import { scoreOpportunityAgainstProfile } from "../functions/OpenAi";

/**
Get a new batch of 10 opportunities
*/
export const getBatchOfOpportunities = (start_index) => {
    return opportunities.slice(start_index, start_index + 10);
};

/**
Get the user profile at a given index
*/
export const getUserProfile = (index) => {
    return profiles[index];
};

/**
 * Does a score already exist between this profile and a given opportunity?
 */
const doesScoreExistForOpportunity = (profile, opportunity) => {
    const profile_scores = scores.find((score) => profile.id === score.profile);
    if (!profile_scores) {
        return null;
    }
    console.log(profile_scores);
    const opportunity_score = profile_scores.opportunities.find((op) => opportunity.id === op.id);

    if (!opportunity_score) {
        return null;
    }

    if (!opportunity_score.upToDate) {
        return null;
    }

    return opportunity_score;
};

// Function to update or create a score for an opportunity
const setScoreForOpportunity = async (profile, opportunity, newScore) => {
    try {
        // Find the index of the profile in scores array
        const profileIndex = scores.findIndex((score) => score.profile === profile.id);

        if (profileIndex !== -1) {
            // Profile exists, check if opportunity score exists
            const opportunityIndex = scores[profileIndex].opportunities.findIndex((op) => op.id === opportunity.id);

            if (opportunityIndex !== -1) {
                // Update the existing opportunity score
                scores[profileIndex].opportunities[opportunityIndex] = newScore;
            } else {
                // Create a new opportunity score
                scores[profileIndex].opportunities.push(newScore);
            }
        } else {
            // Create a new profile entry with the opportunity score
            scores.push({
                profile: profile.id,
                opportunities: [newScore],
            });
        }

        // Write the updated scores back to scores.json
        console.log(`Score for profile ${profile.id} and opportunity ${opportunity.id} has been updated/created.`);
        console.log("Scores are now: ", scores); // todo this will need to be an airtable function!
    } catch (error) {
        console.error("Error updating score:", error);
    }
};

/**
Get the scores for given opportunities
*/
export const getScoresForOpportunities = async (profile, opportunities) => {
    const updatedBatchScores = {}; // Create a copy of batchScores

    const scorePromises = opportunities.map(async (each_op) => {
        if (updatedBatchScores[each_op.id] == null) {
            const existing_score = doesScoreExistForOpportunity(profile, each_op);
            if (existing_score) {
                console.log(`We already have a score for ${each_op.id}: ${existing_score}`);
                updatedBatchScores[each_op.id] = existing_score; // Update the score for the opportunity ID
            } else {
                const new_score = await scoreOpportunityAgainstProfile(each_op, profile);
                console.log(`For ${each_op.id} the score is ${new_score}`);
                updatedBatchScores[each_op.id] = new_score; // Update the score for the opportunity ID
            }
        }
    });

    await Promise.all(scorePromises); // Wait for all scores to be calculated
    console.log("updatedBatchScores: ", updatedBatchScores);
    setScoreForOpportunity();
    return updatedBatchScores;
};

/**
 * Give feedback to reasons (on scores)
 */
export const giveFeedbackToScore = async (score, feedback) => {
    console.log(`Feedback given to score ${score} of ${feedback}`);
};
