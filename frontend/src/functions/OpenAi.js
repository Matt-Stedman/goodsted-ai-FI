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

const sterilizeFormData = (raw_form_data) => {
    let form_data = {};
    for (const key in raw_form_data) {
        if (Object.prototype.hasOwnProperty.call(raw_form_data, key)) {
            const value = raw_form_data[key];
            if (typeof value === "string") {
                form_data[key] = value.replace(/"/g, "'").replace(/\n/g, " ");
            } else {
                form_data[key] = value;
            }
        }
    }
    return form_data;
};

/**
 * Function to create general feedback for the entire posting
 */
export async function reviewEntireOpportunityGenerally(opportunity, profile) {
    const prompt = `
Help me decide if this person's profile would be a good or bad fit for this volunteering opportunity. You must return your response as a json format:
{
    score: [0-10]
    reason: [NO MORE THAN 50 WORDS]
}

OPPORTUNITY:
${opportunity}

PROFILE:
${profile}
        `;

    const response = await chatGPTClient.post("/", {
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        max_tokens: 100,
    });

    console.log(response);

    return response.data.choices[0].message.content;
}
