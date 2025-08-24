"use client";

import { useParams } from "next/navigation";
import { QUOTES } from "@/app/data/quotes";
import { App, Button, notification } from "antd";
import { useEffect, useState } from "react";
import DragAndDropQuestionComponent from "@/app/components/DragAndDropQuestion";
import MultipleChoiceQuestionComponent from "@/app/components/MultipleChoiceQuestion";
import FillInTheBlankQuestionComponent from "@/app/components/FillInTheBlankQuestion";
import TextAnswerQuestionComponent from "@/app/components/TextAnswerQuestion";
import MessageGlobal, { message } from "@/app/components/MessageGlobal";

export default function ExamPage() {
  const params = useParams();
  const lessonId = params?.lessonId as string | undefined;
  const examId = params?.examId as string | undefined;

  const lesson = QUOTES.find((l) => l.id === lessonId);
  const exam = lesson?.exams.find((e) => e.id === examId);

  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    // Simulate fetching time from an API
    const fetchTime = async () => {
      const fakeApiResponse = await new Promise<number>(
        (resolve) => setTimeout(() => resolve(600), 1000) // Simulate 1-second API delay
      );
      setTimeLeft(fakeApiResponse);
    };

    fetchTime();

    // Start the countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          notification.error({
            message: "Time's up!",
            description: "The test will now end.",
            placement: "topRight",
          });
          // Add logic to submit the test or end it here
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSubmit = () => {
    console.log("Submitted answers:", {});
    message.success({
      content: "Submission Successful",
      duration: 2,
    });
  };

  if (!lesson || !exam) {
    return (
      <div className="py-12">
        <h2 className="text-xl font-semibold">Exam not found</h2>
        <div className="mt-4">
          <Button onClick={() => history.back()}>Back</Button>
        </div>
      </div>
    );
  }

  return (
    <App>
      <MessageGlobal />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{exam.title}</h1>
          <div className="text-sm text-gray-500">
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>

        <div className="space-y-8">
          {exam.questions.map((question, idx) => (
            <div key={question.id} className="space-y-4">
              <h2 className="text-lg font-medium">
                {idx + 1}.{" "}
                {question.type === "drag-and-drop"
                  ? "Drag the correct words into the blanks"
                  : question.text}
              </h2>
              {question.type === "multiple-choice" && (
                <MultipleChoiceQuestionComponent question={question} />
              )}
              {question.type === "fill-in-the-blank" && (
                <FillInTheBlankQuestionComponent question={question} />
              )}
              {question.type === "drag-and-drop" && (
                <DragAndDropQuestionComponent question={question} />
              )}
              {question.type === "text-answer" && (
                <TextAnswerQuestionComponent question={question} />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Button onClick={() => history.back()}>Back</Button>
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </App>
  );
}
