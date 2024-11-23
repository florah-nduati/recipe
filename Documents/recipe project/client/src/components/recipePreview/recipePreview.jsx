import React from "react";
import { Link } from "react-router-dom";
import { FaRegSave } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import "./recipe-preview.css";

function RecipePreview({
  title,
  authorName,
  imageUrl,
  cookingTime,
  category,
  id,
  isBookmarked,
  toggleBookmark,
  likesCount,
  toggleLike,
}) {
  return (
    <div className="recipe-preview">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="recipe-preview-image" />
      )}

      <div className="recipe-preview-content">
        <h3 className="recipe-preview-title"> {title}</h3>
        <p className="recipe-preview-author">by {authorName}</p>

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

        {/* Like Button */}
        <button
          className="like-btn"
          onClick={() => toggleLike(id)}
        >
          <FcLike />
          {likesCount} Likes
        </button>

        {/* Bookmark Button */}
        <button
          className={`bookmark-btn ${isBookmarked ? "bookmarked" : ""}`}
          onClick={() => toggleBookmark(id)}
        >
          <FaRegSave />
          {isBookmarked ? "Bookmarked" : "Bookmark"}
        </button>
      </div>
    </div>
  );
}

export default RecipePreview;

