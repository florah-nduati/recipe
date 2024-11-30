import React, { useState, useEffect } from "react";
import RecipePreview from "../../components/recipePreview/RecipePreview";
import "./bookmarks.css";

function BookmarksPage() {
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    // For external recipes, get saved data from localStorage
    const storedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    setSavedRecipes(storedRecipes);
  }, []);

  return (
    <div className="bookmarks-page">
      <h2>Your Bookmarked Recipes</h2>
      <div className="bookmarks-content">
        {savedRecipes.length > 0 ? (
          savedRecipes.map((recipe, i) => (
            <RecipePreview
              key={i}
              title={recipe.title}
              authorName={recipe.authorName}
              imageUrl={recipe.imageUrl}  // Ensure imageUrl is passed here
              category={recipe.category}
              cookingTime={recipe.cookingTime}
              cuisine={recipe.cuisine}
              id={recipe.id}
              isExternal={recipe.isExternal}
            />
          ))
        ) : (
          <p>No saved recipes yet.</p>
        )}
      </div>
    </div>
  );
}

export default BookmarksPage;
