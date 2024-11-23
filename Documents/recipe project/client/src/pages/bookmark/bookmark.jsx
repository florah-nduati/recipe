import React, { useEffect, useState } from "react";
import "./bookmarks.css";
import { useNavigate } from "react-router-dom";
import apiBase from "../../utils/api";
import RecipePreview from "../../components/recipePreview/recipePreview";

function BookmarksPage() {
  const [bookmarkedBackendRecipes, setBookmarkedBackendRecipes] = useState([]);
  const [bookmarkedExternalRecipes, setBookmarkedExternalRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch all bookmarked recipes
  useEffect(() => {
    const fetchBookmarkedRecipes = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch backend bookmarked recipes
        const backendRes = await fetch(`${apiBase}/recipes/bookmarks`, {
          credentials: "include",
        });

        if (!backendRes.ok) {
          const backendError = await backendRes.json();
          throw new Error(backendError.message || "Failed to fetch bookmarks.");
        }

        const backendData = await backendRes.json();
        setBookmarkedBackendRecipes(backendData);

        // Fetch external bookmarked recipes (optional)
        const externalRes = await fetch(`${apiBase}/recipes/bookmarks/external`, {
          credentials: "include",
        });

        if (!externalRes.ok) {
          const externalError = await externalRes.json();
          throw new Error(
            externalError.message || "Failed to fetch external bookmarks."
          );
        }

        const externalData = await externalRes.json();
        setBookmarkedExternalRecipes(externalData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedRecipes();
  }, []);

  // Handle navigation to full recipe page
  const viewFullRecipe = (id) => {
    navigate(`/full-recipe/${id}`);
  };

  return (
    <div className="bookmarks-container">
      <h2>Your Bookmarked Recipes</h2>

      {loading && <p>Loading your bookmarks...</p>}
      {error && <p className="error">{error}</p>}

      {/* Bookmarked Backend Recipes */}
      <div className="bookmarked-backend">
        <h3>Backend Recipes</h3>
        {bookmarkedBackendRecipes.length === 0 && !loading ? (
          <p>You haven't bookmarked any backend recipes yet.</p>
        ) : (
          bookmarkedBackendRecipes.map((recipe) => (
            <RecipePreview
              key={`backend-${recipe.id}`}
              title={recipe.title}
              authorName={`${recipe.user.firstName} ${recipe.user.middleName}`}
              imageUrl={recipe.imageUrl}
              description={recipe.description}
              cookingTime={recipe.cookingTime}
              category={recipe.category}
              id={recipe.id}
            />
          ))
        )}
      </div>

      {/* Bookmarked External Recipes */}
      <div className="bookmarked-external">
        <h3>External Recipes</h3>
        {bookmarkedExternalRecipes.length === 0 && !loading ? (
          <p>You haven't bookmarked any external recipes yet.</p>
        ) : (
          bookmarkedExternalRecipes.map((recipe) => (
            <div className="recipe-card" key={`external-${recipe.idMeal}`}>
              <img src={recipe.strMealThumb} alt={recipe.strMeal} />
              <h3>{recipe.strMeal}</h3>
              <p>Category: {recipe.strCategory}</p>
              <p>Area: {recipe.strArea}</p>
              <button onClick={() => viewFullRecipe(recipe.idMeal)}>
                Read More
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BookmarksPage;
