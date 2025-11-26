import { useState } from 'react';
import './all-comments.css'

function AllComments() {
    const [postId, setPostId] = useState(null);
    const [comments, setComments] = useState(['No comments']);

    return (
        <div className="AllComments"> 
            {comments.map((comment, index) => (
                <p key={index}>{comment}</p>
            ))}
        </div>
    )
}

export default AllComments;
