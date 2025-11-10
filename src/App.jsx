import Gameboard from "./components/Gameboard"
import Keyboard from "./components/Keyboard"

export default function App() {
  return (
    <div className="h-screen w-screen bg-black text-white p-4 flex flex-col">
      <header className="text-center">
        <h1 className="text-4xl font-bold">Six Letters</h1>
      </header>

      <main className="flex-1 max-w-md mx-auto">
        <Gameboard />
        <Keyboard />
      </main>

      <footer className="text-center">
        <p className="font-light text-sm">© Yukinaga Heavy Industries, Inc.</p>
      </footer>

    </div>
  )
}
