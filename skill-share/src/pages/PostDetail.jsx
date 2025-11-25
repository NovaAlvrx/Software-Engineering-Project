import { useLocation, useNavigate, useParams } from 'react-router-dom'
import './PostDetail.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

function PostDetail() {
    const navigate = useNavigate()
    const { id, post_id } = useParams()
    // const location = useLocation()
    // const post = location.state?.post

    console.log('PostDetail user id: ', id)
    console.log('PostDetail post id: ', post_id)

    const [post, setPost] = useState({
        'image': null,
        'description': null
    })

    const postForm = new FormData();
    postForm.append('userId', id)
    postForm.append('postId', post_id)

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await axios(`http://localhost:8000/users/post`, {
                    params: { userId: id, postId: post_id },
                    withCredentials: true,
                });

                const data = response.data

                setPost({
                    'image': data.post_data.img,
                    'description': data.post_data.description
                })
            } catch (error) {
                console.error('Error fetching post', error)
            }
        };

        fetchPostData();
    }, [])

    const handleBack = () => {
        const basePath = id ? `/profile/${id}` : '/'
        navigate(basePath)
    }

    if (!post) {
        return (
            <div className="post-detail-container">
                <main className="post-detail">
                    <button className="back-button" onClick={handleBack}>
                        ← Back to profile
                    </button>
                    <div className="post-detail-content">
                        <h2>Post Not Available</h2>
                        <p>
                            We could not load the details for this post. Try returning to the profile
                            and selecting it again.
                        </p>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="post-detail-container">
            <div className="post-detail">
                <button className="back-button" onClick={handleBack}>
                    ← Back to profile
                </button>
                <div className="post-detail-content">
                    <div className="post-detail-image-wrapper">
                        <img src={post.image} alt={post.title || `Post ${post.id}`} />
                    </div>
                    <div className="post-detail-meta">
                        {post.description && <p className="post-detail-description">{post.description}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostDetail

