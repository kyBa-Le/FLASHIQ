import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";
import { Label } from "@radix-ui/react-label";

const Home = () => {
  const { logout } = useAuthStore();

  return (
    <div>
      <h1>Home (Protected)</h1>
      <Button variant="outline" onClick={logout}>
        Logout
      </Button>
      <Label htmlFor="sample-input" className="block mb-2 mt-4">
        Sample Input
      </Label>
      <Input placeholder="Sample Input" />
    </div>
  );
};

export default Home;
