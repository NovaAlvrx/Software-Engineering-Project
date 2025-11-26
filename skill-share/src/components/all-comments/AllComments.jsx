import './AllComments.css'

function AllComments({ post_comments }) {
    const comments = post_comments || null;
    console.log('AllComments: ', post_comments)

    return (
        <div className="AllComments"> 
            {!comments || comments.length == 0 ? (
                <p className="no-comments-container">No Comments</p>
            ) : (
                comments.map((comment) => (
                <div className="comment-container">
                    <img src={comment.pfp}></img>
                    <p key={comment.comment_id} className="username">{comment.user}</p>
                    <p key={comment.comment_id}>{comment.comment}</p>
                </div>
            )
            ))}
        </div>
    )
}

export default AllComments;
