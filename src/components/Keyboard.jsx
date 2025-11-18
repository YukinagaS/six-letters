import keys from '../data/ENG_keyboard';
import clsx from 'clsx';

export default function Keyboard({ gameOver, addGuessedLetter, removeGuessedLetter, submitGuess, usedLetters }) {
  const kbRows = keys.map((row, rowIndex) => {
    return (
      <div key={rowIndex} className="flex flex-row gap-1">
        {row.map((key, keyIndex) => {
          const keyColor = clsx(
            {'bg-correct': usedLetters.correct.has(key)},
            {'bg-present': usedLetters.present.has(key)},
            {'bg-absent': usedLetters.absent.has(key)},
            {'bg-unused': !Object.values(usedLetters).some(set => set.has(key))}
          );
          if(key !== "ENT" && key !== "DEL"){
            // Return for all letter keys
            return (
              <button
                key={keyIndex}
                className={`btn-kb ${keyColor}`}
                disabled={gameOver}
                onClick={() => addGuessedLetter(key)}
              >
                {key}
              </button>
            )
          }else if(key === "DEL"){
            // Return for "DEL" key
            return (
              <button
                key={keyIndex}
                className={`btn-wide ${keyColor}`}
                disabled={gameOver}
                onClick={() => removeGuessedLetter()}
              >
                {key}
              </button>
            )
          }else{
            // Return for "ENT" key
            return (
              <button
                key={keyIndex}
                className={`btn-wide ${keyColor}`}
                disabled={gameOver}
                onClick={() => submitGuess()}
              >
                {key}
              </button>
            )
          }
        })}
      </div>
    )
  });

  return (
    <section className="mb-6 flex flex-col items-center gap-1">
      {kbRows}
    </section>
  )
}
