import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import apiBase from "../../utils/api";
import "./recipe-preview.css";

// Fetch Like Count Query Function
const fetchLikeCount = async (id) => {
  const response = await fetch(`${apiBase}/recipes/${id}/likes-count`);
  if (!response.ok) {
    throw new Error("Error fetching like count");
  }
  const data = await response.json();
  return data.likes;
};

// Fetch Like Status
const fetchLikeStatus = async (id, userId) => {
  const response = await fetch(
    `${apiBase}/recipes/${id}/is-liked?userId=${userId}`,
  );
  if (!response.ok) {
    throw new Error("Error fetching like status");
  }
  const data = await response.json();
  return data.isLiked;
};

// Like Mutation Function
const handleLikeMutation = async (id, isLiked) => {
  const response = await fetch(`${apiBase}/recipes/${id}/like`, {
    method: isLiked ? "DELETE" : "POST",
    headers: { "Content-Type": "application/json" },

    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error liking recipe");
  }
};

// Save Mutation Function
const handleSaveMutation = async (id, isSaved, isExternal) => {
  if (isExternal) {
    if (isSaved) {
      const savedRecipes =
        JSON.parse(localStorage.getItem("savedRecipes")) || [];
      const updatedRecipes = savedRecipes.filter((recipe) => recipe.id !== id);
      localStorage.setItem("savedRecipes", JSON.stringify(updatedRecipes));
    } else {
      const savedRecipes =
        JSON.parse(localStorage.getItem("savedRecipes")) || [];
      const recipeToSave = {
        id,
        isExternal,
      };
      localStorage.setItem(
        "savedRecipes",
        JSON.stringify([...savedRecipes, recipeToSave]),
      );
    }
  } else {
    if (isSaved) {
      await fetch(`${apiBase}/recipes/${id}/bookmark`, { method: "DELETE" });
    } else {
      await fetch(`${apiBase}/recipes/${id}/bookmark`, { method: "POST" });
    }
  }
};

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
  onRemove,
  isBookmarkPage,
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const {
    data: likeCount,
    isLoading: likeCountLoading,
    error: likeCountError,
  } = useQuery({
    queryKey: ["likeCount", id],
    queryFn: () => fetchLikeCount(id),
  });

  const userId = localStorage.getItem("userId"); // Retrieve userId stored in localStorage

  // Fetch like status using React Query
  const { data: likeStatus, error: likeStatusError } = useQuery({
    queryKey: ["likeStatus", id, userId],
    queryFn: () => fetchLikeStatus(id, userId),
    enabled: !!userId,
  });

  // Like Mutation using useMutation
  const { mutate: handleLike } = useMutation({
    mutationFn: (isLiked) => handleLikeMutation(id, isLiked, userId),
    onSuccess: () => {
      setIsLiked((prev) => !prev);
      if (onLike) onLike(id);
    },
    onError: (error) => {
      console.error("Error liking recipe:", error.message);
    },
  });

  const { mutate: handleSave } = useMutation({
    mutationFn: (isSaved) => handleSaveMutation(id, isSaved, isExternal),
    onSuccess: () => {
      setIsSaved((prev) => !prev);
      if (onSave) onSave(id);
      if (onRemove && isSaved) onRemove(id);
    },
  });

  useEffect(() => {
    if (likeStatus !== undefined) {
      setIsLiked(likeStatus);
    }
  }, [likeStatus]);

  useEffect(() => {
    if (likeCount !== undefined) {
    }
  }, [likeCount]);

  if (likeCountLoading) return <p>Loading like count...</p>;
  if (likeCountError) return <p>Error loading like count</p>;

  if (likeStatusError) return <p>Error loading like status</p>;

  return (
    <div className="recipe-preview">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="recipe-preview-image" />
      )}
      <div className="recipe-preview-content">
        <h3 className="recipe-preview-title">{title}</h3>
        <p className="recipe-preview-author">By {authorName}</p>
        <p className="blog-preview-excerpt">Category: {category}</p>
        <p className="blog-preview-excerpt">⏲️: {cookingTime}</p>
        <p className="blog-preview-excerpt">Cuisine: {cuisine}</p>
        <p className="likes-count">❤️ {likeCount} Likes</p>

        <Link
          to={isExternal ? `/full-recipe/${id}` : `/recipe/${id}`}
          className="read-more-link"
        >
          Read More
        </Link>

        <div className="recipe-preview-actions">
          <button
            onClick={() => handleLike(isLiked)}
            className={`like-btn ${isLiked ? "liked" : ""}`}
          >
            {isLiked ? "Liked" : "Like"}
          </button>

          {/* Render Save button in Explore page */}
          {!isBookmarkPage && (
            <button
              onClick={() => handleSave(isSaved)}
              className={`save-btn ${isSaved ? "saved" : ""}`}
            >
              {isSaved ? "Unsave" : "Save"}
            </button>
          )}

          {/* Render Unsave button in Bookmarks page */}
          {isBookmarkPage && (
            <button
              onClick={() => handleSave(isSaved)}
              className={`save-btn ${isSaved ? "saved" : ""}`}
            >
              Unsave
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipePreview;
