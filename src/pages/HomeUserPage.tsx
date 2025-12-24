import { Button } from "@/components/ui/Button";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label";

const Home = () => {
  const logout = () => {
    Cookies.remove("access_token");
    window.location.href = "/login";
  };

  return (
    <div>
      <h1>Home (Protected)</h1>
      <Button variant="outline" onClick={logout}>Logout</Button>
      <Label htmlFor="sample-input" className="block mb-2 mt-4">Sample Input</Label>
      <Input placeholder="Sample Input" />
    </div>
  );
};

export default Home;
