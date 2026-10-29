import { Link } from "react-router-dom";
import { useCart } from "../context/ContextoCarrito";

export function CartIcon() {
  const { cantidadArticulos } = useCart();

  return (
    <Link
      className="icon-button cart-icon"
      to="/cart"
      aria-label={`Ver productos a financiar, ${cantidadArticulos} artículos`}
      title="Ver productos a financiar"
    >
      <img src="/img/home/carrito.png" alt="" />
      <span className="cart-count">{cantidadArticulos}</span>
    </Link>
  );
}
