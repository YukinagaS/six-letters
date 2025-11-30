import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP);

export default function Gameboard({ gameOver,illegalWord, currentGuess, submissions, lastSubmission, answer }) {

  const activeRow = useRef();
  const prevRow = useRef();
  const tl = useRef();

  // Red bumper animation function
  useGSAP(() => {
    if (illegalWord) {
      tl.current = gsap
        .timeline({repeat: 1})
        .to(activeRow.current, { x: 15, duration: 0.03, repeat: 1, yoyo: true})
        .to(activeRow.current, { x: -15, duration: 0.03, repeat: 1, yoyo: true})
    }
  }, { dependencies: [illegalWord] });

  // Winning wave animation
  useGSAP(() => {
    if (lastSubmission?.join('') === answer.join('')) {
      const targets = gsap.utils.toArray(".box-letter");
      tl.current = gsap
        .timeline({repeat: -1})
        .to(targets, {
          y: -15,
          duration: 0.25,
          stagger: {
            each: 0.1,
            yoyo: true,
            repeat: 1
          }
        });
    };
  }, {dependencies: [gameOver], scope: prevRow});

  // For targeting animations
  function labelRows(rowIndex) {
    if (rowIndex === submissions.length) {
      return activeRow
    } else if ( rowIndex === submissions.length - 1) {
      return prevRow
    } else {
      return null
    }
  };

  return (
    <section className="flex flex-col items-center gap-2">
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
          <div key={rowIndex} ref={labelRows(rowIndex)} className="flex flex-row gap-1">
            {Array.from({ length: 6 }, (_, colIndex) => {
              const object = rowData[colIndex];
              const letter = object?.letter || '';
              const color = object?.color || '';

              return (
                <div key={colIndex} className={`box-letter ${color}`}>
                  <span className={illegalWord && rowIndex === submissions.length ? "text-red-600" : "text-white"}>{letter}</span>
                </div>
              )
            })}
          </div>
        )
      })}
    </section>
  )
}
