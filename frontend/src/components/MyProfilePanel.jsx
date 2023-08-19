import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import "../styles/App.css";

const MyProfilePanel = (props) => {
    useEffect(() => {
        // console.log("Profile is: ", props.profile);
        // console.log("allUserProfiles is: ", props.allUserProfiles);
    }, [props.profile]);

    const changeToProfile = (index) => {
        if (props.allUserProfiles.length) {
            props.setProfile(props.allUserProfiles[index]);
        }
    };

    return (
        props.profile?.name && (
            <div style={{ width: "100%", justifyContent: "center" }}>
                <Box>
                    <h2>Switch user profile</h2>
                    {props.allUserProfiles.map((each_user_profile, index) => (
                        <Button
                            onClick={() => {
                                props.setProfile(each_user_profile);
                            }}
                            key={index}
                            variant={each_user_profile.fields.name === props.profile.name ? "contained" : "text"}
                        >
                            {each_user_profile.fields.name}
                        </Button>
                    ))}
                </Box>
                <h2>{props.profile.name}</h2>
                <div>
                    From: {props.profile.town}, {props.profile.country}
                </div>
                <div>Profession: {props.profile.profession}</div>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)", // Two columns
                        gap: "10px", // Gap between items
                    }}
                >
                    <Box>
                        <h3>About</h3>
                        {props.profile.about}
                    </Box>
                    <Box>
                        <h3>Open to</h3>
                        {props.profile.openTo.join(", ")}
                    </Box>
                    <Box>
                        <h3>Skills</h3>
                        {props.profile.skills.join(", ")}
                    </Box>
                    <Box>
                        <h3>Industry interests</h3>
                        {props.profile.industryInterests.join(", ")}
                    </Box>
                    <Box>
                        <h3>Cause interests</h3>
                        {props.profile.causeInterests.join(", ")}
                    </Box>
                </Box>
            </div>
        )
    );
};
export default MyProfilePanel;
