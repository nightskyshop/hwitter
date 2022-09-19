import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Profile = ({ refreshUser, userObj }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => authService.signOut();
    let hweets;
    const getMyHweets = async () => {
        hweets = await dbService
            .collection("hweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createAt")
            .get();
        console.log(hweets.docs.map((doc) => doc.data()));
    };

    useEffect(() => {
        getMyHweets();
    }, []);

    const onChange = (event) => {
        const { target: {value} } = event;
        setNewDisplayName(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName,
            })
            refreshUser();
        }
    }
    return(
        <>
            <form onSubmit={onSubmit}>
                <input
                    onChange={onChange}
                    type="text"
                    placeholder="Display name"
                    value={newDisplayName}
                />
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
};
export default Profile;