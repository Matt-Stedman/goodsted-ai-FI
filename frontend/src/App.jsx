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
    const [batchScores, setBatchScores] = useState({});
    const [allUserProfiles, setAllUserProfiles] = useState([]);

    const [profile, setProfile] = useState({});

    // Load up the opportunities
    useState(() => {
        getBatchOfOpportunities().then((opportunities) => {
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
                setBatchScores(tmp_scores);
            }); // Set the updated batchScores
        }
    }, [profile, batchOpportunities]);

    return (
        <div className="App">
            <MyProfilePanel profile={profile.fields}/>
            <ScorePanel profile={profile} batchOpportunities={batchOpportunities} batchScores={batchScores} />
        </div>
    );
};

export default App;
