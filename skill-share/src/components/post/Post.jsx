import './Post.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

function Post({post_details}) {
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);

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
    });

    return (
        <div className="Post flex-column">
            <div className="flex-row-center post-top-wrapper space-between">
                <div className="flex-row-center">
                    <img src={profilePicture} alt='user-profile'/>
                    <p className="posted-by">{username}</p>
                </div>
                <p className="post-creation-text">{post_details.created_date}</p>
            </div>
            <img src={post_details.img} alt="post" className="post-img"/>
            <div className="post-bottom-wrapper">
                <div className="flex-row-start post-description-wrapper">
                    <p className="posted-by">{username}</p>
                    <p className="post-description">{post_details.description}</p>
                </div>
            </div>
        </div>
    )
}

export default Post;