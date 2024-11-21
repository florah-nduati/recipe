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
import Create from "./pages/create/create";
import FullRecipe from "./pages/full recipe/fullRecipe";
import ExternalFullRecipe from "./pages/fullRecipeExternal/fullRecipeExternal";
import Recipes from "./pages/my recipes/myRecipes";
//import Edit from "./pages/Edit/edit";

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign up" element={<SignUp />} />
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
            path="create"
            element={
              <Protected>
                <Create />
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
        </Routes>
        <Footer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
