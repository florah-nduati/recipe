import React from "react";
import "./about.css";
import image1 from "../../../assets/about1.jpg";
import image2 from "../../../assets/about2.jpg";
import image3 from "../../../assets/about3.jpg";
import image4 from "../../../assets/about4.jpg";
import video1 from "../../../assets/about5.mp4";

function AboutUs() {
  const cards = [
    {
      image: image1,
      title: "Our Purpose",
      description:
        "At [Your Website Name], we aim to provide seamless access to cutting-edge technology and build a supportive community.",
    },
    {
      image: image2,
      title: "Our Vision",
      description:
        "We envision a world where everyone has equal opportunities to succeed and thrive.",
    },
    {
      image: image3,
      title: "Our Core Values",
      description:
        "Integrity, innovation, and community are at the heart of everything we do.",
    },
    {
      image: image4,
      title: "Our Mission",
      description:
        "To inspire and empower individuals to reach their fullest potential by providing the right tools and opportunities.",
    },
  ];

  return (
    <div className="about-us-container">
      {/* About Us Section */}
      <section className="about-us-section">
        <h1 className="about-us-title">About Us</h1>
        <p className="about-us-description">
          Welcome to <strong>the flavor lab</strong>! We are dedicated to
          empowering individuals and organizations through innovative solutions
          and fostering a community of growth and collaboration.
        </p>
      </section>

      {/* Cards Section */}
      <section className="about-us-cards">
        {cards.map((card, index) => (
          <div className="card" key={index}>
            <img src={card.image} alt={card.title} className="card-image" />
            <h2 className="card-title">{card.title}</h2>
            <p className="card-description">{card.description}</p>
          </div>
        ))}
      </section>

      {/* Story Section with Video */}
      <section className="about-us-story-container">
        <div className="story-content">
          <h2>Our Story</h2>
          <p>
            flavor lab began with a simple idea: to connect people and resources
            effortlessly. What started as a small project has grown into a
            dynamic platform serving a global audience. Over the years, our
            journey has been marked by countless challenges and triumphs, all
            driven by a passion for innovation and an unwavering commitment to
            excellence. From humble beginnings, we have become a trusted name in
            delivering solutions that transform lives. Our story is one of
            growth, determination, and an unrelenting pursuit of a better future
            for all.
          </p>
        </div>
        <div className="story-video">
          <video autoPlay loop muted>
            <source src={video1} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="about-us-call-to-action">
        <h2>Join Us</h2>
        <p>
          Be a part of our journey! <a href="/sign-up">Sign up today</a> or{" "}
          <a href="/contact">contact us</a> to learn how we can help you achieve
          your goals.
        </p>
      </section>
    </div>
  );
}

export default AboutUs;
