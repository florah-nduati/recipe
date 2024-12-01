import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Protected from "./components/protected/protected";
import Header from "./components/header/header";
import Home from "./pages/home/home";
import Explore from "./pages/explore/explore";
import Login from "./pages/login/login";
import SignUp from "./pages/signup/signup";
import Footer from "./components/footer/footer";
import Edit from "./pages/edit/edit";
import FullRecipe from "./pages/full recipe/fullRecipe";
import ExternalFullRecipe from "./pages/fullRecipeExternal/fullRecipeExternal";
import Recipes from "./pages/my recipes/myRecipes";
import BookmarksPage from "./pages/bookmarksPage/bookmarksPage";
import Settings from "./pages/settings/settings";

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/explore"
            element={
              <Protected>
                <Explore />
              </Protected>
            }
          />
          <Route
            path="/recipe/:id"
            element={
              <Protected>
                <FullRecipe />
              </Protected>
            }
          />

          <Route
            path="/full-recipe/:id"
            element={
              <Protected>
                <ExternalFullRecipe />
              </Protected>
            }
          />
          <Route
            path="/recipes"
            element={
              <Protected>
                <Recipes />
              </Protected>
            }
          />
          <Route
            path="/edit/:recipeId"
            element={
              <Protected>
                <Edit />
              </Protected>
            }
          />
          <Route
            path="/bookmark"
            element={
              <Protected>
                <BookmarksPage />
              </Protected>
            }
          />
          <Route
            path="/settings"
            element={
              <Protected>
                <Settings />
              </Protected>
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
