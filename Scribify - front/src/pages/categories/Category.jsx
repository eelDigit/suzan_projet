import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Category = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState([]);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:9000/books/category/${categoryId}`)
      .then((res) => {
        setCategory(res.data.category);
        console.log(res.data);
        setBooks(res.data.books);
      })
      .catch((error) => {
        setError(
          "Impossible de charger la catégorie ou les livres de la catégorie"
        );
      });
  }, [categoryId]);

  return (
    <main>
      {error && <p>{error}</p>}

      <h2>{category.name}</h2>
      <p>{category.description}</p>

      <h3>Livres dans cette catégorie :</h3>
      <ul>
        {books.map((book) => (
          <li key={book._id}>
            <h4>{book.title}</h4>
            <p>{book.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Category;
