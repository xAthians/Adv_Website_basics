import AIcamera from "../assets/AI_camera.png";

export default function Hero() {
  return (
    <section className="hero">
      <img src={AIcamera} alt="Professional camera setup" />
      <div className="hero-text">
        <h2>Capture Your World</h2>
        <p>Picture perfect!</p>
      </div>
    </section>
  );
}