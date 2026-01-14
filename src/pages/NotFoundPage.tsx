import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/library");
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 flex-col gap-6">
      <h1 className="text-4xl font-bold text-gray-800">Not Found</h1>
      <div>
        <Button onClick={handleBack}>Back to FlashIQ</Button>
      </div>
    </div>
  );
}
