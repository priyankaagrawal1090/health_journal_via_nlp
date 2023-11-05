import React, { useState } from 'react';
import '../App.css';
import Form from 'react-bootstrap/Form';

export default function SingIn() {
    const [inputValue, setInputValue] = useState('');
    const [savedValue, setSavedValue] = useState(localStorage.getItem('savedValue') || '');
      
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
      
    const handleSaveToLocalStorage = () => {
        localStorage.setItem('savedValue', inputValue);
        setSavedValue(inputValue);
    };

    return (
        <div className="container mt-4">
            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter text..."
                    value={inputValue}
                    onChange={handleInputChange}
                />
            </div>
            <div className="form-group">
                <button className="btn btn-primary" onClick={handleSaveToLocalStorage}>
                    Save to Local Storage
                </button>
            </div>
            <div className="form-group">
                <p>Saved Value in Local Storage: {savedValue}</p>
            </div>
            <h1>Sign In from Component</h1>
        </div>
        
        
    )
}