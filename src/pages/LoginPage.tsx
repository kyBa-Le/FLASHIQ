import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

const Login = () => {
  const login = () => {
    Cookies.set("access_token", "fake-token");
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col bg-red-500">
      <h1>Login</h1>
      <Button variant="outline" onClick={login}>
        Login
      </Button>
    </div>
  );
};

export default Login;
