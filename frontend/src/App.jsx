import React, { useEffect, useState } from "react";
import "./styles/App.css";

import opportunities from "./data_tmp/opportunities.json";
import profiles from "./data_tmp/profiles.json";
import { TabContext, TabPanel } from "@mui/lab";
import { Box, Tab, Tabs } from "@mui/material";

const App = () => {
    const [batchOpportunities, setBatchOpportunities] = useState([]);
    const [batchScores, setBatchScores] = useState([]);
    const [currentOpportunity, setCurrentOpportunity] = useState("0");
    const [hoveredOpportunity, setHoveredOpportunity] = useState("0");

    /**
     * Handle the changing of tabs
     */
    const handleTabChange = (event, newValue) => {
        setTimeout(() => {
            setCurrentOpportunity(newValue);
        }, 100); // Delayed update to wait for 500ms after the action is completed
    };

    const displayOpportunities = () => {
        return batchOpportunities.length > 0;
    };

    useState(() => {
        setTimeout(() => {
            setBatchOpportunities(opportunities.slice(0, 10));
        }, 1000); // Delayed update to wait for 500ms after the action is completed
    }, []);

    return (
        <div className="App">
            <header className="lock-header"></header>
            <header className="header">
                <h1>
                    <span className="hardstuff">Hard Stuff </span>
                </h1>
                <p> Accelerating Hardware Solutions for a Sustainable Future</p>
            </header>
            {displayOpportunities() ? (
                <TabContext value={`${currentOpportunity}`}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "center" }}>
                        <Tabs value={`${currentOpportunity}`} onChange={handleTabChange}>
                            {batchOpportunities.map((opportunity, index) => (
                                <Tab
                                    label={`${index}` === currentOpportunity ? "🟢" : "🔴"}
                                    value={`${index}`}
                                    key={index}
                                />
                            ))}
                        </Tabs>
                    </Box>
                    {batchOpportunities.map((opportunity, index) => (
                        <TabPanel style={{ padding: 10, alignContent: "center" }} value={`${index}`} key={index}>
                            <div>Beans!</div>
                        </TabPanel>
                    ))}
                </TabContext>
            ) : (
                <div>Loading</div>
            )}

            <footer className="footer">
                <div className="content">
                    <div className="footer-links">
                        {/* <a href="#careers">Careers</a> */}
                        {/* <a href="#contact">Contact</a> */}
                    </div>
                    <p>
                        &copy; {new Date().getFullYear()} <span className="hardstuff">Hard Stuff</span>. All rights
                        reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default App;
