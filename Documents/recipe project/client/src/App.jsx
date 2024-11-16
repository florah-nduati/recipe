import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import Protected from "./components/protected/protected";
import Header from "./components/header/header";
import Home from "./pages/home/home";
//import About from "./pages/about/about";
import Login from "./pages/login/login";
import SignUp from "./pages/signup/signup";
import Footer from "./components/footer/footer";
//import Write from "./pages/write/write";
//import FullBlog from "./pages/fullBlog/fullBlog";
//import Library from "./pages/library/library";
//import Profile from "./pages/profile/profile";
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
          
        </Routes>
        <Footer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

