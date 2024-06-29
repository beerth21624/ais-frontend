// import React from 'react';
// import { CharacterSelection, Header, CharacterCard } from '../App.styles';

// function CharacterSelection({ characters, selectedCharacter, onSelectCharacter }) {
//     return (
//         <CharacterSelection>
//             <Header>ทดสอบ AI หลานเอง</Header>
//             <h2>เลือกตัวละคร</h2>
//             {characters.map((char, index) => (
//                 <CharacterCard
//                     key={index}
//                     onClick={() => onSelectCharacter(char._id)}
//                     selected={selectedCharacter === char._id}
//                 >
//                     <input
//                         type="radio"
//                         name="character"
//                         id={char._id}
//                         value={char._id}
//                         checked={selectedCharacter === char._id}
//                         onChange={() => onSelectCharacter(char._id)}
//                     />
//                     <img src={char.image_url} alt={char.name} />
//                     <label htmlFor={char._id}>{char.name}</label>
//                 </CharacterCard>
//             ))}
//         </CharacterSelection>
//     );
// }

// export default CharacterSelection;