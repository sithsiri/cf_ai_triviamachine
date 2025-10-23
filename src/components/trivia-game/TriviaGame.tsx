import React, { useState } from "react";

type TriviaQuestion = {
  question: string;
  incorrect: string[];
  correct: string;
};

type TriviaSet = {
  questions: TriviaQuestion[];
};

export function TriviaGame({ data }: { data: TriviaSet }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const q = data.questions[currentIndex];
  if (!q) return null;

  const choices = React.useMemo(() => {
    const arr = [q.correct, ...q.incorrect];
    return arr.sort(() => Math.random() - 0.5);
  }, [q]);

  function submitChoice(choice: string) {
    if (showAnswer) return;
    setSelected(choice);
    const correct = choice === q.correct;
    if (correct) setScore((s) => s + 1);
    setShowAnswer(true);
  }

  function next() {
    setSelected(null);
    setShowAnswer(false);
    if (currentIndex < data.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }

  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-md border border-neutral-200 dark:border-neutral-800">
      <div className="mb-2 text-sm text-muted-foreground">
        Question {currentIndex + 1} / {data.questions.length}
      </div>
      <h4 className="font-semibold mb-3">{q.question}</h4>

      <div className="grid gap-2">
        {choices.map((c) => {
          const isSelected = selected === c;
          const isCorrect = c === q.correct;
          const className = `p-3 rounded-md border ${isSelected ? "ring-2 ring-primary" : "border-neutral-200 dark:border-neutral-700"} ${showAnswer && isCorrect ? "bg-green-100 dark:bg-green-900" : "bg-white dark:bg-neutral-800"}`;
          return (
            <button
              key={c}
              onClick={() => submitChoice(c)}
              disabled={showAnswer}
              className={className}
            >
              <div className="text-left">{c}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          {showAnswer && (
            <div className="text-sm text-muted-foreground">
              {selected === q.correct
                ? "Correct!"
                : `Incorrect — correct answer: ${q.correct}`}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showAnswer ? (
            <button
              onClick={next}
              className="px-3 py-1 bg-primary text-primary-foreground rounded-md"
            >
              {currentIndex < data.questions.length - 1 ? "Next" : "Finish"}
            </button>
          ) : (
            <div className="text-sm text-muted-foreground">
              Select an answer above
            </div>
          )}
        </div>
      </div>

      {currentIndex === data.questions.length - 1 && showAnswer && (
        <div className="mt-3 text-sm">
          Score: {score} / {data.questions.length}
        </div>
      )}
    </div>
  );
}

export default TriviaGame;
