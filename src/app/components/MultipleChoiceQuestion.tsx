import { Radio, Space } from "antd";
import { useState } from "react";
import { MultipleChoiceQuestion } from "@/app/data/quotes";

interface Props {
  question: MultipleChoiceQuestion;
}

export default function MultipleChoiceQuestionComponent({ question }: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <Radio.Group
        onChange={(e) => setSelectedOption(e.target.value)}
        value={selectedOption}
      >
        <Space direction="vertical">
          <Radio value="a">{question.options.a}</Radio>
          <Radio value="b">{question.options.b}</Radio>
          <Radio value="c">{question.options.c}</Radio>
          <Radio value="d">{question.options.d}</Radio>
        </Space>
      </Radio.Group>
    </div>
  );
}
