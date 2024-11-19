import React from "react";
import "./fullRecipe.css";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import apiBase from "../../utils/api";

function FullRecipe() {
  const { id } = useParams();
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["recipe"],
    queryFn: async () => {
      const response = await fetch(`${apiBase}/recipes/${id}`, {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      console.log(data);
      return data;
    },
  });

  if (isLoading) {
    return <h2>Loading, please wait...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <div className="recipe">
      <div className="recipe-post">
        <h1 className="recipe-title">{data && data.title}</h1>

        {data && data.imageUrl && (
          <img
            src={data.imageUrl}
            alt={data.title}
            className="recipe-featured-image"
          />
        )}

        <p className="recipe-description">{data && data.description}</p>

        <div className="recipe-details">
          <p>
            <strong>Cooking Time:</strong> {data && data.cookingTime} minutes
          </p>
          <p>
            <strong>Category:</strong> {data && data.category}
          </p>
          <p>
            <strong>Cuisine:</strong> {data && data.cuisine}
          </p>
        </div>

        <div className="recipe-ingredients">
          <h3>Ingredients:</h3>
          <ul>
            {data &&
              data.ingredients
                .split(",")
                .map((ingredient, index) => (
                  <li key={index}>{ingredient.trim()}</li>
                ))}
          </ul>
        </div>

        <div className="recipe-instructions">
          <h3>Instructions:</h3>
          <p>{data && data.instructions}</p>
        </div>

        <div className="recipe-meta">
          <span className="recipe-created">
            Created: {new Date(data && data.createdAt).toLocaleDateString()}
          </span>
          <span className="recipe-updated">
            Updated: {new Date(data && data.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default FullRecipe;
