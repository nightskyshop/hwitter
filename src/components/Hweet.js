import { dbService, storageService } from "fbase";
import { deleteObject, ref } from "@firebase/storage";
import React, { useState } from "react";

const Hweet = ({ hweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newHweet, setNewHweet] = useState(hweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure?");
        if(ok) {
            await dbService.doc(`hweets/${hweetObj.id}`).delete();
            if (hweetObj.attachmentUrl) {
                await deleteObject(ref(storageService, hweetObj.attachmentUrl));
            }
        }
    }
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`hweets/${hweetObj.id}`).update({
            text: newHweet
        });
        setEditing(false);
    }
    const onChange = (event) => {
        const { target: {value} } = event;
        setNewHweet(value);
    }
    return (
        <div key={hweetObj.id}>
            {
                editing ? (
                    <>
                        <form onSubmit={onSubmit}>
                            <input
                                onChange={onChange}
                                type="text"
                                placeholder="Edit hweet"
                                value={newHweet}
                                required
                            />
                            <input value="Update Hweet" type="submit" />
                        </form>
                        <button onClick={toggleEditing}>Cancel</button>
                    </>
                ) : (
                    <>
                        <h4>{hweetObj.text}</h4>
                        {hweetObj.attachmentUrl && <img src={hweetObj.attachmentUrl} width="50px" height="50px" alt="" />}
                        {isOwner && (
                            <>
                                <button onClick={onDeleteClick}>Delete Hweet</button>
                                <button onClick={toggleEditing}>Edit Hweet</button>
                            </>
                        )}
                    </>
                )
            }
            
        </div>
    )
}

export default Hweet;