import { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import apiBase from "../../utils/api";
import useUserStore from "../../store/userStore";

const Edit = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState("");

  const titleCharLimit = 100;
  const descriptionCharLimit = 500;

  const { recipeId } = useParams();
  const navigate = useNavigate();

  // Fetch the existing recipe data
  const {
    isLoading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ["updateRecipe"],
    queryFn: async () => {
      const response = await fetch(`${apiBase}/recipes/${recipeId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      setTitle(data.title);
      setDescription(data.description);
      setCookingTime(data.cookingTime);
      setCuisine(data.cuisine);
      setIngredients(data.ingredients);
      setCategory(data.category);
      setImageUrl(data.featuredImage);
      return data;
    },
  });

  const { mutate, isLoading: updateIsLoading } = useMutation({
    mutationFn: async (updatedRecipe) => {
      const response = await fetch(`${apiBase}/recipes/${recipeId}`, {
        method: "PUT",
        body: JSON.stringify(updatedRecipe),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      navigate(`/recipe/${recipeId}`);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "v5fhffpd");
    formData.append("cloud_name", "dbxiinf5v");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dbxiinf5v/image/upload",
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await response.json();
      setImageUrl(data.secure_url);
    } catch (error) {
      setError("Error uploading image");
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmitRecipes = (e) => {
    e.preventDefault();
    if (
      !title ||
      !description ||
      !cookingTime ||
      !ingredients ||
      !category ||
      !imageUrl
    ) {
      setError("Please fill in all required fields with valid values.");
      return;
    }

    const updatedRecipe = {
      title,
      description,
      cookingTime,
      cuisine,
      ingredients,
      category,
      featuredImage: imageUrl,
    };

    mutate(updatedRecipe);
  };

  if (isLoading) return <h2>Loading...</h2>;
  if (isError) return <h2>{queryError.message}</h2>;

  return (
    <div className="write-page">
      <h2>Update Recipe</h2>
      <form onSubmit={handleSubmitRecipes} className="write-form">
        {error && <p className="error-message">{error}</p>}

        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your title here"
          maxLength={titleCharLimit}
          required
        />
        <small>
          {title.length}/{titleCharLimit} characters
        </small>

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description here..."
          maxLength={descriptionCharLimit}
          required
        />
        <small>
          {description.length}/{descriptionCharLimit} characters
        </small>

        <label>Cooking Time:</label>
        <input
          type="text"
          value={cookingTime}
          onChange={(e) => setCookingTime(e.target.value)}
          placeholder="Enter cooking time"
          required
        />

        <label>Cuisine:</label>
        <input
          type="text"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          placeholder="Enter cuisine"
          required
        />

        <label>Ingredients:</label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Enter ingredients"
          required
        />

        <label>Category:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter recipe category"
          required
        />

        <label>Featured Image:</label>
        <input type="file" onChange={handleImageUpload} />
        {imageUrl && <img src={imageUrl} alt="Selected" width="100" />}

        <button type="submit" className="submit-btn" disabled={updateIsLoading}>
          {updateIsLoading ? "Please wait..." : "Publish"}
        </button>
      </form>
    </div>
  );
};

export default Edit;
