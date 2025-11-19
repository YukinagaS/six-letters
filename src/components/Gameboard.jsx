export default function Gameboard({ illegalWord, currentGuess, submissions }) {
  return (
    <section className="flex flex-col items-center gap-2">
      {Array.from({ length: 7 }, (_, rowIndex) => {
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
                  <span className={illegalWord ? "text-red-600" : "text-white"}>{letter}</span>
                </div>
              )
            })}
          </div>
        )
      })}
    </section>
  )
}
