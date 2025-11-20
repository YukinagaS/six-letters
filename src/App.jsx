import { useState, useEffect, useRef } from 'react';
import Gameboard from "./components/Gameboard";
import Keyboard from "./components/Keyboard";
import data from './data/words_defs_pos.json';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function App() {
  const dayOne = "20251119";
  const lastDate = localStorage.getItem('lastPlayDate');
  const [today] = useState(getTodaysDate());
  const [answer] = useState(getTodaysWord());
  const [currentGuess, setCurrentGuess] = useState([]);
  const [submissions, setSubmissions] = useState(() => {
    const save = (lastDate === today) ? localStorage.getItem('submissions') : null;
    return save ? JSON.parse(save) : [];
  });
  const [usedLetters, setUsedLetters] = useState(() => {
    const save = (lastDate === today) ? localStorage.getItem('usedLetters') : null;
    return save ? restoreUsedLettersFromSave(save) : {'correct': new Set(),'present': new Set(),'absent': new Set()};
  });

  const lastSubmission = submissions[submissions.length - 1]?.map((obj) => obj.letter);
  const gameOver = (submissions.length === 7 || lastSubmission?.join('') === answer.join(''));
  const illegalWord = (currentGuess.length === 6 && !checkLegalWord());

  // GSAP animation for Definition
  const definitionAnimRef = useRef();
  useGSAP(() => {
    gsap.fromTo(definitionAnimRef.current, {opacity: 0}, {opacity: 1})
  }, { dependencies: [gameOver] });

  function getTodaysDate() {
    const date = new Date()
    return `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
  }

  function getTodaysWord() {
    const todaysObject = data[today - dayOne]
    return todaysObject.word.toUpperCase().split('')
  }

  function addGuessedLetter(letter) {
    if(currentGuess.length < 6){
      setCurrentGuess(prev => [...prev, letter])
    }
  };

  function removeGuessedLetter() {
    setCurrentGuess(prev => prev.slice(0, -1))
  };

  function checkGuess() {
    // Count the instances of each letter in the answer
    const answerLetterCount = {}
    answer.forEach((letter) => answerLetterCount[letter] = answer.filter(moji => moji === letter).length)

    // Subtract correct(green) guesses to account for remaining yellows.
    const remainingPresent = answerLetterCount;
    currentGuess.forEach((letter, i) => {
      (answer[i] === letter) && remainingPresent[letter]--;
    })
    const toAddCorrect = new Set();
    const toAddPresent = new Set();
    const toDeletePresent = new Set();
    const toAddAbsent = new Set();

    const result = currentGuess.map((letter, i) => {
      if(answer[i] === letter) { // If correct, green. Always.
        if (usedLetters.present.has(letter)){
          toDeletePresent.add(letter);
          toAddCorrect.add(letter)
        } else if (!usedLetters.correct.has(letter)){
          toAddCorrect.add(letter);
        }
        return {letter: letter, color: "bg-correct"};
      } else  if (remainingPresent[letter] > 0) { // Check if remaining yellows can apply.
        if (!usedLetters.correct.has(letter) && !usedLetters.present.has(letter)){
          toAddPresent.add(letter);
        };
        remainingPresent[letter]--;
        return {letter: letter, color: "bg-present"};
      } else {
        if (!usedLetters.absent.has(letter)){
          toAddAbsent.add(letter);
        }
        return {letter: letter, color: "bg-absent"};
      }
    });

    setUsedLetters(prev => {
      const newCorrect = prev.correct;
      const newPresent = prev.present;
      const newAbsent = prev.absent;

      toAddCorrect.forEach(letter => newCorrect.add(letter))
      toAddPresent.forEach(letter => newPresent.add(letter))
      toDeletePresent.forEach(letter => newPresent.delete(letter))
      toAddAbsent.forEach(letter => newAbsent.add(letter))

      return {
        correct: newCorrect,
        present: newPresent,
        absent: newAbsent
      }
    });

    return result
  };

  function checkLegalWord() {
    return data.some((obj) => obj.word === currentGuess.join('').toLowerCase())
  }

  function submitGuess() {
    if(currentGuess.length === 6 && checkLegalWord()){
      const checkedGuess = checkGuess();
      setCurrentGuess([]);
      setSubmissions(prev => [...prev, checkedGuess]);
    }
  };

  function convertUsedLettersForSave() {
    return {
      'correct': Array.from(usedLetters.correct),
      'present': Array.from(usedLetters.present),
      'absent': Array.from(usedLetters.absent)
    }
  }

  function restoreUsedLettersFromSave(save) {
    const buildObject = JSON.parse(save);
    return {
      "correct": new Set(Array.from(buildObject.correct)),
      "present": new Set(Array.from(buildObject.present)),
      "absent": new Set(Array.from(buildObject.absent))
    }
  }

  // Listen for keyboard and reset listener
  useEffect(() => {
    function handleKeyPress(event) {
      const key = event.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        addGuessedLetter(key);
      } else if (key === 'BACKSPACE' || key === 'DELETE') {
        removeGuessedLetter();
      } else if (key === 'ENTER'){
        submitGuess();
      }
    }
    gameOver ? null : window.addEventListener('keyup', handleKeyPress);
    return () => {
      window.removeEventListener('keyup', handleKeyPress);
    };
  }, [currentGuess, submissions]);

  useEffect(() => {
    localStorage.setItem('lastPlayDate', today)
    localStorage.setItem('submissions', JSON.stringify(submissions));
    localStorage.setItem('usedLetters', JSON.stringify(convertUsedLettersForSave()));
  }, [submissions, usedLetters]);

  return (
    <div className="min-h-screen w-full bg-black text-white text-center flex flex-col">
      <header className="py-5">
        <h1 className="text-4xl sm:text-5xl font-black tracking-widest">
          { gameOver ? `${answer.join('')}` : 'SIXTER'}
        </h1>
      </header>

      <main className="flex-1 w-full flex flex-col items-center gap-6">
        <Gameboard
          gameOver={gameOver}
          illegalWord={illegalWord}
          currentGuess={currentGuess}
          submissions={submissions}
          lastSubmission={lastSubmission}
          answer={answer}
          />

          <section ref={definitionAnimRef} className="w-sm">
            { gameOver &&
            <>
              <h3 className="text-xl sm:text-2xl">DEFINITION</h3>
              <p className="font-light text-sm sm:text-lg">{data[today - dayOne].definition}.</p>
            </>
            }
          </section>

        <Keyboard
          gameOver={gameOver}
          addGuessedLetter={addGuessedLetter}
          removeGuessedLetter={removeGuessedLetter}
          submitGuess={submitGuess}
          usedLetters={usedLetters}
        />
      </main>

      <footer className="py-4">
        <p className="font-light text-xs sm:text-sm">© Yukinaga Heavy Industries, Inc.</p>
      </footer>

    </div>
  )
}
