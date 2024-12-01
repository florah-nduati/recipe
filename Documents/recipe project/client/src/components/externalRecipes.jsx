import { useQuery } from "react-query";
import { useState } from "react";

function useFetchMealDB() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ category: "", area: "" });

  // Construct the API URL dynamically based on search and filter
  const getApiUrl = () => {
    if (searchTerm) {
      return `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
    }
    if (filter.category) {
      return `https://www.themealdb.com/api/json/v1/1/filter.php?c=${filter.category}`;
    }
    if (filter.area) {
      return `https://www.themealdb.com/api/json/v1/1/filter.php?a=${filter.area}`;
    }
    return `https://www.themealdb.com/api/json/v1/1/search.php?s=`;
  };

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["mealDBRecipes", searchTerm, filter],
    queryFn: async () => {
      const response = await fetch(getApiUrl());
      if (!response.ok) {
        throw new Error("Failed to fetch recipes from TheMealDB");
      }
      const data = await response.json();
      return data.meals; // Returns an array of meals
    },
  });

  return {
    isLoading,
    isError,
    error,
    data: data || [],
    setSearchTerm,
    setFilter,
    searchTerm,
    filter,
  };
}
export default useFetchMealDB;
