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
        // Log the ID being used to fetch the recipe for debugging
        console.log("Fetching recipe with ID:", id);

        // Ensure the id exists before making the request
        if (!id) {
          throw new Error("No recipe ID found in URL");
        }

        setLoading(true);
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
        );

        if (!response.ok) {
          // If the response is not OK, throw an error
          throw new Error(
            `Failed to fetch recipe details. Status: ${response.status}`,
          );
        }

        const data = await response.json();

        // Debugging the API response
        console.log("API Response:", data);

        if (data.meals && data.meals.length > 0) {
          setRecipe(data.meals[0]); // Set the recipe if available
        } else {
          throw new Error("Recipe not found with the provided ID");
        }
      } catch (err) {
        console.error("Error:", err.message); // Log the error
        setError(`Error fetching recipe details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]); // Re-fetch when the `id` changes

  // Loading state
  if (loading) {
    return <p className="error">Loading recipe details...</p>;
  }

  // Error state
  if (error) {
    return <p className="error">{error}</p>;
  }

  // If no recipe is found
  if (!recipe) {
    return (
      <div className="recipe">
        <h2>Recipe Not Found</h2>
        <p>We couldn't find a recipe with the given ID. Please try another.</p>
      </div>
    );
  }

  // Render the recipe details
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
            src={
              recipe.strYoutube.includes("v=")
                ? `https://www.youtube.com/embed/${recipe.strYoutube.split("v=")[1]}`
                : recipe.strYoutube
            }
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
