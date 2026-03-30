// src/pages/Home.jsx
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/AboutUs";
import PopularRentals from "../components/PopRentalsP";
import WhyChooseUs from "../components/WhyUsList";
import CallToAction from "../components/CallToAct";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <main>
        <About />
        <PopularRentals />
        <WhyChooseUs />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}