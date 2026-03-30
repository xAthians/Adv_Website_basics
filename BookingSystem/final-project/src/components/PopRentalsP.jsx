
import CanonCamera from "../assets/Canon_camera.jpg";
import SonyCamera from "../assets/Sony_camera.jpg";
import CanonLens from "../assets/Canon_lense.jpg";

export default function PopularRentals() {
  return (
    <section>
      <h2 className="black-h2">Popular Rentals</h2>
      <div className="products">
        <article>
          <h3>Canon EOS 5D Mark IV</h3>
          <figure>
            <img src={CanonCamera} alt="Canon EOS 5D Mark IV" />
          </figure>
          <p>Perfect for professional shoots with stunning image quality.</p>
        </article>

        <article>
          <h3>Sony A7 III</h3>
          <figure>
            <img src={SonyCamera} alt="Sony A7 III" />
          </figure>
          <p>Compact, versatile, and ideal for travel photography.</p>
        </article>

        <article>
          <h3>Canon EF 70-200mm f/2.8</h3>
          <figure>
            <img src={CanonLens} alt="Canon EF 70-200mm lens" />
          </figure>
          <p>Capture distant subjects with precision and clarity.</p>
        </article>
      </div>
    </section>
  );
}