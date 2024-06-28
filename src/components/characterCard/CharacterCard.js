// CharacterCard.jsx
import React from 'react';
import './characterCard.css';

const CharacterCard = ({ char, setSelectedCharacter }) => {
    return (
        <div className="character-card">
            <input
                type="radio"
                name="character"
                id={char.id}
                value={char.id}
                onChange={(e) => setSelectedCharacter(e.target.value)}
            />
            <label htmlFor={char.id}>{char.name}</label>
        </div>
    );
};

export default CharacterCard;
