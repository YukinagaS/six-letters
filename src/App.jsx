import Gameboard from "./components/Gameboard"
import Keyboard from "./components/Keyboard"

export default function App() {
  return (
    <div className="h-full w-full bg-black text-white text-center flex flex-col">
      <header className="py-5">
        <h1 className="text-5xl font-bold tracking-widest">SIXTER</h1>
      </header>

      <main className="flex-1 mx-auto">
        <Gameboard />
        <Keyboard />
      </main>

      <footer>
        <p className="font-light text-sm">© Yukinaga Heavy Industries, Inc.</p>
      </footer>

    </div>
  )
}
