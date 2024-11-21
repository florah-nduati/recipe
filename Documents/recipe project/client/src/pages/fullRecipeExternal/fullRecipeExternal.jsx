import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./fullExternalRecipe.css";

function ExternalFullRecipe() {
  const { id } = useParams(); 
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch recipe details");
        }
        const data = await response.json();
        setRecipe(data.meals ? data.meals[0] : null);
      } catch (err) {
        setError("Error fetching recipe details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <p className="error">Loading recipe details...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!recipe) {
    return <p>No recipe found.</p>;
  }

  return (
    <div className="recipe">
      <h1>{recipe.strMeal}</h1>
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="recipe-image"
      />
      <h3>Category: {recipe.strCategory}</h3>
      <h3>Area: {recipe.strArea}</h3>

      <h2>Ingredients</h2>
      <ul>
        {Array.from({ length: 20 }).map((_, i) => {
          const ingredient = recipe[`strIngredient${i + 1}`];
          const measure = recipe[`strMeasure${i + 1}`];
          return (
            ingredient && (
              <li key={i}>
                <span>{ingredient}</span> - {measure}
              </li>
            )
          );
        })}
      </ul>

      <h2>Instructions</h2>
      <p className="instructions">{recipe.strInstructions}</p>

      {recipe.strYoutube && (
        <div className="video">
          <h3>Video Instructions</h3>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${recipe.strYoutube.split("v=")[1]}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {recipe.strSource && (
        <p>
          <a href={recipe.strSource} target="_blank" rel="noopener noreferrer">
            View Original Recipe
          </a>
        </p>
      )}
    </div>
  );
}

export default ExternalFullRecipe;

