import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <h1>LensHire Camera Rentals</h1>
      <nav>
        <Link to="/">Home</Link> |
        <Link to="/catalog">Catalog</Link> |
        <Link to="/order">Order</Link> |
        <Link to="/form">Register</Link>
      </nav>
    </header>
  );
}