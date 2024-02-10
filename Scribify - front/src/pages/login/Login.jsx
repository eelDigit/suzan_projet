import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import "../../assets/styles/forms/forms.css";

const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [err, setErr] = useState();
  const auth = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    setErr();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputs.email.trim() === "" || inputs.password.trim() === "") {
      return setErr("Veuillez remplir tous les champs.");
    }
    axios
      .post("http://localhost:9000/login", inputs)
      .then((res) => {
        if (res.data.token) {
          auth.login(res.data);
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          window.alert("Identifiant ou mot de passe incorrect");
        } else {
          window.alert(
            "Une erreur s'est produite. Veuillez réessayer plus tard."
          );
        }
      });
  };

  return (
    <main>
      <section className="section-style">
        <form onSubmit={handleSubmit} className="form-style">
          <h2>Connexion</h2>
          <label htmlFor="email">Email</label>
          <input
            className="form-input"
            type="email"
            name="email"
            id="email"
            onChange={handleChange}
            value={inputs.email}
            placeholder="azerty@azerty.fr"
          />
          <label htmlFor="password">Mot de passe</label>
          <input
            className="form-input"
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={inputs.password}
            placeholder="Mot de passe"
          />

          <button className="form-button">Se connecter</button>

          {err && <span>{err}</span>}
        </form>
      </section>
    </main>
  );
};

export default Login;
