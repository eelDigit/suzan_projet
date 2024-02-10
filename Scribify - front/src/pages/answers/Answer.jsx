import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import UpdateAnswer from "./UpdateAnswer";

const Answer = ({ bookId, commentId, answerId }) => {
  const [answer, setAnswer] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [updateContent, setUpdateContent] = useState(""); // Add state for update content
  const [err, setErr] = useState(null); // Add state for errors

  const auth = useAuth();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this answer?"
    );

    if (confirmDelete) {
      try {
        await axios.delete(
          `http://localhost:9000/books/comment/answer/delete/${bookId}/${commentId}/${answerId}`,
          {
            headers: token(),
          }
        );
      } catch (err) {
        console.error(err);
        setErr("Failed to delete the answer");
      }
    }
  };

  const toggleEditMode = async () => {
    setEditMode(!editMode);
    await fetchAnswerData();
    setUpdateContent(answer.content);
  };

  const handleUpdateSuccess = () => {
    toggleEditMode();
    fetchAnswerData();
  };

  const fetchAnswerData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/books/comment/answer/${bookId}/${commentId}/${answerId}`,
        {
          headers: token(),
        }
      );
      setAnswer(response.data);
      setUpdateContent(response.data.content); // Set initial content for update form
    } catch (error) {
      console.error(error);
      setErr("Failed to fetch answer data");
    }
  };

  useEffect(() => {
    fetchAnswerData();
  }, [bookId, commentId, answerId]);

  return (
    <main>
      <section className="b-section">
        {answer && (
          <>
            <article className="b-article1">
              <img
                className="style-base2"
                src={`http://localhost:9000/assets/img/${auth.user.image.src}`}
                alt={auth.user.image.alt}
              />
              <h4>{auth.user.login}</h4>

              {editMode ? (
                <>
                  <textarea
                    className="form-textarea"
                    value={updateContent}
                    onChange={(e) => setUpdateContent(e.target.value)}
                  />
                  <button onClick={handleUpdateSuccess} className="form-button">
                    Validate
                  </button>
                </>
              ) : (
                <span>
                  <p className="style-base">{answer.content}</p>
                </span>
              )}
            </article>

            <article className="b-article-pre">
              Posted on {new Date(answer.date).toLocaleDateString()} at{" "}
              {new Date(answer.date).toLocaleTimeString()}
            </article>

            {auth.user.role === "admin" ||
              (auth.user.id === answer.userId._id && (
                <article>
                  <MdDeleteForever
                    className="profile-icon"
                    onClick={handleDelete}
                  />
                  <CiEdit className="profile-icon" onClick={toggleEditMode} />
                </article>
              ))}

            {err && <span>{err}</span>}
          </>
        )}
      </section>
    </main>
  );
};

export default Answer;
