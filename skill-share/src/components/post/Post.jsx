import './Post.css'
import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import LikeComponent from '../like/Like.jsx'
import CommentComponent from '../comment/Comment.jsx'
import { UserContext} from '../../context/UserContext.jsx'

function Post({post_details}) {
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [likes, setLikes] = useState(post_details.likeCount || 0);
    const [isLiked, setIsLiked] = useState(post_details.likedByUser || false)
    const user = useContext(UserContext)

    useEffect(() => {
        const fetchUserName = async () => {
            const response = await axios('http://localhost:8000/users/profile', {
                params: { id: post_details.userId },
                withCredentials: true
            });

            const data = response.data;

            setProfilePicture(data.user_data.profile_picture);
            setUsername(`${data.user_name.fName} ${data.user_name.lName}`);
        }

        fetchUserName();
    }, [post_details.userId]);

    const handleToggleLike = async () => {
        // implement modal to log in 
        if (username === '') {
            alert('Please log in to like posts.')
            return 
        }

        setIsLiked(prev => !prev);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);

        if (!isLiked) {
            await axios.post('http://localhost:8000/posts/toggle-like', 
                            { userId: user.id, postId: post_details.postId}, 
                            { withCredentials: true });
        } else {
            await axios.delete('http://localhost:8000/posts/toggle-unlike', 
                            {
                                data: {userId: user.id, postId: post_details.postId},
                                withCredentials: true
                            }
                        );
        }
    }

    return (
        <div className="Post flex-column">
            <div className="flex-row-center post-top-wrapper space-between">
                <div className="flex-row-center">
                    <img src={profilePicture} alt='user-profile'/>
                    <p className="posted-by">{username}</p>
                </div>
                <p className="post-creation-text">{post_details.created_date}</p>
            </div>
            <img src={post_details.img} alt="post" className="post-img" onDoubleClick={handleToggleLike} />
            <div className="post-bottom-wrapper">
                <div className="post-like-comment-wrapper flex-row-start">
                    <div className="flex-row-center">
                        <LikeComponent liked={isLiked} onToggle={handleToggleLike} />
                        <p className="number-of-likes">{likes}</p>
                    </div>
                    <div className="flex-row-center">
                        <CommentComponent />
                        <p className="number-of-comments">0</p>
                    </div>
                </div>
                <div className="flex-row-start post-description-wrapper">
                    <p className="posted-by">{username}</p>
                    <p className="post-description">{post_details.description}</p>
                </div>
            </div>
        </div>
    )
}

export default Post;