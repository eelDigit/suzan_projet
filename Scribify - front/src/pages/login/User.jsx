import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { token } from "../../context/token";

const User = () => {
  const [user, setUser] = useState();
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:9000/users/${id}`, { headers: token() })
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
      })
      .catch((res) => {
        console.log(res.data);
      });
  }, [id]);

  return (
    <main>
      {user && (
        <>
          <h1>{user.login}</h1>
          <img
            style={{ width: "200px" }}
            src={`http://localhost:9000/assets/img/${user.image.src}`}
            alt={user.image.alt}
          />
        </>
      )}
    </main>
  );
};

export default User;
