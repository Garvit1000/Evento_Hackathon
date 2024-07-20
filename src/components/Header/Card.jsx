import React, { useState, useEffect } from 'react';
import './Card.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Card = ({ title, description, imgSrc, link }) => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, [auth]);

    const handleClick = () => {
        if (user) {
            navigate(link);
        } else {
            alert('Please login to access this feature.');
            
        }
    };

    return (
        <div className="card" onClick={handleClick}>
            <img src={imgSrc} alt={title} />
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

export default Card;
