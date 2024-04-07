import React, { useState } from 'react';
import '../App.css'

export default function AuthForm(props) {
    const [User, setUser] = useState('');
    const [Password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return(
        <div className="container">
            <div className='auth-form'>
                <form onSubmit={handleSubmit}>
                    <label for='user'>
                        Username:
                        <input value={User} onChange={(e) => setUser(e.target.value)} type='user'></input>
                    </label>
                    <label for='password'>
                        Password:
                        <input value={Password} onChange={(e) => setPassword(e.target.value)} type='password'></input>
                    </label>
                </form>
                <button onClick={props.onFormSwitch}>Sign In</button>
                <button onClick={props.onFormSwitch}>Don't have an account? Register here</button>
            </div>
        </div>
    )
}