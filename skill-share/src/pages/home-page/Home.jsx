import './Home.css'
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Post from '../../components/post/Post.jsx'
import { UserContext } from '../../context/UserContext.jsx';

function Home() {
    const [showPosts, setShowPosts] = useState([]);
    const [maxDaysLimit, setMaxDaysLimit] = useState(7);
    const user = useContext(UserContext);

    console.log('Home Page - userId from context:', user.id);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/home/posts', {
                    params: { days: maxDaysLimit, userId: user.id },
                    withCredentials: true,
                });

                const data = response.data;

                if (data.posts.length === 0) {
                    setMaxDaysLimit(prev => prev + 7)
                }

                // Expecting [{}, {}, ...]
                if (Array.isArray(data.posts)) {
                    const normalized = data.posts.map((p) => ({
                        postId: p.postId ?? null,
                        userId: p.userId ?? null,
                        description: p.description ?? '',
                        img: p.img ?? '',
                        // normalize createdAt -> created_date string (date only)
                        created_date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : (p.created_date ?? ''),
                        // keep original for debugging if needed
                        _raw: p,
                        likeCount: p.likeCount ?? 0, 
                        likedByUser: p.likedByUser ?? false
                    }));

                    setShowPosts(normalized);
                    console.log('Fetched posts:', normalized);
                } else {
                    console.warn('Unexpected posts payload', data);
                    setShowPosts([]);
                }
            } catch (error) {
                console.error('Error occured loading posts: ', error)
            }
        }

        fetchPosts();
    }, [maxDaysLimit])

    return(
        <div className="Home">
            {showPosts.map((post) => (
                <Post key={post.postId} post_details={post} />
            ))}
        </div>
    )
}

export default Home;
