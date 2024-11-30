import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./recipe-preview.css";

function RecipePreview({
  title,
  authorName,
  imageUrl,
  category,
  cookingTime,
  cuisine,
  id,
  isExternal,
  onLike,
  onSave,
  onRemove, // Added prop for parent to handle removal from bookmark page
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // For external recipes, load liked/saved status from localStorage
  useEffect(() => {
    if (isExternal) {
      const likedRecipes = JSON.parse(localStorage.getItem("likedRecipes")) || [];
      const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
      setIsLiked(likedRecipes.includes(id));
      setIsSaved(savedRecipes.some((recipe) => recipe.id === id));
    }
  }, [id, isExternal]);

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    if (isExternal) {
      // Handle external recipe like status with localStorage
      const likedRecipes = JSON.parse(localStorage.getItem("likedRecipes")) || [];
      if (isLiked) {
        // If already liked, remove it
        localStorage.setItem("likedRecipes", JSON.stringify(likedRecipes.filter((recipeId) => recipeId !== id)));
      } else {
        // Otherwise, add it
        localStorage.setItem("likedRecipes", JSON.stringify([...likedRecipes, id]));
      }
    } else {
      // Call backend API for backend recipe (if needed)
      onLike(id);
    }
  };

  const handleSave = () => {
    setIsSaved((prev) => !prev);
    if (isExternal) {
      // Handle external recipe save status with localStorage
      const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
      const recipeToSave = {
        title,
        authorName,
        imageUrl,
        category,
        cookingTime,
        cuisine,
        id,
        isExternal,
      };
      if (isSaved) {
        // If already saved, remove it
        const updatedRecipes = savedRecipes.filter((recipe) => recipe.id !== id);
        localStorage.setItem("savedRecipes", JSON.stringify(updatedRecipes));
        if (onSave) onSave(id); // Notify parent when unsaved
        if (onRemove) onRemove(id); // Notify parent for removal from bookmark page
      } else {
        // Otherwise, add it
        localStorage.setItem("savedRecipes", JSON.stringify([...savedRecipes, recipeToSave]));
      }
    } else {
      // Call backend API for backend recipe (if needed)
      onSave(id);
    }
  };

  return (
    <div className="recipe-preview">
      {imageUrl && <img src={imageUrl} alt={title} className="recipe-preview-image" />}
      <div className="recipe-preview-content">
        <h3 className="recipe-preview-title">{title}</h3>
        <p className="recipe-preview-author">By {authorName}</p>
        <p className="blog-preview-excerpt">Category: {category}</p>
        <p className="blog-preview-excerpt">⏲️: {cookingTime}</p>
        <p className="blog-preview-excerpt">Cuisine: {cuisine}</p>
        <Link
          to={isExternal ? `/full-recipe/${id}` : `/recipe/${id}`}
          className="read-more-link"
        >
          Read More
        </Link>

        <div className="recipe-preview-actions">
          <button
            onClick={handleLike}
            className={`like-btn ${isLiked ? "liked" : ""}`}
          >
            {isLiked ? "Liked" : "Like"}
          </button>
          <button
            onClick={handleSave}
            className={`save-btn ${isSaved ? "saved" : ""}`}
          >
            {isSaved ? "Unsave" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipePreview;
