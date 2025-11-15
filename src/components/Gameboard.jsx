
export default function Gameboard({ currentGuess, submissions }) {
  return (
    <section className="mb-10 flex flex-col items-center gap-2">
      {Array.from({ length: 6 }, (_, rowIndex) => {
        let rowData;
        if (rowIndex < submissions.length){
          rowData = submissions[rowIndex];
        }else if(rowIndex === submissions.length){
          rowData = currentGuess.map(letter => ({letter: letter, color: "bg-black"}));
        }else{
          rowData = [];
        }

        return (
          <div key={rowIndex} className="flex flex-row gap-1">
            {Array.from({ length: 6 }, (_, colIndex) => {
              const object = rowData[colIndex];
              const letter = object?.letter || '';
              const color = object?.color || '';

              return (
                <div key={colIndex} className={`box-letter ${color}`}>
                  {letter}
                </div>
              )
            })}
          </div>
        )
      })}
    </section>
  )
}
