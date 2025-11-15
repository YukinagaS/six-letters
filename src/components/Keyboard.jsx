import keys from '../data/ENG_keyboard'

export default function Keyboard({ addGuessedLetter, removeGuessedLetter, submitGuess }) {
  const kbRows = keys.map((row, rowIndex) => {
    return (
      <div key={rowIndex} className="flex flex-row gap-1">
        {row.map((key, keyIndex) => {
          if(key !== "ENT" && key !== "DEL"){
            // Return for all letter keys
            return (
              <button
                key={keyIndex}
                className="btn-kb"
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
                className="btn-wide"
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
                className="btn-wide"
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
