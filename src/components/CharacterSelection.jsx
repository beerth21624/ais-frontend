import React from 'react'

const CharacterSelection = () => {
  return (
    <CharacterSelection>
      <Header>ทดสอบ AI หลานเอง</Header>
      <h2>เลือกตัวละคร</h2>
      {characters.map((char, index) => (
        <CharacterCard
          key={index}
          onClick={() => handleCharacterSelect(char._id)}
          selected={selectedCharacter === char._id}
        >
          <input
            type="radio"
            name="character"
            id={char._id}
            value={char._id}
            checked={selectedCharacter === char._id}
            onChange={() => handleCharacterSelect(char._id)}
          />
          <img src={char.image_url} alt={char.name} />
          <label htmlFor={char._id}>{char.name}</label>
        </CharacterCard>
      ))}
    </CharacterSelection>
  );
}

export default CharacterSelection