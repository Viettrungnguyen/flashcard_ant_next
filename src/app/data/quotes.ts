export type Question =
  | MultipleChoiceQuestion
  | FillInTheBlankQuestion
  | DragAndDropQuestion
  | TextAnswerQuestion;

export interface MultipleChoiceQuestion {
  id: string;
  type: "multiple-choice";
  text: string;
  options: { a: string; b: string; c: string; d: string };
  correct: keyof MultipleChoiceQuestion["options"];
}

export interface FillInTheBlankQuestion {
  id: string;
  type: "fill-in-the-blank";
  text: string;
  wordBank: string[];
  blanks: string[];
}

export interface DragAndDropQuestion {
  id: string;
  type: "drag-and-drop";
  text: string;
  wordBank: string[];
  blanks: string[];
}

export interface TextAnswerQuestion {
  id: string;
  type: "text-answer";
  text: string;
  correct: string;
}

export interface Exam {
  id: string;
  title: string;
  questions: Question[];
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  exams: Exam[];
}

export const QUOTES: Lesson[] = [
  {
    id: "lesson1",
    title: "Famous Quotes",
    description: "Learn from famous quotes.",
    exams: [
      {
        id: "exam1",
        title: "Motivational Quotes",
        questions: [
          {
            id: "q1",
            type: "multiple-choice",
            text: "Who said 'The only limit to our realization of tomorrow is our doubts of today'?",
            options: {
              a: "Albert Einstein",
              b: "Franklin D. Roosevelt",
              c: "Winston Churchill",
              d: "Theodore Roosevelt",
            },
            correct: "b",
          },
          {
            id: "q2",
            type: "multiple-choice",
            text: "Who said 'In the middle of every difficulty lies opportunity'?",
            options: {
              a: "Albert Einstein",
              b: "Isaac Newton",
              c: "Galileo Galilei",
              d: "Marie Curie",
            },
            correct: "a",
          },
        ],
      },
    ],
  },
  {
    id: "lesson2",
    title: "Fill in the Blank Example",
    description: "Practice filling in the blanks with the correct words.",
    exams: [
      {
        id: "exam1",
        title: "Drag and Drop Activity",
        questions: [
          {
            id: "q1",
            type: "fill-in-the-blank",
            text: "___ is a popular library for building user interfaces.",
            wordBank: ["React", "JavaScript", "Next.js", "TypeScript"],
            blanks: ["React"],
          },
        ],
      },
    ],
  },
  {
    id: "lesson3",
    title: "Mixed Question Types",
    description: "An exam with multiple question types.",
    exams: [
      {
        id: "exam1",
        title: "Mixed Questions",
        questions: [
          {
            id: "q1",
            type: "multiple-choice",
            text: "What is the capital of France?",
            options: {
              a: "Berlin",
              b: "Madrid",
              c: "Paris",
              d: "Rome",
            },
            correct: "c",
          },
          {
            id: "q2",
            type: "fill-in-the-blank",
            text: "___ is the largest planet in our solar system.",
            wordBank: ["Jupiter", "Mars", "Earth", "Venus"],
            blanks: ["Jupiter"],
          },
          {
            id: "q3",
            type: "drag-and-drop",
            text: "The ___ is shining and the ___ are singing.",
            wordBank: ["sun", "birds", "moon", "stars"],
            blanks: ["sun", "birds"],
          },
          {
            id: "q4",
            type: "text-answer",
            text: "Who wrote 'To Kill a Mockingbird'?",
            correct: "Harper Lee",
          },
        ],
      },
    ],
  },
];
