import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

const Opportunity = (props) => {
    return (
        <div style={{ width: "100%", justifyContent: "center" }}>
            <h1>{props.opportunity["name"]}</h1>
            <img src={props.opportunity["image"]} width="50%" />
            {["about", "description", "need", "problem", "why"].map((each_it) => (
                <Box
                    key={each_it}
                    sx={{
                        position: "relative",
                        padding: "10px",
                        boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
                        margin: "5px",
                    }}
                >
                    <h2>{each_it}</h2>
                    <span>{props.opportunity[each_it]}</span>
                </Box>
            ))}
        </div>
    );
};
export default Opportunity;
