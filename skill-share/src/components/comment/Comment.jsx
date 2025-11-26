import commentIcon from '../../assets/icons/comments.png'
import './Comment.css'

function comment({ onToggle=()=>{} }) {
    return (
        <div className="Comment">
            <button className="comment-button" onClick={onToggle}>
                <img src={commentIcon} alt="comment-icon" id="comment-icon"></img>
            </button>
        </div>
    )
}

export default comment;
