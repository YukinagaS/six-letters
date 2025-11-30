import { useState, useEffect } from 'react';
import Gameboard from "./components/Gameboard";
import Keyboard from "./components/Keyboard";
import Modal from "./components/Modal";
import data from './data/data-1.json';
import legalWords from './data/legal-words.json'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function App() {
  const dayOne = 20251119;
  const lastDate = parseInt(localStorage.getItem('lastPlayDate'));
  const [today] = useState(getTodaysDate());

  //Initialize answer and variables for checking
  const todaysObject = data[today - dayOne];
  const [answer] = useState(todaysObject.word.toUpperCase().split(''));
  const [answerDefinition] = useState(todaysObject.definition);
  const answerLetterCount = {};
  answer.forEach((letter => {
    answerLetterCount[letter] = (answerLetterCount[letter] ? answerLetterCount[letter] + 1 : 1);
  }));

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
  const gameOver = (submissions.length === 6 || lastSubmission?.join('') === answer.join(''));
  const illegalWord = (currentGuess.length === 6 && !checkLegalWord());
  const [closeModal, setCloseModal] = useState(false);

  function getTodaysDate() {
    const date = new Date();
    return (date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate());
  };

  function addGuessedLetter(letter) {
    if(currentGuess.length < 6){
      setCurrentGuess(prev => [...prev, letter])
    }
  };

  function removeGuessedLetter() {
    setCurrentGuess(prev => prev.slice(0, -1))
  };

  function checkGuess() {
    // Subtract correct(green) guesses to account for remaining yellows.
    const remainingPresent = structuredClone(answerLetterCount);
    currentGuess.forEach((letter, i) => {
      if (answer[i] === letter) remainingPresent[letter]--;
    })
    const toAddCorrect = new Set();
    const toAddPresent = new Set();
    const toDeletePresent = new Set();
    const toAddAbsent = new Set();

    const result = currentGuess.map((letter, i) => {
      if(answer[i] === letter) { // If correct, green. Always.
        toDeletePresent.add(letter);
        toAddCorrect.add(letter);
        return {letter: letter, color: "bg-correct"};
      } else  if (remainingPresent[letter] > 0) { // Check if remaining yellows can apply.
        if (!usedLetters.correct.has(letter) && !usedLetters.present.has(letter)){
          toAddPresent.add(letter);
        };
        remainingPresent[letter]--;
        return {letter: letter, color: "bg-present"};
      } else {
        toAddAbsent.add(letter);
        return {letter: letter, color: "bg-absent"};
      }
    });

    setUsedLetters(prev => {
      return {
        correct: prev.correct.union(toAddCorrect),
        present: prev.present.difference(toDeletePresent).union(toAddPresent),
        absent: prev.absent.union(toAddAbsent)
      }
    });

    return result
  };

  function checkLegalWord() {
    const joinedGuess = currentGuess.join('').toLowerCase();
    return legalWords.some((word) => word === joinedGuess)
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
          SIXTER
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

        <Keyboard
          gameOver={gameOver}
          addGuessedLetter={addGuessedLetter}
          removeGuessedLetter={removeGuessedLetter}
          submitGuess={submitGuess}
          usedLetters={usedLetters}
        />

        <Modal
        gameOver={gameOver}
        closeModal={closeModal}
        setCloseModal={setCloseModal}
        answer={answer}
        answerDefinition={answerDefinition}
        lastSubmission={lastSubmission}
        />
      </main>

      <footer className="py-4">
        <p className="font-light text-xs sm:text-sm">© Yukinaga Heavy Industries, Inc.</p>
      </footer>

    </div>
  )
}
