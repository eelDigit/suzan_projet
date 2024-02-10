import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../../assets/styles/home/home.css";
import concoursImage from "../../assets/images/home/concours-ecriture.png";
import conseilsImage from "../../assets/images/home/conseils-ecriture.png";
import recrutementImage from "../../assets/images/home/recrutement.png";
import axios from "axios";

// import { IoIosArrowDroprightCircle } from "react-icons/io";
// import { IoIosArrowDropleftCircle } from "react-icons/io";

import { IoEllipsisVerticalOutline } from "react-icons/io5";

const Home = () => {
  const [booksPopulars, setBooksPopulars] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [lastUpdates, setLastUpdates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [err, setErr] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:9000/books/popular-books")
      .then((res) => {
        console.log(res);
        setBooksPopulars(res.data);
      })
      .catch((res) => {
        console.log(res);
        setErr("Impossible de charger les données");
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:9000/books/newest-books")
      .then((res) => {
        console.log(res);
        setNewBooks(res.data);
      })
      .catch((res) => {
        console.log(res);
        setErr("Impossible de charger les données");
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:9000/books/latest-chapters")
      .then((res) => {
        console.log(res);
        setLastUpdates(res.data);
      })
      .catch((res) => {
        console.log(res);
        setErr("Impossible de charger les données");
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:9000/categories")
      .then((res) => {
        console.log(res);
        setCategories(res.data); // Supposons que res.data est un tableau d'objets contenant les catégories
      })
      .catch((res) => {
        console.log(res);
        setErr("Impossible de charger les données");
      });
  }, []);

  // const handleScrollLeft = () => {
  //   const newScrollPosition = Math.max(scrollPosition - 200, 0); // Ajustez la valeur selon vos besoins
  //   setScrollPosition(newScrollPosition);
  // };

  // const handleScrollRight = () => {
  //   const newScrollPosition = scrollPosition + 200; // Ajustez la valeur selon vos besoins
  //   setScrollPosition(newScrollPosition);
  // };

  return (
    <>
      <main>
        <section className="h-section1">
          <article className="h-article1">
            <p> Écrivez Votre Premier Livre</p>
            <ul>
              <li>
                <Link to="/" className="h-link1">
                  Connectez-vous avec Google
                </Link>
              </li>
              <li>
                <Link to="/s-inscrire" className="h-link2">
                  Inscrivez-vous
                </Link>
              </li>
            </ul>
          </article>
          <article className="h-article2">
            <span className="images">
              <Link to="/concours">
                <img src={concoursImage} alt="concours" />
              </Link>
              <Link to="/conseils">
                <img src={conseilsImage} alt="conseils" />
              </Link>
              <Link to="/recrutement">
                <img src={recrutementImage} alt="recrutement" />
              </Link>
            </span>
          </article>
        </section>

        <h2>Populaires</h2>
        <section className="h-popular-section">
          {/* <button className="scroll-button left" onClick={handleScrollLeft}>
            <IoIosArrowDropleftCircle />
          </button> */}
          <span className="scroll-button left">
            <IoEllipsisVerticalOutline />
          </span>
          <section className="h-section2">
            {booksPopulars.map((oneBookPopular) => (
              <article key={oneBookPopular._id} className="book-item">
                <NavLink to={`/livre/${oneBookPopular._id}`}>
                  <span className="h-article3">
                    <img
                      className="h-img1"
                      src={`http://localhost:9000/assets/img/${oneBookPopular.image.src}`}
                      alt={oneBookPopular.image.alt}
                    />
                    <p className="h-title">{oneBookPopular.title}</p>
                  </span>
                </NavLink>
              </article>
            ))}
          </section>

          {/* <button className="scroll-button right" onClick={handleScrollRight}>
            <IoIosArrowDroprightCircle />
          </button>          */}
          <span className="scroll-button right">
            <IoEllipsisVerticalOutline />
          </span>
        </section>

        <h2>Nouveautés</h2>
        <section className="h-popular-section">
          {/* <button className="scroll-button">
            <IoIosArrowDropleftCircle />
          </button> */}

          <span className="scroll-button left">
            <IoEllipsisVerticalOutline />
          </span>
          <section className="h-section2">
            {newBooks.map((oneNewBook) => (
              <article key={oneNewBook._id} className="book-item">
                <NavLink to={`/livre/${oneNewBook._id}`}>
                  <span className="h-article3">
                    <img
                      className="h-img1"
                      src={`http://localhost:9000/assets/img/${oneNewBook.image.src}`}
                      alt={oneNewBook.image.alt}
                    />
                    <p className="h-title">{oneNewBook.title}</p>
                  </span>
                </NavLink>
              </article>
            ))}
          </section>
          {/* <button className="scroll-button">
            <IoIosArrowDroprightCircle />
          </button> */}

          <span className="scroll-button right">
            <IoEllipsisVerticalOutline />
          </span>
        </section>

        <aside>
          <h2>Dernières Publications</h2>
          <section className="h-recent-section">
            {lastUpdates.map((oneLastUpdate) => (
              <article key={oneLastUpdate._id} className="h-recent-article">
                <NavLink to={`/livre/${oneLastUpdate._id}`}>
                  <p className="h-chapters">{oneLastUpdate.title}</p>
                </NavLink>
              </article>
            ))}{" "}
          </section>
          <article>
            <h2>Catégories</h2>
            <section className="h-recent-section">
              {categories.map((category) => (
                <article key={category._id} className="h-recent-article">
                  <NavLink to={`/categorie/${category._id}`}>
                    <p className="h-chapters">{category.name}</p>
                  </NavLink>
                </article>
              ))}
            </section>
          </article>
        </aside>
      </main>
    </>
  );
};

export default Home;
