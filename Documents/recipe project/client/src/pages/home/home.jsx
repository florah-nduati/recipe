import React from "react";
import Hero from "./hero/hero";
import AboutUs from "./about/about";

function Home() {
  return (
    <React.Fragment>
      <Hero />
      <AboutUs />
    </React.Fragment>
  );
}

export default Home;
