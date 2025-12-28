import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function UpcomingPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div>
        <Button onClick={handleBack}> Back</Button>
      </div>
      <h1 className="text-4xl font-bold text-gray-800">Upcoming Page</h1>
    </div>
  );
}
