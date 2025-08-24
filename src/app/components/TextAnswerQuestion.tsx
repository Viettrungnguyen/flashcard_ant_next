import { useState } from "react";
import { TextAnswerQuestion } from "@/app/data/quotes";

interface Props {
  question: TextAnswerQuestion;
}

export default function TextAnswerQuestionComponent({ question }: Props) {
  const [answer, setAnswer] = useState("");

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full px-4 py-2 border rounded"
        placeholder="Type your answer here"
      />
    </div>
  );
}
