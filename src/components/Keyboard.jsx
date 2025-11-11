import { nanoid } from 'nanoid'
import keys from '../data/ENG_keyboard'

export default function Keyboard() {
  const topRow = keys.top.map(key =>
    <button key={nanoid()} className="btn-kb">
      {key}
    </button>
  );
  const middleRow = keys.middle.map(key =>
    <button key={nanoid()} className="btn-kb">
      {key}
    </button>
  );
  const bottomRow = keys.bottom.map(key => {
    if(key === "ENT" || key === "DEL"){
      return (<button key={nanoid()} className="btn-wide">
        {key}
      </button>)
    }else{
      return (<button key={nanoid()} className="btn-kb">
        {key}
      </button>)
    }
  });

  return (
    <section className="mb-6 flex flex-col items-center gap-1">
      <div className="flex flex-row gap-1">
        {topRow}
      </div>
      <div className="flex flex-row gap-1">
        {middleRow}
      </div>
      <div className="flex flex-row gap-1">
        {bottomRow}
      </div>
    </section>
  )
}
