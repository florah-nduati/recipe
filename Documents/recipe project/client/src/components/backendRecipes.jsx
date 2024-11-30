import React from "react";
import { useQuery } from "react-query";
import RecipePreview from "./recipePreview/recipePreview";
import apiBase from "../utils/api";

function BackendRecipes({ bookmarkedRecipes = new Set(), toggleBookmark, likesCount = {}, toggleLike }) {
  const {
    isLoading: loadingBackend,
    isError: errorBackend,
    data: backendRecipes,
  } = useQuery({
    queryKey: ["allRecipes"],
    queryFn: async () => {
      const response = await fetch(`${apiBase}/Recipes`, {
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const data = await response.json();
      return data;
    },
  });

  return (
    <div className="recipe-cards">
      {errorBackend && <p className="error">Error fetching backend recipes.</p>}
      {loadingBackend ? (
        <p>Loading backend recipes...</p>
      ) : (
        backendRecipes &&
        backendRecipes.map((recipe, i) => (
          <RecipePreview
            key={`backend-${i}`}
            title={recipe.title}
            authorName={`${recipe.user.firstName} ${recipe.user.middleName}`}
            imageUrl={recipe.imageUrl}
            cookingTime={recipe.cookingTime}
            category={recipe.category}
            id={recipe.id}
            isBookmarked={bookmarkedRecipes.has(recipe.id)}
            toggleBookmark={() => toggleBookmark(recipe.id)}
            likesCount={likesCount[recipe.id] || 0}
            toggleLike={() => toggleLike(recipe.id)} // Ensure recipe ID is passed
          />
        ))
      )}
    </div>
  );
}

export default BackendRecipes;
