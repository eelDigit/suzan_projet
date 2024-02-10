import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import LikeCounter from "../../components/likes/LikeCounter";

import { IoEyeSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { FaComment } from "react-icons/fa";

import { IoIosAddCircle } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

import "../../assets/styles/book/book.css";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";
import AddComment from "../comments/AddComment";
import Comments from "../comments/Comments";

const Book = () => {
  const [book, setBook] = useState();
  const [categories, setCategories] = useState([]);
  const [chapters, setChapters] = useState();
  const [err, setErr] = useState();
  const [sucessMessage, setSuccessMessage] = useState();
  const [showComments, setShowComments] = useState(false);
  const { id } = useParams();

  const auth = useAuth();

  useEffect(() => {
    axios
      .get(`http://localhost:9000/books/${id}`)
      .then((res) => {
        console.log(res.data);
        setBook(res.data);
        setCategories(res.data.categoryId);
        setChapters(res.data.chapters);
      })
      .catch((res) => {
        console.log(res.data);
      });
  }, [id]);

  const handleDelete = (bookId, chapterId) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer le chapitre ?"
    );

    if (confirmDelete) {
      axios
        .delete(
          `http://localhost:9000/books/chapter/delete/${bookId}/${chapterId}`,
          { headers: token() }
        )
        .then((res) => {
          console.log(res.data.message);
          setSuccessMessage("Le chapitre a été supprimé avec succès");
          setChapters((prevChapters) =>
            prevChapters.filter((chapter) => chapter._id !== id)
          );
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <main>
      <section className="b-section">
        {book && (
          <>
            <h1 className="b-title">{book.title}</h1>
            <article className="b-article1">
              <img
                className="style-base2"
                src={`http://localhost:9000/assets/img/${book.image.src}`}
                alt={book.image.alt}
                aria-label="book-image"
                title={book.image.alt}
              />
              <span>
                <p className="style-base">{book.description}</p>
                <span className="categories">
                  {categories &&
                    categories.map((category, index) => (
                      <p key={index}>#{category.name}</p>
                    ))}
                </span>
              </span>
            </article>
            <article className="b-article2">
              <IoEyeSharp className="book-icon" id="bic1" />
              <pre>{book.views}</pre>
              <FaHeart className="book-icon" id="bic2" />
              {/* {book.likes} */} <pre>{book.likes.length}</pre>
              <FaComment
                className="book-icon"
                id="bic3"
                onClick={() => setShowComments(!showComments)}
              />
              <pre>{book.comments.length}</pre>
            </article>
            {chapters &&
              chapters.map((chapter, index) => (
                <section key={index}>
                  <h5>{chapter.title}</h5>
                  {console.log(chapter)}
                  <p
                    className="style-base3"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(chapter.content),
                    }}
                  />
                  {/* A tester avec un utilisateur qui est non admin */}
                  {auth.user.role === "admin" ||
                    (auth.user.id === book.userId._id && (
                      <article>
                        <MdDeleteForever
                          className="profile-icon"
                          onClick={() => handleDelete(book._id, chapter._id)}
                        />
                        <Link
                          to={`/modifier-chapitre/${book._id}/${chapter._id}`}
                        >
                          <CiEdit className="profile-icon" />
                        </Link>
                      </article>
                    ))}
                </section>
              ))}
            <Link to={`/ajouter-chapitre/${book._id}`}>
              <IoIosAddCircle />
            </Link>
            <LikeCounter />
            <AddComment bookId={id} />
            {showComments && <Comments bookId={id} />}
          </>
        )}
      </section>
    </main>
  );
};

export default Book;
