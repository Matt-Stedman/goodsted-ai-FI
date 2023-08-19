import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { colourant } from "../../functions/colouring";
import { giveFeedbackToScore } from "../../functions/backend";

const ScoreWindow = (props) => {
    const [scores, setScores] = useState(props.scores);
    const [timeoutId, setTimeoutId] = useState(null);

    // Handle the mouse going over a score element to reveal the reason
    const handleMouseEnter = (score_element) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }

        const updatedScores = Object.keys(scores).reduce((updated, element) => {
            updated[element] = { ...scores[element], showReason: element === score_element };
            return updated;
        }, {});

        setScores(updatedScores);
    };

    // Handle the mouse leaving a score element to hide the reason
    const handleMouseLeave = (score_element) => {
        const newTimeoutId = setTimeout(() => {
            setScores({ ...scores, [score_element]: { ...scores[score_element], showReason: false } });
        }, 1000);
        setTimeoutId(newTimeoutId);
    };

    // Add a score to the reason for future

    // Circular element wrapper with better stylings and better functionality
    const circularElement = (score_element, title) => {
        return (
            <Box
                key={score_element}
                sx={{
                    position: "relative",
                    padding: "5px",
                    flex: "0 0 calc(20% - 20px)",
                    boxSizing: "border-box",
                    boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                    margin: "5px",
                }}
                onMouseEnter={() => handleMouseEnter(score_element)}
                onMouseLeave={() => handleMouseLeave(score_element)}
            >
                {title} <br />
                <CircularProgress
                    variant="determinate"
                    value={scores[score_element]?.score}
                    sx={{
                        color: colourant(scores[score_element]?.score), // Apply the custom color to the CircularProgress
                        marginTop: "10px",
                    }}
                />
                {scores[score_element].reason && (
                    <div
                        style={{
                            position: "absolute",
                            width: "300%",
                            maxWidth: "400px",
                            background: "white",
                            border: "1px solid gray",
                            padding: "10px",
                            borderRadius: "5px",
                            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                            left: "50%",
                            transform: scores[score_element]?.showReason
                                ? "translateX(-50%) translateY(-10px)"
                                : "translateX(-50%) translateY(-1000px)",
                            transition: "transform 0.3s ease-in-out",
                            zIndex: 100,
                        }}
                    >
                        {scores[score_element].reason}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Button
                                onClick={() => {
                                    giveFeedbackToScore(scores[score_element], 1);
                                }}
                            >
                                👍
                            </Button>
                            <Button
                                onClick={() => {
                                    giveFeedbackToScore(scores[score_element], -1);
                                }}
                            >
                                👎
                            </Button>
                        </div>
                    </div>
                )}
            </Box>
        );
    };

    // Return all elements as the list
    return (
        <Box sx={{ padding: "10px", display: "flex", flexWrap: "wrap" }}>
            <div style={{ marginRight: "50px" }}>{circularElement("average", "General fit")}</div>
            {circularElement("about", "About you")}
            {circularElement("openTo", "What you're open to")}
            {circularElement("skills", "Your skills")}
            {circularElement("industryInterests", "Your industry interests")}
        </Box>
    );
};

export default ScoreWindow;
