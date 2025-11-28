import './Post.css'
import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import LikeComponent from '../like/Like.jsx'
import CommentComponent from '../comment/Comment.jsx'
import { UserContext} from '../../context/UserContext.jsx'
import AllComments from '../all-comments/AllComments.jsx'

function Post({post_details}) {
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [likes, setLikes] = useState(post_details.likeCount || 0);
    const [isLiked, setIsLiked] = useState(post_details.likedByUser || false);
    const [comments, setComments] = useState();
    const [commentsCount, setCommentsCount] = useState(0)
    const [newComment, setNewComment] = useState('')
    const postId = post_details.postId;
    const [commentsOpen, setCommentsOpen] = useState(false);
    const user = useContext(UserContext);

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

        const fetchComments = async () => {
            const response = await axios('http://localhost:8000/posts/comments', {
                params: { postId: postId },
                withCredentials: true
            });

            const data = response.data;

            if (data) {
                setComments(data.comments);
                setCommentsCount(data.comments.length)
                console.log(data.comments)
            }
        }

        fetchComments();
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

    const handleOpenComments = () => {
        setCommentsOpen(prev => !prev);
        console.log('Comments open: ', commentsOpen);
    }

    const handleAddComment = async (e) => {
        e.preventDefault();

        console.log('Adding comment for: ', postId, user.id, newComment)

        if (newComment.trim().length === 0) return;

        const response = await axios.post('http://localhost:8000/posts/add_comment',
            { postId: postId, userId: user.id, comment: newComment},
            { withCredentials: true }
        )

        if (response) {
            setComments(prev => [
                ...prev,
                {
                    "comment": newComment,
                    "user": `${user.fName} ${user.lName}`,
                    "pfp": user.profile_picture
                }
            ])

            setNewComment('');
            setCommentsCount(prev => prev + 1)
        }
    }

    return (
        <div className={`Post ${commentsOpen ? 'comments-open' : 'comments-closed'}`}>
            <div className="post-container flex-column">
                <div className="flex-row-center post-top-wrapper space-between">
                    <div className="flex-row-center">
                        <img src={profilePicture} alt='user-profile' className='top-wrapper-pfp'/>
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
                            <CommentComponent onToggle={handleOpenComments}/>
                            <p className="number-of-comments">{commentsCount}</p>
                        </div>
                    </div>
                    <div className="flex-row-start post-description-wrapper">
                        <p className="posted-by">{username}</p>
                        <p className="post-description">{post_details.description}</p>
                    </div>
                </div>
            </div>
            <div className="post-comments-section">
                {commentsOpen ? (
                    <div className="post-comments-section">
                        <div className='comments-section-wrapper'>
                            <AllComments post_comments={comments}/>
                        </div>
                        <div className='post-comment-wrapper'>
                            <form id="post-comment">
                                <input 
                                    id='comment-content'
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                />
                                <input 
                                    type="submit"
                                    text="Post"
                                    id="submit-comment" 
                                    onClick={e => handleAddComment(e)} 
                                />
                            </form>
                        </div>
                    </div>
                ) : (<></>)}
            </div>
        </div>
    )
}

export default Post;