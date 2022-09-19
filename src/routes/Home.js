import Hweet from "components/Hweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import HweetFactory from "components/HweetFactory";

const Home = ({ userObj }) => {
    const [hweets, setHweets] = useState([]);
    const getNweet = async () => {
        const dbHweets = await dbService.collection("hweets").get();
        dbHweets.forEach((document) => {
            const hweetObject = {
                ...document.data(),
                id: document.id,
            }
            setHweets(prev => [hweetObject, ...prev]);
        });
    }
    useEffect(() => {
        getNweet();
        dbService.collection("hweets").onSnapshot((snapshot) => {
            const hweetArray = snapshot.docs.map((doc) => ({
                id:doc.id,
                ...doc.data()
            }));
            setHweets(hweetArray)
        })
    }, []);
    return (
        <div className="container">
            <HweetFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
                {hweets.map((hweet) => (
                    <Hweet key={hweet.id} hweetObj={hweet} isOwner={hweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    )
};
export default Home;