import { nanoid } from 'nanoid'

export default function Gameboard() {


  return (
    <section className="mb-10 flex flex-col items-center gap-2">
      {Array.from({ length: 6 }, () => (
        <div key={nanoid} className="flex flex-row gap-1">
          {Array.from({ length: 6 }, () => (
            <div key={nanoid} className="box-empty"></div>
          ))}
        </div>
      ))}
    </section>
  )
}
