/* @react-refresh */

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { RiMenu3Fill } from "react-icons/ri";
import { HiUser } from "react-icons/hi2";
import { GrClose } from "react-icons/gr";
import { IoSearchOutline } from "react-icons/io5";
import { GrLogout } from "react-icons/gr";

import Logo from "../../assets/images/logo/logo.png";

import "../../assets/styles/header/header.css";

const Header = () => {
  const [toggle, setToggle] = useState(true);
  const [searchActive, setSearchActive] = useState(false);

  const handleClick = () => {
    setToggle(!toggle);
  };

  const handleSearchClick = () => {
    setSearchActive(!searchActive);
  };

  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };

  return (
    <header>
      <img src={Logo} alt="logo" className="h-logo" />

      <button onClick={handleClick} className="navbar_burger">
        {toggle ? <RiMenu3Fill /> : <GrClose />}
      </button>

      <nav
        style={{ display: toggle ? "none" : "block" }}
        className="navbar_first"
      >
        <ul>
          <li>
            <NavLink to="/publier" className="navbar_link">
              Publier
            </NavLink>
          </li>

          <li>
            <p className="text"> Discover </p>
            <ul>
              <li>
                <NavLink to="/a-propos" className="navbar_link">
                  A propos
                </NavLink>
              </li>

              <li>
                <NavLink to="/auteurs" className="navbar_link">
                  Auteurs
                </NavLink>
              </li>

              <li>
                <NavLink to="/lecteurs" className="navbar_link">
                  Lecteurs
                </NavLink>
              </li>

              <li>
                <NavLink to="/livres" className="navbar_link">
                  Livres
                </NavLink>
              </li>

              <li>
                <NavLink to="/categories" className="navbar_link">
                  Categories
                </NavLink>
              </li>

              <li>
                <NavLink to="/faq" className="navbar_link">
                  FAQ
                </NavLink>
              </li>
            </ul>
          </li>

          <li>
            <NavLink to="/" className="navbar_link">
              Accueil
            </NavLink>
          </li>

          <li>
            <NavLink to="/profil" className="navbar_link">
              Mes livres
            </NavLink>
          </li>
        </ul>
      </nav>

      <nav className="navbar_second">
        <label className="search-container">
          <input
            type="text"
            className={searchActive ? "input-active" : "input"}
          />
          <IoSearchOutline
            className="header-icon"
            onClick={handleSearchClick}
          />
        </label>

        <ul>
          {auth.user ? (
            // {auth.user.role === "admin" && ( lien vers dashboard)}
            // Le lien sera dispo que si l'utilisateur est déconnecté
            <li>
              <NavLink
                to={"/profil"}
                className="navbar_link"
                onClick={handleClick}
              >
                <img
                  className="img-profil"
                  src={`http://localhost:9000/assets/img/${auth.user.image.src}`}
                />
              </NavLink>
              <button onClick={handleLogout}>
                <GrLogout className="header-icon" />

                <p className="text">Se déconnecter</p>
              </button>
            </li>
          ) : (
            <>
              <li>
                <NavLink
                  to={"/se-connecter"}
                  className="navbar_link"
                  onClick={handleClick}
                >
                  <HiUser className="header-icon" />
                  <p className="text">Se connecter</p>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
