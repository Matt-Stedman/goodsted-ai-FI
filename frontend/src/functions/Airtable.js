import { AIRTABLE_KEY } from "../secrets";
import axios from "axios";

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
    console.log(response.data.records);
    return response.data.records;
}

/**
 * Function to get the profiles (or a specific one if given)
 */
export async function getBatchOfOpportunities(ignore = []) {
    const query = ignore.length
        ? `/tblL4oLO9wLy61dVB?maxRecords=10?filterByFormula=AND(${ignore.map((ig) => `NOT({id}="${ig}")`).join(", ")})`
        : "/tblL4oLO9wLy61dVB?maxRecords=10";
    console.log("getBatchOfOpportunities, query:", query);
    const response = await apiClient.get(query);
    console.log("getBatchOfOpportunities, response:", response);

    return response.data.records;
}

/**
 * Function to get the profiles (or a specific one if given)
 */
export async function doScoresExistForOpportunies(profile, opportunities) {
    const query = `/tblsiIFBis29HTU14?filterByFormula=AND({Profile}="${profile.id}", {Opportunity}="${opportunity.id}")`;
    console.log(query);
    const response = await apiClient.get(query);

    return response.data.records;
}

/**
 * Function to get the profiles (or a specific one if given)
 */
export async function setScoreForOpportunity(profile, opportunities, new_scores) {
    // Create the score, assuming it doesn't exist
    const query = `/tblsiIFBis29HTU14`;

    const records = opportunities.map((opportunity, index) => {
        return {
            fields: {
                // id: `${profile.id}_${opportunity.id}`,
                Profile: [profile.id], // Use an array here
                Opportunity: [opportunity.id], // Use an array here
                about: new_scores[index].about.score,
                openTo: new_scores[index].openTo.score,
                skills: new_scores[index].skills.score,
                industryInterests: new_scores[index].industryInterests.score,
                about_reason: new_scores[index].about.reason, // Remove unnecessary quotes
                openTo_reason: new_scores[index].openTo.reason, // Remove unnecessary quotes
                skills_reason: new_scores[index].skills.reason, // Remove unnecessary quotes
                industryInterests_reason: new_scores[index].industryInterests.reason, // Remove unnecessary quotes
                about_feedback: new_scores[index].about.feedback ?? 0,
                openTo_feedback: new_scores[index].openTo.feedback ?? 0,
                skills_feedback: new_scores[index].skills.feedback ?? 0,
                industryInterests_feedback: new_scores[index].industryInterests.feedback ?? 0,
            },
        };
    });

    const response = await apiClient.post(query, {
        records: records, // Use the constructed records array
    });

    // Handle the response as needed
    return response.data.records;
}
