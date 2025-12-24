import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

const Home = () => {
  const logout = () => {
    Cookies.remove("access_token");
    window.location.href = "/login";
  };

  return (
    <div>
      <h1>Home (Protected)</h1>
      {/* <NavLink to="/library">Library</NavLink> */}
      <Button variant="outline" onClick={logout}>
        Logout
      </Button>
    </div>
  );
};

export default Home;
