import type { RadioChangeEvent } from "antd";
import React from "react";
import { Radio } from "antd";
import { VideoAudioQuestion } from "@/app/data/quotes";

export default function VideoAudioQuestionComponent({
  question,
}: {
  question: VideoAudioQuestion;
}) {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );

  const handleOptionChange = (e: RadioChangeEvent) => {
    setSelectedOption(e.target.value);
    // Automatically handle the answer selection here
    console.log(`Selected answer for question ${question.id}:`, e.target.value);
  };

  return (
    <div>
      {question.media.type === "video" && (
        <video controls width="100%">
          <source src={question.media.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {question.media.type === "audio" && (
        <audio controls>
          <source src={question.media.url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
      <h3>{question.text}</h3>
      <Radio.Group onChange={handleOptionChange} value={selectedOption}>
        {question.options.map((option: string, index: number) => (
          <Radio key={index} value={option}>
            {option}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );
}
