import Google from "../img/google.png";


const Login = () => {
  const google = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  return (
    <div className="login">
      
      <div className="wrapper">
        <div className="left">
        <div className="loginTitle"><h1>Logowanie pracownika</h1></div>
          <div className="loginButton google" onClick={google}>
            
            <img src={Google} alt="" className="icon" />
            Google
          </div>    
        </div>
        <div className="center">
          <div className="line" />  
        </div>
        <div className="right">
          <div className="loginTitle"><h1>Logowanie administratora</h1></div>
          <input type="text" placeholder="Username" />
          <input type="text" placeholder="Password" />
          <button className="submit">Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;