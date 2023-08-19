import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

const Opportunity = (props) => {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)", // Two columns
                gap: "10px", // Gap between items
            }}
        >
            <h1>{props.opportunity["name"]}</h1>
            <img src={props.opportunity["image"]} width="100%" />
            {["about", "description", "need", "problem", "why"].map((each_it) => (
                <Box
                    key={each_it}
                    sx={{
                        padding: "10px",
                    }}
                >
                    <h2>{each_it}</h2>
                    <span>{props.opportunity[each_it]}</span>
                </Box>
            ))}
        </Box>
    );
};
export default Opportunity;
