import { AIRTABLE_KEY } from "../secrets";
import axios from "axios";
import { getScoreId } from "./backend";

const apiClient = axios.create({
    baseURL: "https://api.airtable.com/v0/appoe8qcNGiO1uHGl",
    headers: {
        Authorization: `Bearer ${AIRTABLE_KEY}`,
        "Content-Type": "application/json",
    },
});

/**
 * Function to get the profiles (or a specific one if given)
 */
export async function getUserProfiles() {
    const response = await apiClient.get(`/tblOwl84oPGLti8up`);
    // console.log(response.data.records);
    return response.data.records;
}

/**
 * Function to get the profiles (or a specific one if given)
 */
export async function getBatchOfOpportunities(ignore = []) {
    const query = ignore.length
        ? `/tblL4oLO9wLy61dVB?maxRecords=2?filterByFormula=AND(${ignore.map((ig) => `NOT({id}="${ig}")`).join(", ")})`
        : "/tblL4oLO9wLy61dVB?maxRecords=2";
    // console.log("getBatchOfOpportunities, query:", query);
    const response = await apiClient.get(query);
    // console.log("getBatchOfOpportunities, response:", response);

    return response.data.records;
}

/**
 * Function to get the profiles (or a specific one if given)
 */
export async function doScoresExistForOpportunies(profile, opportunities) {
    const opportunityIds = opportunities.map((opportunity) => opportunity.id);
    const query = `/tblsiIFBis29HTU14?filterByFormula=AND({Profile}="${profile.id}", OR(${opportunityIds
        .map((id) => `FIND("${id}", Opportunity)`)
        .join(", ")}))`;

    const response = await apiClient.get(query);

    const scoresExistArray = opportunities.map((opportunity) => {
        const scoreExists = response.data.records.some((record) => record.Opportunity.includes(opportunity.id));
        return scoreExists;
    });

    // console.log("scoresExistArray: ", scoresExistArray);
    return scoresExistArray;
}

/**
 * Function to get the profiles (or a specific one if given)
 */
export async function setScoreForOpportunities(profile, opportunities, new_scores) {
    // Create the score, assuming it doesn't exist
    const query = `/tblsiIFBis29HTU14`;
    console.log("Opportunities: ", opportunities);
    console.log("Scores: ", new_scores);

    const records = opportunities.map((opportunity) => {
        const score_id = getScoreId(profile.id, opportunity.id);
        return {
            fields: {
                // id: `${profile.id}_${opportunity.id}`,
                Profile: [profile.id], // Use an array here
                Opportunity: [opportunity.id], // Use an array here
                about: new_scores[score_id].about.score,
                openTo: new_scores[score_id].openTo.score,
                skills: new_scores[score_id].skills.score,
                industryInterests: new_scores[score_id].industryInterests.score,
                about_reason: new_scores[score_id].about.reason, // Remove unnecessary quotes
                openTo_reason: new_scores[score_id].openTo.reason, // Remove unnecessary quotes
                skills_reason: new_scores[score_id].skills.reason, // Remove unnecessary quotes
                industryInterests_reason: new_scores[score_id].industryInterests.reason, // Remove unnecessary quotes
                about_feedback: new_scores[score_id].about.feedback ?? 0,
                openTo_feedback: new_scores[score_id].openTo.feedback ?? 0,
                skills_feedback: new_scores[score_id].skills.feedback ?? 0,
                industryInterests_feedback: new_scores[score_id].industryInterests.feedback ?? 0,
            },
        };
    });

    const response = await apiClient.post(query, {
        records: records, // Use the constructed records array
    });

    // Handle the response as needed
    return response.data.records;
}
