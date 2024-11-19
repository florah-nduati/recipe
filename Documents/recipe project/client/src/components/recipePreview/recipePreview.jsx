import React from "react";
import { Link } from "react-router-dom";
import "./recipe-preview.css";

function RecipePreview({
  title,
  authorName,
  imageUrl,
  description,
  cookingTime,
  category,
  id,
}) {
  return (
    <div className="recipe-preview">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="recipe-preview-image" />
      )}

      <div className=" recipe-preview-content">
        <h3 className="recipe-preview-title"> {title}</h3>
        <p className="recipe-preview-author">by {authorName}</p>

        <p className="recipe-preview-description"> {description}</p>
        <p className="recipe-preview-cookingTime">
          cooking time: {cookingTime}
        </p>
        <p className="recipe-preview-category"> category: {category}</p>

        <Link
          to={`/recipe/${id}`}
          className="recipe-preview-button read-more-link"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}
export default RecipePreview;
