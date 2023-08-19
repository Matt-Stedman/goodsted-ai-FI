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
export async function doScoresExistForOpportunies(profile, opportunities, unpack = true) {
    const opportunityIds = opportunities.map((opportunity) => opportunity.fields.id);
    const query = `/tblsiIFBis29HTU14?filterByFormula=AND({Profile}="${profile.fields.name}", OR(${opportunityIds
        .map((id) => `FIND("${id}", {Opportunity})`)
        .join(", ")}))`;

    console.log("query:", query);

    const response = await apiClient.get(query);

    const unpackRecordScoreToDict = (record) => {
        let return_unpacked = {};
        console.log("Record is: ", record);
        const fields = ["about", "openTo", "skills", "industryInterests"];
        fields.map((field) => {
            return_unpacked[field] = {
                score: record.fields[field],
                reason: record.fields[`${field}_reason`],
                feedback: record.fields[`${field}_feedback`],
            };
        });
        return_unpacked.average = {
            score: fields.reduce((total, sc) => total + record.fields[sc], 0) / 4,
        };

        return return_unpacked;
    };

    const scoresExistArray = opportunities.map((opportunity) => {
        console.log(`Checking ${getScoreId(profile.id, opportunity.id)} against: `, response.data.records);
        const opportunityRecords = response.data.records.filter(
            (record) => record.fields.id === getScoreId(profile.id, opportunity.id)
        );

        console.log("opportunityRecords", opportunityRecords);
        console.log("opportunityRecords[0]", opportunityRecords[0]);
        if (opportunityRecords.length > 0) {
            return unpack ? unpackRecordScoreToDict(opportunityRecords[0]) : opportunityRecords[0];
        } else {
            return null;
        }
    });

    console.log("scoresExistArray: ", scoresExistArray);
    return scoresExistArray;
}

function createFieldsForOpportunity(profile, opportunity, score) {
    const opportunityId = opportunity.id;
    const fields = score;
    console.log("Fields: ", fields);
    return {
        id: getScoreId(profile.id, opportunityId),
        Profile: [profile.id], // Use an array here
        Opportunity: [opportunityId], // Use an array here
        about: fields.about.score,
        openTo: fields.openTo.score,
        skills: fields.skills.score,
        industryInterests: fields.industryInterests.score,
        about_reason: fields.about.reason,
        openTo_reason: fields.openTo.reason,
        skills_reason: fields.skills.reason,
        industryInterests_reason: fields.industryInterests.reason,
        about_feedback: fields.about.feedback ?? 0,
        openTo_feedback: fields.openTo.feedback ?? 0,
        skills_feedback: fields.skills.feedback ?? 0,
        industryInterests_feedback: fields.industryInterests.feedback ?? 0,
    };
}

/**
 * Function to get the profiles (or a specific one if given)
 */
export async function setScoreForOpportunities(profile, opportunities, new_scores) {
    // Create the score, assuming it doesn't exist
    const query = `/tblsiIFBis29HTU14`;
    console.log("Opportunities: ", opportunities);
    console.log("Scores: ", new_scores);

    let post_records = []; // Used to create new records
    let put_records = []; // Used to update existing records

    const existing_records = await doScoresExistForOpportunies(profile, opportunities, false);
    console.log("Existing records", existing_records);

    opportunities.map((opportunity) => {
        const score_id = getScoreId(profile.id, opportunity.id);
        const existing_record = existing_records.find((record) => record?.fields?.id === score_id);

        const fields = createFieldsForOpportunity(profile, opportunity, new_scores[score_id]);

        if (existing_record) {
            console.log("Pushing ", `${existing_record.id} for ${score_id}`, " because it already exists.");
            put_records.push({
                id: existing_record.id,
                fields: fields,
            });
        } else {
            console.log("Posting ", score_id, " because it doesn't yet exist.");
            post_records.push({
                fields: fields,
            });
        }
    });

    // Now you can proceed with post_records and push_records as needed

    if (put_records.length) {
        console.log("put_records: ", put_records)
        await apiClient.put(query, {
            records: put_records, // Use the constructed records array
        });
    }

    if (post_records.length) {
        console.log("post_records: ", post_records)
        await apiClient.post(query, {
            records: post_records, // Use the constructed records array
        });
    }
}
