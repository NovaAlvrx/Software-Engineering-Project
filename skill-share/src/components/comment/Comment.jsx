import commentIcon from '../../assets/icons/comments.png'
import './Comment.css'

function comment() {
    return (
        <div className="Comment">
            <button className="comment-button">
                <img src={commentIcon} alt="comment-icon" id="comment-icon"></img>
            </button>
        </div>
    )
}

export default comment;
