import { useState } from "react";
import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";

function ProductCard({ id, name, price, image, featured = false }) {
  const { addToCart } = useCart();
  const [message, setMessage] = useState(null);

  const handleAddToCart = async () => {
    try {
      await addToCart({ id, name, price, image });
      setMessage({ text: "Your item has been added to cart.", type: "success" });
    } catch (error) {
      console.error("Add to cart error:", error);
      setMessage({ text: "Unable to add item to cart.", type: "danger" });
    }
  };

  return (
    <div className="col-lg-3 col-md-6 mb-4">

      <div className="card h-100 shadow-sm">

        <div className={`product-image-box${featured ? " featured-image" : ""}`}>
          <img
            src={image}
            className="card-img-top"
            alt={name}
            style={{ height: "230px", objectFit: "cover" }}
          />
        </div>

        <div className="card-body text-center">

          <h5 className="card-title">
            {name}
          </h5>

          <h4 className="text-success">
            ₹ {price}
          </h4>

          <button
            type="button"
            className="btn btn-warning w-100 mb-2"
            onClick={handleAddToCart}
          >
            Add To Cart
          </button>

          {message && <div className={`alert alert-${message.type} py-2 mb-2`}>{message.text}</div>}

          <Link
            to={`/product/${id}`}
            className="btn btn-outline-dark w-100"
          >
            View Details
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;