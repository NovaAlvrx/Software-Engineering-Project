import './MockSignUp.css'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function MockSignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 

    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const formData = new FormData();
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('email', email);
        formData.append('password', password);

        try {
            const response = await axios.post('http://localhost:8000/auth/sign-up', formData)
            .then(() => navigate('/'));
            console.log('Sign-up successful:', response.data);

        } catch (error) {
            // send to 404 page or show error message
            console.error('Error during sign-up:', error);
        }
    }

    return (
        <div>
            <form>
                <label htmlFor="first-name">First Name: </label>
                <input 
                    type="text" 
                    id="first-name" 
                    name="first-name" 
                    onChange={(e) => setFirstName(e.target.value)}
                    required />
                <label htmlFor="last-name">Last Name: </label>
                <input 
                    type="text" 
                    id="last-name" 
                    name="last-name" 
                    onChange={(e) => setLastName(e.target.value)}
                    required />
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
                <label htmlFor='confirm-password'>Confirm Password: </label>
                <input 
                    type='password' 
                    id='confirm-password' 
                    name='confirm-password' 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required />
                <button type='submit' onClick={onSubmit}>Sign Up</button>
            </form>
        </div>
    )
}

export default MockSignUp;