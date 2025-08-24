import { useState } from "react";
import { FillInTheBlankQuestion } from "@/app/data/quotes";

interface Props {
  question: FillInTheBlankQuestion;
}

export default function FillInTheBlankQuestionComponent({ question }: Props) {
  const [blanks, setBlanks] = useState<Record<number, string>>({});

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    blankIndex: number
  ) => {
    e.preventDefault();
    const word = e.dataTransfer.getData("text");
    setBlanks((prev) => ({ ...prev, [blankIndex]: word }));
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    word: string
  ) => {
    e.dataTransfer.setData("text", word);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      <p className="text-lg">
        {question.text.split(" ").map((word, index) =>
          word === "___" ? (
            <span
              key={index}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
              className="inline-block w-32 h-8 border-b-2 border-dashed border-gray-400 text-center"
            >
              {blanks[index] || ""}
            </span>
          ) : (
            <span key={index} className="mr-1">
              {word}
            </span>
          )
        )}
      </p>

      <div className="flex gap-4">
        {question.wordBank.map((word) => (
          <div
            key={word}
            draggable
            onDragStart={(e) => handleDragStart(e, word)}
            className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
}
