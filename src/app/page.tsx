// app/page.tsx
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <h1 className="text-3xl font-bold">Welcome to EngLearn</h1>
      <p className="text-gray-600 max-w-xl text-center">
        Start with flashcards, daily quotes and quick exercises. Use the sidebar
        to navigate.
      </p>
    </div>
  );
}
