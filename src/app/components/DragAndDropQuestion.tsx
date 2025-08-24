import { useState } from "react";
import { DragAndDropQuestion } from "@/app/data/quotes";

interface Props {
  question: DragAndDropQuestion;
}

export default function DragAndDropQuestionComponent({ question }: Props) {
  const [blanks, setBlanks] = useState<Record<number, string>>({});

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    blankIndex: number | null
  ) => {
    e.preventDefault();
    const word = e.dataTransfer.getData("text");

    if (blankIndex !== null) {
      // Drop vào ô trống
      setBlanks((prev) => ({ ...prev, [blankIndex]: word }));
    } else {
      // Drop trở lại word bank
      setBlanks((prev) => {
        const updatedBlanks = { ...prev };
        const blankIndexToRemove = Object.keys(updatedBlanks).find(
          (key) => updatedBlanks[Number(key)] === word
        );
        if (blankIndexToRemove) {
          delete updatedBlanks[Number(blankIndexToRemove)];
        }
        return updatedBlanks;
      });
    }
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

  const renderTextWithBlanks = () => {
    const parts = question.text.split(" ");
    let blankIndex = 0;

    return parts.map((word, index) => {
      if (word === "___") {
        const currentIndex = blankIndex;
        blankIndex++;
        return (
          <div
            key={index}
            onDrop={(e) => handleDrop(e, currentIndex)}
            onDragOver={handleDragOver}
            className="inline-block w-32 h-8 border-b-2 border-dashed border-gray-400 text-center mx-1"
          >
            {blanks[currentIndex] && (
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, blanks[currentIndex])}
                className="inline-block px-2 py-1 bg-gray-200 rounded cursor-pointer"
              >
                {blanks[currentIndex]}
              </div>
            )}
          </div>
        );
      }
      return (
        <span key={index} className="mx-1">
          {word}
        </span>
      );
    });
  };

  const renderWordBank = () => {
    const usedWords = Object.values(blanks);
    return question.wordBank
      .filter((word) => !usedWords.includes(word))
      .map((word) => (
        <div
          key={word}
          draggable
          onDragStart={(e) => handleDragStart(e, word)}
          className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
        >
          {word}
        </div>
      ));
  };

  return (
    <div className="space-y-4">
      <div className="text-lg flex flex-wrap items-center">
        {renderTextWithBlanks()}
      </div>

      <div
        className="flex gap-4 mt-4"
        onDrop={(e) => handleDrop(e, null)}
        onDragOver={handleDragOver}
      >
        {renderWordBank()}
      </div>
    </div>
  );
}
