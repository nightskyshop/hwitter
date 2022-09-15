import { dbService } from "fbase";
import React, { useState } from "react";

const Hweet = ({ hweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newHweet, setNewHweet] = useState(hweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure?");
        if(ok) {
            await dbService.doc(`hweets/${hweetObj.id}`).delete();
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
                        <span>{hweetObj.text}</span>
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