import { useLocation, useNavigate, useParams } from 'react-router-dom'
import NavBar from '../components/NavBar'
import './PostDetail.css'

function PostDetail() {
    const navigate = useNavigate()
    const { username, postId } = useParams()
    const location = useLocation()
    const post = location.state?.post

    const handleBack = () => {
        const basePath = username ? `/profile/${username}` : '/profile'
        navigate(basePath)
    }

    if (!post) {
        return (
            <div className="post-detail-container">
                <NavBar />
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
            <NavBar />
            <main className="post-detail">
                <button className="back-button" onClick={handleBack}>
                    ← Back to profile
                </button>
                <div className="post-detail-content">
                    <div className="post-detail-image-wrapper">
                        <img src={post.image} alt={post.title || `Post ${post.id}`} />
                    </div>
                    <div className="post-detail-meta">
                        <h1>{post.title || `Post ${post.id}`}</h1>
                        {post.description && <p className="post-detail-description">{post.description}</p>}
                        {post.tags?.length ? (
                            <div className="post-detail-tags">
                                {post.tags.map((tag, index) => (
                                    <span className="post-tag" key={`${tag}-${index}`}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default PostDetail

