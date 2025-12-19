import Cookies from "js-cookie";

const Home = () => {
  const logout = () => {
    Cookies.remove("access_token");
    window.location.href = "/login";
  };

  return (
    <div>
      <h1>Home (Protected)</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Home;
