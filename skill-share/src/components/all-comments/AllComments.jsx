import './AllComments.css'
import { useState } from 'react'

function AllComments({ post_comments }) {
    const comments = post_comments || null;

    return (
        <div className="AllComments"> 
            {!comments || comments.length == 0 ? (
                <p className="no-comments-container">No Comments</p>
            ) : (
                comments.map((comment, index) => (
                <div className="comment-container" key={index}>
                    <img src={comment.pfp}></img>
                    <p className="username">{comment.user}</p>
                    <p>{comment.comment}</p>
                </div>
            )
            ))}
        </div>
    )
}

export default AllComments;
