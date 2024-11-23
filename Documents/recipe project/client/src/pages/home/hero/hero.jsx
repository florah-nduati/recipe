import React, { useState, useEffect } from "react";

// Import images
import hero1 from "../../../assets/hero.jpg";
import hero2 from "../../../assets/hero1.jpg";
import hero3 from "../../../assets/hero3.jpg";
import hero4 from "../../../assets/hero4.jpg";
import hero5 from "../../../assets/hero2.jpg";
import hero6 from "../../../assets/hero6.jpg";
import "./hero.css";

function Hero() {
  const images = [hero1, hero2, hero3, hero4, hero5, hero6];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div
      className="hero-section"
      style={{
        backgroundImage: `url(${images[currentImageIndex]})`,
        transition: "background-image 0.5s ease-in-out",
      }}
    >
      <h1>Quick & Easy Recipes for Every Taste</h1>
      <p>
        Discover Your Next Favorite Recipe. Explore, Create, and Share Delicious
        Meals with Our Community
      </p>
      <div className="cta-button">
        <a href="/login" className="cta">
          Start cooking now
        </a>
      </div>
    </div>
  );
}

export default Hero;
