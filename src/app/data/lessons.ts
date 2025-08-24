// app/data/lessons.ts
export type Media = {
  url: string;
  type: "image" | "gif" | "audio" | "video" | "file";
} | null;

export type Card = {
  id: string;
  word: string;
  meaning: string;
  vi?: string;
  example?: string;
  media?: Media;
  lang?: string;
};

export type Lesson = {
  id: string;
  title: string;
  description?: string;
  cards: Card[];
};

/**
 * Example lessons (UI-only). Edit / extend these for your app.
 * Put your static media files under /public/media (e.g. /public/media/apple.jpg).
 */
export const LESSONS: Lesson[] = [
  {
    id: "lesson-en-1",
    title: "English — Fruits",
    description: "Basic fruit vocabulary (beginner)",
    cards: [
      {
        id: "en-apple",
        word: "Apple",
        meaning: "A round fruit",
        vi: "Quả táo",
        example: "I eat an apple every morning.",
        media: { url: "/media/apple.jpg", type: "image" },
        lang: "en",
      },
      {
        id: "en-orange",
        word: "Orange",
        meaning: "A citrus fruit",
        vi: "Quả cam",
        example: "She peeled an orange.",
        media: { url: "/media/orange.jpg", type: "image" },
        lang: "en",
      },
    ],
  },

  {
    id: "lesson-zh-1",
    title: "Chinese — Greetings",
    description: "Common greetings in Mandarin",
    cards: [
      {
        id: "zh-hello",
        word: "你好",
        meaning: "Hello",
        vi: "Xin chào",
        example: "你好！很高兴见到你。",
        media: null,
        lang: "zh",
      },
      {
        id: "zh-thanks",
        word: "谢谢",
        meaning: "Thank you",
        vi: "Cảm ơn",
        example: "谢谢你。",
        media: null,
        lang: "zh",
      },
    ],
  },

  {
    id: "lesson-ja-1",
    title: "Japanese — Courtesy",
    description: "Basic polite expressions",
    cards: [
      {
        id: "ja-thanks",
        word: "ありがとう",
        meaning: "Thank you",
        vi: "Cảm ơn",
        example: "本当にありがとう。",
        media: null,
        lang: "ja",
      },
      {
        id: "ja-sorry",
        word: "すみません",
        meaning: "Excuse me / Sorry",
        vi: "Xin lỗi",
        example: "すみません。",
        media: null,
        lang: "ja",
      },
    ],
  },
];
