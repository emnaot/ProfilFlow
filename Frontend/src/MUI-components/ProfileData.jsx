import React from "react";

/**
 * Renders information about the user obtained from MS Graph
 * @param props 
 */
export const ProfileData = (props) => {
    return (
        <div id="profile-div">
            <img src={props.graphData.photo} alt="Profile" style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
            <p><strong>First Name: </strong> {props.graphData.displayName}</p>
            <p><strong>Mail: </strong> {props.graphData.mail}</p>
        </div>
    );
};
