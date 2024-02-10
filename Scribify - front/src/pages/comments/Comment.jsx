import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";
import { Link } from "react-router-dom";

import AddAnswer from "../answers/AddAnswer";
import Answers from "../answers/Answers";

import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { RiQuestionAnswerFill } from "react-icons/ri";

import "../../assets/styles/book/book.css";

const Comment = ({ bookId, commentId, total }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState("");
  const [answers, setAnswers] = useState("");
  const [showAnswerInput, setShowAnswerInput] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false); // Add state to toggle update form
  const [updateContent, setUpdateContent] = useState(""); // State to store updated content
  const [err, setErr] = useState("");
  const auth = useAuth();

  useEffect(() => {
    axios
      .get(`http://localhost:9000/books/comment/${bookId}/${commentId}`, {
        headers: token(),
      })
      .then((res) => {
        setComment(res.data);
        setUpdateContent(res.data.content); // Set initial content for update form
      })
      .catch((error) => {
        console.log(error.response.data);
        setErr("Impossible de charger le commentaire");
      });
  }, [bookId, commentId]);

  const handleUpdate = async () => {
    try {
      if (updateContent.trim() === "") {
        throw new Error("Veuillez remplir tous les champs");
      }

      const updatedComment = {
        content: updateContent,
      };

      await axios.put(
        `http://localhost:9000/books/comment/edit/${bookId}/${commentId}`,
        updatedComment,
        {
          headers: token(),
        }
      );

      setComment((prevComment) => ({
        ...prevComment,
        content: updateContent,
      }));

      setShowUpdateForm(false); // Hide the update form after successful update
    } catch (error) {
      console.error(error);
      setErr(error.message);
    }
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer le commentaire ?"
    );

    if (confirmDelete) {
      axios
        .delete(
          `http://localhost:9000/books/comment/delete/${bookId}/${commentId}`,
          { headers: token() }
        )
        .then((res) => {
          console.log(res.data.message);
          setSuccessMessage("Le commentaire a été supprimé avec succès");
          setComments((prevComments) =>
            prevComments.filter((comment) => comment._id !== commentId)
          );
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const toggleAnswerInput = () => {
    setShowAnswerInput(!showAnswerInput);
  };

  const toggleUpdateForm = () => {
    setShowUpdateForm(!showUpdateForm);
  };

  const handleAnswer = async (answerContent) => {
    try {
      const commentData = {
        content: answerContent,
        pseudo: auth.user.login,
      };

      await axios.post(
        `http://localhost:9000/books/comment/answer/new/${bookId}/${commentId}`,
        commentData,
        {
          headers: token(),
        }
      );

      axios
        .get(
          `http://localhost:9000/books/comment/answers/${bookId}/${commentId}`,
          {
            headers: token(),
          }
        )
        .then((res) => {
          setAnswers(res.data.answers);
        });
    } catch (error) {
      console.error(error);
      setErr(error.message);
    }
  };

  return (
    <main>
      <section className="b-section">
        {comment && (
          <>
            <article className="b-article1">
              <img
                className="style-base2"
                src={`http://localhost:9000/assets/img/${auth.user.image.src}`}
                alt={auth.user.image.alt}
              />
              <h4>{auth.user.login}</h4>

              {showUpdateForm ? (
                <>
                  <textarea
                    className="form-textarea"
                    value={updateContent}
                    onChange={(e) => setUpdateContent(e.target.value)}
                  />
                  <button onClick={handleUpdate} className="form-button">
                    Valider
                  </button>
                </>
              ) : (
                <span>
                  <p className="style-base">{comment.content}</p>
                </span>
              )}
            </article>

            <article className="b-article-pre">
              Posté le {new Date(comment.date).toLocaleDateString()} à{" "}
              {new Date(comment.date).toLocaleTimeString()}
            </article>

            {auth.user.role === "admin" ||
              (auth.user.id === comment.userId._id && (
                <article>
                  <MdDeleteForever
                    className="profile-icon"
                    onClick={handleDelete}
                  />
                  <CiEdit className="profile-icon" onClick={toggleUpdateForm} />
                  <RiQuestionAnswerFill
                    className="profile-icon"
                    onClick={toggleAnswerInput}
                  />
                  {showAnswerInput && (
                    <AddAnswer
                      bookId={bookId}
                      commentId={commentId}
                      handleAnswer={handleAnswer}
                    />
                  )}{" "}
                </article>
              ))}

            {showAnswerInput && (
              <section>
                <Answers bookId={bookId} commentId={commentId} />
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default Comment;
