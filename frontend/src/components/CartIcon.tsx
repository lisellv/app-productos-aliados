import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function CartIcon() {
  const { itemCount } = useCart();

  return (
    <Link
      className="icon-button cart-icon"
      to="/cart"
      aria-label={`Ver productos a financiar, ${itemCount} artículos`}
      title="Ver productos a financiar"
    >
      <img src="/img/home/carrito.png" alt="" />
      <span className="cart-count">{itemCount}</span>
    </Link>
  );
}
