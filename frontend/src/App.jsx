// Load react elements
import React, { useEffect, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import ScoreWindow from "./components/panelComponents/ScoreWindow";

// Load styles
import "./styles/App.css";

// Load data (will be on a backend soon enough)
import MyProfilePanel from "./components/MyProfilePanel";
import { getBatchOfOpportunities, getUserProfiles } from "./functions/Airtable";
import { getScoreId, getScoresForOpportunities } from "./functions/backend";
import ScorePanel from "./components/ScorePanel";

const App = () => {
    const [batchOpportunities, setBatchOpportunities] = useState([]);
    const [alreadySeenOpportunities, setAlreadySeenOpportunities] = useState([])
    const [batchScores, setBatchScores] = useState({});
    const [allUserProfiles, setAllUserProfiles] = useState([]);

    const [profile, setProfile] = useState({});

    const [currentTab, setCurrentTab] = useState("profile");

    // Load up another batch of opportunities
    const loadMoreOpportunities = () => {
        getBatchOfOpportunities(alreadySeenOpportunities).then((opportunities) => {
            setBatchOpportunities(opportunities);
            setAlreadySeenOpportunities(prevOpportunities => prevOpportunities.concat(opportunities ));
        });
    };

    // Load up the opportunities
    useState(() => {
        loadMoreOpportunities();
    }, []);

    useState(() => {
        getUserProfiles().then((tmp_profiles) => {
            setAllUserProfiles(tmp_profiles);
            setProfile(tmp_profiles[0]);
        });
    }, []);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    // Create a function to clear batch scores
    const clearBatchScores = async () => {
        setBatchScores([]); // Clear the scores
    };

    // Load up the scores
    useEffect(() => {
        const updateBatchScores = async () => {
            if (batchOpportunities.length && profile.id != null && profile?.fields?.about != null) {
                await clearBatchScores(); // Clear the scores first

                const tmp_scores = await getScoresForOpportunities(profile, batchOpportunities);
                setBatchScores(tmp_scores); // Set the updated batchScores
            }
        };

        updateBatchScores();
    }, [profile, batchOpportunities]);

    const tabElements = {
        profile: {
            title: "User Profiles",
            render: (
                <MyProfilePanel profile={profile.fields} allUserProfiles={allUserProfiles} setProfile={setProfile} />
            ),
        },
        opportunities: {
            title: "Opportunities",
            render: <ScorePanel profile={profile} batchOpportunities={batchOpportunities} batchScores={batchScores} loadMoreOpportunities={loadMoreOpportunities}/>,
        },
    };

    return (
        <div className="App">
            <TabContext value={currentTab}>
                <Box sx={{ display: "flex" }}>
                    {/* Vertical tabs on the left */}
                    <Tabs
                        value={currentTab}
                        orientation="vertical"
                        variant="scrollable"
                        onChange={handleTabChange}
                        sx={{
                            borderRight: 1,
                            borderColor: "divider",
                            flex: "20%", // Set the width to 20% of the parent's width
                        }}
                    >
                        {Object.keys(tabElements).map((key) => {
                            return <Tab label={tabElements[key].title} value={key} key={key} />;
                        })}
                    </Tabs>

                    <Box sx={{ flex: "80%" }}>
                        {" "}
                        {/* Set the width to 80% of the parent's width */}
                        {Object.keys(tabElements).map((key) => {
                            return (
                                <TabPanel value={key} key={key}>
                                    {tabElements[key].render}
                                </TabPanel>
                            );
                        })}
                    </Box>
                </Box>
            </TabContext>
        </div>
    );
};

export default App;
