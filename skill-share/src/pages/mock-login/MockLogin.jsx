import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function MockLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        try {
            const response = await axios.post('http://localhost:8000/auth/token', formData, { withCredentials: true})
            localStorage.setItem('access_token', response.data.access_token);
            navigate('/');
            console.log('Login successful');
        } catch (error) {
            console.error('Error during login:', error);
        }
         
    }

    return (
        <div>
            <form>
                <label htmlFor='email'>Email: </label>
                <input 
                    type='email' 
                    id='email' 
                    name='email' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />
                <label htmlFor='password'>Password: </label>
                <input 
                    type='password' 
                    id='password' 
                    name='password' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                <button type='submit' onClick={onSubmit}>Login</button>
            </form>
        </div>
    )
}

export default MockLogin;