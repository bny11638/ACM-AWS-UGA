import { stringify } from 'querystring';
import React from 'react';
import { useState } from 'react';

export function LoginForm(){
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);

    const database = [
        {
            username:"",
            pwd:""
        }
    ];

    const errors = {
        username : "Invalid Username",
        password : "Invalid Password"
    };

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        //do whatever backend stuff
        setPasswordError(true);
        
    }

    const renderForm = (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label>Username: </label>
                        <input 
                            type="text"
                            name="username"
                            required
                        />
                        {usernameError && <div className="error">{errors.username}</div>}
                </div>
                <div className="input-container">
                    <label>Password: </label>
                        <input 
                            type="password"
                            name="password"
                            required
                        />
                        {passwordError && <div className="error">{errors.password}</div>}
                </div>   
                <div className="button-container">
                    <input type="submit" />    
                </div>  
            </form>
        </div>
    );

    return (
        <div className="app">
            <div className="login-form">
                <div className="title">Sign In</div>
                {isSubmitted ? <div>User is successfully logged in</div> : renderForm}
            </div>
        </div>

    )
}