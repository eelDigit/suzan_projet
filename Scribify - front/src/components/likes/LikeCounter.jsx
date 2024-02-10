import React, { useState, useEffect } from "react";
import axios from "axios";
import { token } from "../../context/token";
import { useParams } from "react-router-dom";

import "../../assets/styles/book/book.css";

const LikeCounter = ({}) => {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:9000/books/${id}`)
      .then((res) => {
        setLikes(res.data.likes);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [liked]);

  const handleLike = () => {
    axios
      .put(`http://localhost:9000/books/likes/${id}`, liked, {
        headers: token(),
      })
      .then((res) => {
        console.log(res.data);
        setLikes(res.data.likes);
        setLiked(res.data.liked);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <button onClick={handleLike}>{liked ? "Unlike" : "Like"}</button>
      {/* <span>{likes.length} Likes</span> */}
    </div>
  );
};

export default LikeCounter;
