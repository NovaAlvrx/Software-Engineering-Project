import emptyHeartIcon from '../../assets/icons/empty-heart.png'
import filledHeartIcon from '../../assets/icons/filled-heart.png'
import './Like.css'

function Like({ liked, onToggle=()=>{} }) {
    console.log('Like Component - liked: ', liked)
    return (
        <div className="Like">
            <button className="like-button" onClick={onToggle} aria-pressed={liked}>
                { liked ? (
                    <img src={filledHeartIcon} alt="filled-heart-icon" className="like-button" />
                ) : (
                    <img src={emptyHeartIcon} alt="empty-heart-icon" className="like-button" />
                ) }
            </button>
        </div>
    )
}

export default Like;