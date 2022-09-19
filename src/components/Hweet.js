import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { deleteObject, ref } from "@firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
        <div className="nweet">
            {
                editing ? (
                    <>
                        <form onSubmit={onSubmit} className="container nweetEdit">
                            <input
                                onChange={onChange}
                                type="text"
                                placeholder="Edit hweet"
                                value={newHweet}
                                required
                                autoFocus
                                className="formInput"
                            />
                            <input type="submit" value="Update Nweet" className="formBtn" />
                        </form>
                        <span onClick={toggleEditing} className="formBtn cancelBtn">
                            Cancel
                        </span>
                    </>
                ) : (
                    <>
                        <h4>{hweetObj.text}</h4>
                        {hweetObj.attachmentUrl && <img src={hweetObj.attachmentUrl} />}
                        {isOwner && (
                            <div className="nweet__actions">
                                <span onClick={onDeleteClick}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </span>
                                <span onClick={toggleEditing}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </span>
                            </div>
                        )}
                    </>
                )
            }
            
        </div>
    )
}

export default Hweet;