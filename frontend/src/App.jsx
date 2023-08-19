// Load react elements
import React, { useEffect, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import ScoreWindow from "./components/ScoreWindow";

// Load styles
import "./styles/App.css";

// Load data (will be on a backend soon enough)
import Opportunity from "./components/Opportunity";
import MyProfile from "./components/MyProfile";
import { getBatchOfOpportunities, getUserProfiles } from "./functions/Airtable";
import { getScoreId, getScoresForOpportunities } from "./functions/backend";

const App = () => {
    const [batchOpportunities, setBatchOpportunities] = useState([]);
    const [batchScores, setBatchScores] = useState({});
    const [currentOpportunity, setCurrentOpportunity] = useState("0");
    const [allUserProfiles, setAllUserProfiles] = useState([]);

    const [profile, setProfile] = useState({});

    /**
     * Handle the changing of tabs
     */
    const handleTabChange = (event, newValue) => {
        setCurrentOpportunity(newValue);
    };

    // Helper function
    const displayOpportunities = () => {
        return Object.keys(batchScores).length > 0;
    };

    // Load up the opportunities
    useState(() => {
        getBatchOfOpportunities().then((opportunities) => {
            console.log(opportunities);
            setBatchOpportunities(opportunities);
        });
    }, []);

    useState(() => {
        getUserProfiles().then((tmp_profiles) => {
            setAllUserProfiles(tmp_profiles);
            setProfile(tmp_profiles[0]);
        });
    }, []);

    const changeToProfile = (index) => {
        if (allUserProfiles.length) {
            setProfile(allUserProfiles[index]);
        }
    };

    // Load up the scores
    useEffect(() => {
        if (batchOpportunities.length && profile.id != null && profile?.fields?.about != null) {
            getScoresForOpportunities(profile, batchOpportunities).then((tmp_scores) => {
                console.log("batchScores:", tmp_scores);
                setBatchScores(tmp_scores);
            }); // Set the updated batchScores
        }
    }, [batchOpportunities]);

    return (
        <div className="App">
            {displayOpportunities() ? (
                <TabContext value={`${currentOpportunity}`}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "center" }}>
                        <Tabs value={`${currentOpportunity}`} onChange={handleTabChange}>
                            <Tab label="My profile" value={"100"} key={100} />
                            {Object.keys(batchScores).map((id, index) => (
                                <Tab
                                    label={`${index}` === currentOpportunity ? `${index}` : "🔴"}
                                    value={`${index}`}
                                    key={index}
                                />
                            ))}
                        </Tabs>
                    </Box>
                    <TabPanel
                        style={{ padding: 10, justifyContent: "center", margin: "auto", width: "50%" }}
                        value={"100"}
                        key={100}
                    >
                        <MyProfile profile={profile.fields} />
                    </TabPanel>
                    {batchOpportunities.map((each_op, index) => (
                        <TabPanel
                            style={{ padding: 10, justifyContent: "center", margin: "auto", width: "50%" }}
                            value={`${index}`}
                            key={index}
                        >
                            <ScoreWindow scores={batchScores[getScoreId(profile.id, each_op.id)]} />
                            <Opportunity opportunity={each_op.fields} />
                        </TabPanel>
                    ))}
                </TabContext>
            ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "95vh" }}>
                    Loading..
                </div>
            )}
        </div>
    );
};

export default App;
