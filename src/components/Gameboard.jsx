
export default function Gameboard({ currentGuess, submissions }) {
  return (
    <section className="mb-10 flex flex-col items-center gap-2">
      {Array.from({ length: 6 }, (_, rowIndex) => {
        let rowLetters;
        if (rowIndex < submissions.length){
          rowLetters = submissions[rowIndex].split('');
        }else if(rowIndex === submissions.length){
          rowLetters = currentGuess;
        }else{
          rowLetters = [];
        }

        return (
          <div key={rowIndex} className="flex flex-row gap-1">
            {Array.from({ length: 6 }, (_, colIndex) => (
              <div key={colIndex} className="box-letter">
                {rowLetters[colIndex] || ''}
              </div>
            ))}
          </div>
        )
      })}
    </section>
  )
}
