import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import apiBase from "../../utils/api";
import "./create.css";

const CLOUD_NAME = "dbxiinf5v";
const UPLOAD_PRESET = "v5fhffpd";

const Create = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [category, setCategory] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (recipe) => {
      const response = await fetch(`${apiBase}/recipes`, {
        method: "POST",
        body: JSON.stringify(recipe),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      setError("Recipe created successfully!");
      setTimeout(() => navigate(`/recipe/${data.id}`), 1000);
    },
    onError: () => setError("Failed to create recipe, please try again."),
  });

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Image upload failed.");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const uploadedUrl = await uploadImageToCloudinary(file);
        setImageUrl(uploadedUrl);
      } catch (error) {
        setError("Failed to upload image.");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !title ||
      !description ||
      !cookingTime ||
      !category ||
      !cuisine ||
      !ingredients ||
      !instructions ||
      !imageUrl
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const recipe = {
      title,
      imageUrl,
      description,
      cookingTime: parseInt(cookingTime),
      category,
      cuisine,
      ingredients,
      instructions,
    };

    mutate(recipe);
  };

  return (
    <div className="write-page">
      <h2>Create a New Recipe</h2>
      <form onSubmit={handleSubmit} className="write-form">
        {error && <p className="error-message">{error}</p>}

        <label>Recipe Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          required
        />

        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter recipe title"
          required
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter recipe description"
          required
        />

        <label>Cooking Time (minutes):</label>
        <input
          type="number"
          value={cookingTime}
          onChange={(e) => setCookingTime(e.target.value)}
          placeholder="Enter cooking time"
          required
        />

        <label>Category:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category (e.g., Main Course)"
          required
        />

        <label>Cuisine:</label>
        <input
          type="text"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          placeholder="Enter cuisine (e.g., Italian)"
          required
        />

        <label>Ingredients (comma-separated):</label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Enter ingredients separated by commas"
          required
        />

        <label>Instructions:</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Enter detailed cooking instructions"
          required
        />
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Create Recipe"}
        </button>
      </form>
    </div>
  );
};

export default Create;
