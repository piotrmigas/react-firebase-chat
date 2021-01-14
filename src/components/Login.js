import { auth, provider, db } from "../firebase";

const Login = () => {
  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((res) => {
        db.ref("users").child(res.user.uid).set({
          name: res.user.displayName,
          avatar: res.user.photoURL,
        });
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="login">
      <div className="login__container">
        <img src="https://cdn.mos.cms.futurecdn.net/SDDw7CnuoUGax6x9mTo7dd.jpg" alt="" />
        <h1>Sign in to Chat</h1>
        <button
          className="ui button"
          onClick={signIn}
          style={{ marginTop: "50px", background: "#2db67e", color: "#fff" }}
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
