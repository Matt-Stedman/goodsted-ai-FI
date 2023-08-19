// Load react elements
import React, { useEffect, useState } from "react";
import { Box, Button, Tab, Tabs, Tooltip } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import ScoreWindow from "./panelComponents/ScoreWindow";

// Load styles
import "../styles/App.css";

// Load data (will be on a backend soon enough)
import Opportunity from "./panelComponents/Opportunity";
import { getScoreId, getScoresForOpportunities } from "../functions/backend";

const ScorePanel = (props) => {
    const [currentOpportunity, setCurrentOpportunity] = useState("0");

    /**
     * Handle the changing of tabs
     */
    const handleTabChange = (event, newValue) => {
        setCurrentOpportunity(newValue);
    };

    // Helper function
    const displayOpportunities = () => {
        if (props.profile && props.batchOpportunities && props.batchScores) {
            return Object.keys(props.batchScores).length > 0;
        } else {
            return false;
        }
    };

    return (
        <div style={{ width: "100%" }}>
            <span style={{position: "relative", left:"-25%", fontSize: "0.75em", marginTop: 0, color: "grey"}}>
                Logged on as: {props.profile.fields.name}
                </span>
            {displayOpportunities() ? (
                <TabContext value={`${currentOpportunity}`}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "center" }}>
                        <Tabs value={`${currentOpportunity}`} onChange={handleTabChange}>
                            {Object.keys(props.batchScores).map((id, index) => (
                                <Tab
                                    label={props.batchScores[id].average.score}
                                    value={`${index}`}
                                    key={index}
                                    title={props.batchOpportunities[index].fields.name}
                                />
                            ))}
                        </Tabs>
                        <Button onClick={props.loadMoreOpportunities}>Load 5 more...</Button>
                    </Box>
                    {props.batchOpportunities.map((each_op, index) => (
                        <TabPanel
                            style={{ padding: 10, justifyContent: "center", margin: "auto" }}
                            value={`${index}`}
                            key={index}
                        >
                            <ScoreWindow scores={props.batchScores[getScoreId(props.profile.id, each_op.id)]} />
                            <Opportunity opportunity={each_op.fields} />
                        </TabPanel>
                    ))}
                </TabContext>
            ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>Loading scores...</div>
            )}
        </div>
    );
};

export default ScorePanel;
