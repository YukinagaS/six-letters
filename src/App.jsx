import { useState, useEffect } from 'react'
import Gameboard from "./components/Gameboard"
import Keyboard from "./components/Keyboard"

export default function App() {
  const [answer, setAnswer] = useState("ANSWER".split(""))
  const [currentGuess, setCurrentGuess] = useState([])
  const [submissions, setSubmissions] = useState([])

  function addGuessedLetter(letter) {
    if(currentGuess.length < 6){
      setCurrentGuess(prev => [...prev, letter])
    }
  }

  function removeGuessedLetter() {
    setCurrentGuess(prev => prev.slice(0, -1))
  }

  function submitGuess() {
    if(currentGuess.length === 6){
      setSubmissions(prev => [...prev, currentGuess.join("")])
      setCurrentGuess([])
    }
  }

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
  });

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
        />
      </main>

      <footer className="py-4">
        <p className="font-light text-xs sm:text-sm">© Yukinaga Heavy Industries, Inc.</p>
      </footer>

    </div>
  )
}
