import { FaUser, FaLock } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorSenha, setErrorSenha] = useState("");
  const [alerta, setAlerta] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();

    // limpar erros
    setErrorEmail("");
    setErrorSenha("");
    setAlerta("");

    try {
      const response = await fetch(
        "https://sistema-de-gerenciamento-de-notas-backend.onrender.com/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            senha: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setAlerta(data.message || "E-mail ou senha incorretos.");
        return;
      }

      setAlerta("Login bem-sucedido!");
      navigate("/App");
    } catch (error) {
      setAlerta("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className="container-login">
      <div className="Login">
        {/* Lado esquerdo */}
        <div className="login-banner">
          <img src="/img/logo.jpg" alt="Logo" className="banner-logo" />
          <p className="banner-text">
            Gestão de Notas: Seu parceiro na avaliação dos alunos.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <h1>Seja bem-vindo de volta!</h1>

          {/* EMAIL */}
          <div>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errorEmail ? "input-error" : ""}
            />
            <FaUser className="icon" />
            {errorEmail && <p className="error-message">{errorEmail}</p>}
          </div>

          {/* SENHA */}
          <div>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errorSenha ? "input-error" : ""}
            />
            <FaLock className="icon" />
            {errorSenha && <p className="error-message">{errorSenha}</p>}
          </div>

          {alerta && <p className="error-message">{alerta}</p>}
          <button type="submit" className="btn-login">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
