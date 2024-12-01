import React, { useState, useEffect } from "react";
import { useMutation } from "react-query";
import apiBase from "../utils/api";

// Backend API functions for liking/unliking recipes
const likeRecipe = async (recipeId) => {
  const response = await fetch(`${apiBase}/recipes/${recipeId}/like`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to like recipe");
  return response.json();
};

const unlikeRecipe = async (recipeId) => {
  const response = await fetch(`${apiBase}/recipes/${recipeId}/unlike`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to unlike recipe");
  return response.json();
};

// Backend API functions for bookmarking/unbookmarking recipes
const addBookmark = async (recipeId) => {
  const response = await fetch(`${apiBase}/recipes/${recipeId}/addBookmark`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to bookmark recipe");
  return response.json();
};

const removeBookmark = async (recipeId) => {
  const response = await fetch(
    `${apiBase}/recipes/${recipeId}/removeBookmark`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
  if (!response.ok) throw new Error("Failed to remove bookmark");
  return response.json();
};

function LikesAndBookmarks() {
  const [likedRecipes, setLikedRecipes] = useState(new Set());
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState(new Set());
  const [likesCount, setLikesCount] = useState({});
  const [bookmarkedList, setBookmarkedList] = useState([]); // Stores detailed bookmarked recipes

  useEffect(() => {
    const persistedLikedRecipes = localStorage.getItem("likedRecipes");
    const persistedLikesCount = localStorage.getItem("likesCount");
    const persistedBookmarkedRecipes =
      localStorage.getItem("bookmarkedRecipes");

    if (persistedLikedRecipes) {
      setLikedRecipes(new Set(JSON.parse(persistedLikedRecipes)));
    }
    if (persistedLikesCount) {
      setLikesCount(JSON.parse(persistedLikesCount));
    }
    if (persistedBookmarkedRecipes) {
      const parsedBookmarks = JSON.parse(persistedBookmarkedRecipes);
      setBookmarkedRecipes(new Set(parsedBookmarks.map((recipe) => recipe.id)));
      setBookmarkedList(parsedBookmarks); // Store the detailed list for display
    }
  }, []);

  const removeRecipeFromList = (recipeId) => {
    setBookmarkedList((prev) =>
      prev.filter((recipe) => recipe.id !== recipeId),
    );
  };

  const likeMutation = useMutation(likeRecipe, {
    onSuccess: (data, recipeId) => {
      setLikedRecipes((prev) => new Set(prev.add(recipeId)));
      setLikesCount((prev) => ({
        ...prev,
        [recipeId]: (prev[recipeId] || 0) + 1,
      }));
      localStorage.setItem("likedRecipes", JSON.stringify([...likedRecipes]));
      localStorage.setItem("likesCount", JSON.stringify(likesCount));
    },
    onError: (error) => {
      console.error("Error liking recipe:", error.message);
    },
  });

  const unlikeMutation = useMutation(unlikeRecipe, {
    onSuccess: (data, recipeId) => {
      const updated = new Set(likedRecipes);
      updated.delete(recipeId);
      setLikedRecipes(updated);
      setLikesCount((prev) => ({
        ...prev,
        [recipeId]: Math.max((prev[recipeId] || 0) - 1, 0),
      }));
      localStorage.setItem("likedRecipes", JSON.stringify([...updated]));
      localStorage.setItem("likesCount", JSON.stringify(likesCount));
    },
    onError: (error) => {
      console.error("Error unliking recipe:", error.message);
    },
  });

  const bookmarkMutation = useMutation(addBookmark, {
    onSuccess: (data, recipeId) => {
      setBookmarkedRecipes((prev) => new Set(prev.add(recipeId)));
      localStorage.setItem(
        "bookmarkedRecipes",
        JSON.stringify([...bookmarkedRecipes]),
      );
    },
    onError: (error) => {
      console.error("Error bookmarking recipe:", error.message);
    },
  });

  const removeBookmarkMutation = useMutation(removeBookmark, {
    onSuccess: (data, recipeId) => {
      const updated = new Set(bookmarkedRecipes);
      updated.delete(recipeId);
      setBookmarkedRecipes(updated);
      removeRecipeFromList(recipeId); // Remove recipe from visible list
      localStorage.setItem(
        "bookmarkedRecipes",
        JSON.stringify(
          bookmarkedList.filter((recipe) => recipe.id !== recipeId),
        ),
      );
    },
    onError: (error) => {
      console.error("Error unbookmarking recipe:", error.message);
    },
  });

  const toggleLike = (recipeId) => {
    if (!likedRecipes.has(recipeId)) {
      likeMutation.mutate(recipeId);
    } else {
      unlikeMutation.mutate(recipeId);
    }
  };

  const toggleBookmark = (recipeId) => {
    if (!bookmarkedRecipes.has(recipeId)) {
      bookmarkMutation.mutate(recipeId);
    } else {
      removeBookmarkMutation.mutate(recipeId);
    }
  };

  return {
    bookmarkedList,
    toggleBookmark,
    toggleLike,
    likesCount,
    isBookmarked: (id) => bookmarkedRecipes.has(id),
  };
}

export default LikesAndBookmarks;
