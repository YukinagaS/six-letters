import { useState, useEffect } from 'react';
import Gameboard from "./components/Gameboard";
import Keyboard from "./components/Keyboard";

export default function App() {
  const [answer, setAnswer] = useState("BANANA".split(""));
  const [currentGuess, setCurrentGuess] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [usedLetters, setUsedLetters] = useState({
    'correct': new Set(),
    'present': new Set(),
    'absent': new Set()
  });

  useEffect(() => {
    console.log(Object.values(usedLetters));
  }, [usedLetters]);

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

  function submitGuess() {
    if(currentGuess.length === 6){
      const checkedGuess = checkGuess()
      setSubmissions(prev => [...prev, checkedGuess])
      setCurrentGuess([])
    }
  };

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
    window.addEventListener('keyup', handleKeyPress);
    return () => {
      window.removeEventListener('keyup', handleKeyPress);
    };
  }, [currentGuess, submissions]);

  return (
    <div className="min-h-screen w-full bg-black text-white text-center flex flex-col">
      <header className="py-5">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-widest">SIXTER</h1>
      </header>

      <main className="flex-1 w-full flex flex-col items-center">
        <Gameboard
          currentGuess={currentGuess}
          submissions={submissions}
        />
        <Keyboard
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
