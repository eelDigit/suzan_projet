import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { token } from "../../context/token";
import { useAuth } from "../../context/AuthContext";

import { IoIosSettings } from "react-icons/io";
import { MdAddAPhoto } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaBookOpen } from "react-icons/fa";

import "../../assets/styles/profile/profile.css";

const MAX_DESCRIPTION_LENGTH = 250;

const ProfileUser = () => {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState();
  const [err, setErr] = useState();
  const [successMessage, setSuccessMessage] = useState("");

  const { id } = useParams();

  const auth = useAuth();

  useEffect(() => {
    axios
      .get(`http://localhost:9000/books/my-book/${id}`, {
        headers: token(),
      })
      .then((res) => {
        console.log(res);
        setBooks(res.data);
      })
      .catch((res) => {
        console.log(res);
        setErr("Impossible de charger les données");
      });

    axios
      .get(`http://localhost:9000/users/${id}`, {
        headers: token(),
      })
      .then((res) => {
        console.log(res);
        setUser(res.data);
      })
      .catch((res) => {
        console.log(res);
        setErr("Impossible de charger les données");
      });
  }, []);

  const handleDelete = (userId) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer le livre ?"
    );

    if (confirmDelete) {
      axios
        .delete(`http://localhost:9000/books/delete/${userId}`, {
          headers: token(),
        })
        .then((res) => {
          console.log(res.data.message);
          setSuccessMessage("Le livre a été supprimé avec succès");
          setBooks((prevBooks) =>
            prevBooks.filter((book) => book._id !== userId)
          );
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <main>
      {successMessage && <span className="success">{successMessage}</span>}
      <section className="p-section1">
        {user && user.image && (
          <>
            <article className="p-article1">
              <img src={`http://localhost:9000/assets/img/${user.image.src}`} />
              <MdAddAPhoto className="profile-icon" id="pic1" />
              <Link to={`/modifier-utilisateur/${id}`}>
                <IoIosSettings className="profile-icon" id="pic2" />
              </Link>
            </article>
            <article className="p-article2">
              <h3>{user.login}</h3>
            </article>
            {user.description &&
            user.description.length > MAX_DESCRIPTION_LENGTH
              ? `${user.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
              : user.description}{" "}
            <p>
              <FaBookOpen />
              {books.length}
            </p>
          </>
        )}
        <></>
      </section>

      <section className="p-section2">
        <h2>Livres publiés</h2>
        {books.map((oneBook, i) => (
          <>
            {oneBook.image && (
              <section key={oneBook._id} className="p-sous-section">
                <article className="p-article3">
                  <img
                    src={`http://localhost:9000/assets/img/${oneBook.image.src}`}
                    alt={oneBook.image.alt}
                  />
                </article>
                <article className="p-article4">
                  <Link to={`/livre/${oneBook._id}`} className="p-title">
                    {oneBook.title}
                  </Link>
                  <pre>15 chapitres en cours d'écriture</pre>
                  <p>{oneBook.description}</p>
                  {oneBook.categories &&
                    oneBook.categories.map((category) => (
                      <span className="categories">#{category} </span>
                    ))}
                </article>

                <article className="p-article5">
                  <pre>
                    Créé le : {new Date(oneBook.createdAt).toLocaleDateString()}
                  </pre>
                  <pre>
                    Modifié le :{" "}
                    {new Date(oneBook.updatedAt).toLocaleDateString()}
                  </pre>
                </article>

                <article className="p-article6">
                  <Link to={`/modifier-livre/${oneBook._id}`}>
                    <IoIosSettings className="profile-icon" id="pic3" />
                  </Link>

                  <span onClick={() => handleDelete(oneBook._id)}>
                    <MdDelete className="profile-icon" id="pic4" />
                  </span>
                </article>
              </section>
            )}
          </>
        ))}
      </section>
    </main>
  );
};

export default ProfileUser;
