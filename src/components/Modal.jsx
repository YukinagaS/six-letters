export default function Modal({
  gameOver, closeModal, setCloseModal,
  answer, answerDefinition, lastSubmission
}){
  return (
    <div
      className={`
        fixed inset-0 flex items-center justify-center
        bg-black/70
        transition-opacity duration-300
        ${(gameOver && !closeModal) ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
    >
      <div
        className={`
          bg-zinc-100 rounded-md pt-6 pb-3 px-10 shadow-md max-w-sm w-90 sm:w-full
          transition-all duration-300 text-zinc-900
          ${gameOver ? "opacity-100 pointer-events-auto" : "scale-95 opacity-0"}
        `}
        role="dialog"
        aria-modal="true"
      >
        {gameOver &&
        <>
          <h3 className="text-xl font-semibold sm:text-2xl mb-3 sm:mb-8">
            {lastSubmission.join('') === answer.join('') ? "Congratulations!" : "Too bad :("}
          </h3>
          <p className="font-medium text-sm sm:text-lg mb-3">
            The answer was <span className="font-black">{answer.join('')}</span>.
          </p>
          <p className="font-normal text-xs sm:text-sm mb-6">{answerDefinition}.</p>
          <button
            className="bg-zinc-800 text-zinc-200 text-sm font-bold py-1 px-4 rounded-md"
            onClick={() => setCloseModal(true)}
          >
            CLOSE
          </button>
        </>
        }
      </div>
    </div>
  );
}
