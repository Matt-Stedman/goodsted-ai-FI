// Load react elements
import React, { useEffect, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import ScoreWindow from "./components/ScoreWindow";

// Load AI functions
import { scoreOpportunityAgainstProfile } from "./functions/OpenAi";

// Load styles
import "./styles/App.css";

// Load data (will be on a backend soon enough)
import opportunities from "./data_tmp/opportunities.json";
import profiles from "./data_tmp/profiles.json";
import Opportunity from "./components/Opportunity";

const App = () => {
    const [batchOpportunities, setBatchOpportunities] = useState([]);
    const [batchScores, setBatchScores] = useState({});
    const [currentOpportunity, setCurrentOpportunity] = useState("0");

    const [profile, setProfile] = useState(profiles[0]);

    /**
     * Handle the changing of tabs
     */
    const handleTabChange = (event, newValue) => {
        setTimeout(() => {
            setCurrentOpportunity(newValue);
        }, 100); // Delayed update to wait for 500ms after the action is completed
    };

    // Helper function
    const displayOpportunities = () => {
        return Object.keys(batchScores).length > 0;
    };

    // Load up the opportunities
    useState(() => {
        setBatchOpportunities(opportunities.slice(0, 10));
    }, []);

    // Load up the scores
    useEffect(() => {
        const updateScores = async () => {
            const updatedBatchScores = { ...batchScores }; // Create a copy of batchScores

            const scorePromises = batchOpportunities.map(async (each_op) => {
                if (updatedBatchScores[each_op.id] == null) {
                    const each_score = await scoreOpportunityAgainstProfile(each_op, profile);
                    console.log(`For ${each_op.id} the score is ${each_score}`);
                    updatedBatchScores[each_op.id] = each_score; // Update the score for the opportunity ID
                }
            });

            await Promise.all(scorePromises); // Wait for all scores to be calculated
            console.log("updatedBatchScores: ", updatedBatchScores);
            setBatchScores(updatedBatchScores); // Set the updated batchScores
        };

        updateScores();
    }, [batchOpportunities]);

    return (
        <div className="App">
            {displayOpportunities() ? (
                <TabContext value={`${currentOpportunity}`}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "center" }}>
                        <Tabs value={`${currentOpportunity}`} onChange={handleTabChange}>
                            {Object.keys(batchScores).map((id, index) => (
                                <Tab
                                    label={`${index}` === currentOpportunity ? "🟢" : "🔴"}
                                    value={`${index}`}
                                    key={index}
                                />
                            ))}
                        </Tabs>
                    </Box>
                    {Object.keys(batchScores).map((id, index) => (
                        <TabPanel
                            style={{ padding: 10, justifyContent: "center", margin: "auto", width: "50%" }}
                            value={`${index}`}
                            key={index}
                        >
                            <ScoreWindow scores={batchScores[id]} />
                            <Opportunity opportunity={batchOpportunities.find((op) => op.id === id)} />
                        </TabPanel>
                    ))}
                </TabContext>
            ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "95vh" }}>
                    Loading
                </div>
            )}
        </div>
    );
};

export default App;
