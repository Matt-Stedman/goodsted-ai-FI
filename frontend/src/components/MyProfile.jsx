import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

const MyProfile = (props) => {
    return (
        <div style={{ width: "100%", justifyContent: "center" }}>
            <h2>{props.profile.name}</h2>
            <Box>
                <div>
                    From: {props.profile.town}, {props.profile.country}
                </div>
                <div>Profession: {props.profile.profession}</div>
                <h3>About</h3>
                <div>{props.profile.about}</div>
                <h3>Open to</h3>
                <div>{props.profile.openTo.join(", ")}</div>
                <h3>Skills</h3>
                <div>{props.profile.skills.join(", ")}</div>
                <h3>Industry interests</h3>
                <div>{props.profile.industryInterests.join(", ")}</div>
                <h3>Cause interests</h3>
                <div>{props.profile.causeInterests.join(", ")}</div>
            </Box>
        </div>
    );
};
export default MyProfile;
