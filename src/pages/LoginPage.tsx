import Cookies from "js-cookie";

const Login = () => {
  const login = () => {
    Cookies.set("access_token", "fake-token");
    window.location.href = "/";
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={login}>Login</button>
    </div>
  );
};

export default Login;
