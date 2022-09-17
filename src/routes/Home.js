import Hweet from "components/Hweet";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
    const [hweet, setHweet] = useState("");
    const [hweets, setHweets] = useState([]);
    const [attachment, setAttachment] = useState("");
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
        let attachmentUrl = "";
        if (attachment !== "") {
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl =  await getDownloadURL(response.ref);
        } 
        const hweetObj = {
            text:hweet,
            createAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        }
        await dbService.collection("hweets").add(hweetObj);
        setHweet("");
        setAttachment("");
    }
    const onChange = (event) => {
        const { target: {value} } = event;
        setHweet(value);
    }
    const onFileChange = (event) => {
        const { target: {files} } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { currentTarget: {result} } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }
    const onClearAttachment = () => setAttachment("");
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    value={hweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type="file" accept="image/*" onChange={onFileChange} />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" alt="" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
                <input onClick={onSubmit} type="submit" value="Hweet" />
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