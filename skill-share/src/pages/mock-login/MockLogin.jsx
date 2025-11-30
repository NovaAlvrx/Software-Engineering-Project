import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MockLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        try {
            await axios.post('http://localhost:8000/auth/token', formData, { withCredentials: true });
            setMessage('Login successful. Redirecting...');
            navigate('/');
        } catch (error) {
            console.error('Error during login:', error);
            setMessage('Login failed. Make sure this email/password exists. Try sign up first.');
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
            {message && <p>{message}</p>}
            <p style={{ marginTop: '8px' }}>Need an account? Go to the mock sign up first.</p>
        </div>
    )
}

export default MockLogin;
