import Button from "../components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-red-500">Hello</h1>
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Welcome to FlashIQ
      </h1>
      <Button label="Click me" />
    </div>
  );
}
