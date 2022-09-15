import Hweet from "components/Hweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
    const [hweet, setHweet] = useState("");
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

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("hweets").add({
            text:hweet,
            createAt: Date.now(),
            creatorId: userObj.uid,
        });
        setHweet("");
    }
    const onChange = (event) => {
        const { target: {value} } = event;
        setHweet(value);
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} value={hweet} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="submit" value="Hweet" />
            </form>
            <div>
                {hweets.map((hweet) => (
                    <Hweet key={hweet.id} hweetObj={hweet} isOwner={hweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    )
};
export default Home;