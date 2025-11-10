import { nanoid } from 'nanoid'
import keys from '../data/ENG_keyboard'

export default function Keyboard() {
  const topRow = keys.top.map(key =>
    <button key={nanoid()}>
      {key}
    </button>
  );
  const middleRow = keys.middle.map(key =>
    <button key={nanoid()}>
      {key}
    </button>
  );
  const bottomRow = keys.bottom.map(key =>
    <button key={nanoid()}>
      {key}
    </button>
  );

  return (
    <section className="mb-6 flex flex-col items-center">
      <div className="flex flex-row">
        {topRow}
      </div>
      <div className="flex flex-row">
        {middleRow}
      </div>
      <div className="flex flex-row">
        {bottomRow}
      </div>
    </section>
  )
}
