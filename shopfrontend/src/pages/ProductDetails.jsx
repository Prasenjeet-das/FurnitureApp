import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";
import api from "../services/api";

function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let isAdmin = localStorage.getItem("role") === "ROLE_ADMIN";

  if (token) {
    try {
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      isAdmin = String(tokenData.role || "")
        .replace(/^ROLE_/, "")
        .toUpperCase() === "ADMIN";
    } catch {
      isAdmin = false;
    }
  }

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [buying, setBuying] = useState(false);
  const [cartMessage, setCartMessage] = useState(null);
  const [wishlistMessage, setWishlistMessage] = useState(null);

  //this is used to add product to cart and show the message if product is added to cart or not
  const handleAddToCart = async () => {
    try {
      await addToCart(product, selectedQuantity);
      setCartMessage({ text: "Your item has been added to cart.", type: "success" });
    } catch (error) {
      console.error("Add to cart error:", error);
      setCartMessage({ text: "Unable to add item to cart.", type: "danger" });
    }
  };
//this is used to add product to wishlist and show the message if product is added to wishlist or not
  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(product);
      setWishlistMessage({
        text: "Your item has been added to wishlist.",
        type: "success",
      });
    } catch (error) {
      console.error("Add to wishlist error:", error);
      setWishlistMessage({
        text: "Unable to add item to wishlist.",
        type: "danger",
      });
    }
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const [productResponse, productsResponse] = await Promise.all([
          api.get(`/products/${id}`),
          api.get("/products"),
        ]);

        setProduct(productResponse.data);
        setRelatedProducts(
          productsResponse.data.filter((item) => item.id !== Number(id))
        );
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleBuyNow = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    setBuying(true);

    try {
      navigate("/checkout", {
        state: {
          buyNowProduct: product,
          buyNowQuantity: selectedQuantity,
        },
      });
    } catch (error) {
      console.error("Buy now error:", error);
    } finally {
      setBuying(false);
    }
  };

  if (loading) {

    return (
      <div className="container mt-5 text-center">

        <h4>
          Loading Product...
        </h4>

      </div>
    );
  }

  if (!product) {

    return (
      <div className="container mt-5 text-center">

        <h2>
          Product Not Found
        </h2>

      </div>
    );
  }

  return (

    <div className="container mt-5">

      <div className="row align-items-center">

        {/* Product Image */}

        <div className="col-md-6">

          <img
            src={product.imageUrl}
            alt={product.productName}
            className="img-fluid rounded shadow"
            style={{
              height: "450px",
              width: "100%",
              objectFit: "cover"
            }}
          />

        </div>

        {/* Product Information */}

        <div className="col-md-6">

          <h2 className="fw-bold">
            {product.productName}
          </h2>

          <h3 className="text-success mt-3">
            ₹{product.price.toLocaleString()}
          </h3>

          <p className="mt-3">
            {product.description}
          </p>

          <p>
            <strong>Category:</strong> {product.category}
          </p>

          <p>
            <strong>Quantity:</strong> {product.quantity}
          </p>

          <p>
            <strong>Rating:</strong> ⭐ 4.8
          </p>

          <span className="badge bg-success fs-6">
            In Stock
          </span>

          {/* Quantity Section */}

          <div className="card shadow-sm mt-3 p-3">

            <h5>
              Select Quantity
            </h5>

            <select
              className="form-select w-25 mb-3"
              value={selectedQuantity}
              onChange={(event) => setSelectedQuantity(Number(event.target.value))}
            >

              <option value="1">
                1
              </option>

              <option value="2">
                2
              </option>

              <option value="3">
                3
              </option>

              <option value="4">
                4
              </option>

              <option value="5">
                5
              </option>

            </select>

            <p className="mb-2">
              🚚 Free Delivery within 3-5 days
            </p>

            <p className="mb-3">
              🔄 7 Days Easy Return
            </p>

          </div>

          {/* Buttons */}

          <div className="d-grid gap-2 mt-3">

            <button
              className="btn btn-warning"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            {cartMessage && <div className={`alert alert-${cartMessage.type} py-2 mb-0`}>{cartMessage.text}</div>}

            <button
              className="btn btn-outline-danger"
              onClick={handleAddToWishlist}
            >
              ❤ Add to Wishlist
            </button>

            {wishlistMessage && (
              <div className={`alert alert-${wishlistMessage.type} py-2 mb-0`}>
                {wishlistMessage.text}
              </div>
            )}

            {!isAdmin && (
              <button
                className="btn btn-success"
                onClick={handleBuyNow}
                disabled={buying}
              >
                {buying ? "Opening Checkout..." : "Buy Now"}
              </button>
            )}

          </div>

        </div>

      </div>

      {/* Related Products */}

      <hr className="my-5" />

      <h3 className="fw-bold mb-4">
        Related Products
      </h3>

      <div className="row">

        {relatedProducts.map((item) => (

          <ProductCard
            key={item.id}
            id={item.id}
            name={item.productName}
            price={item.price}
            image={item.imageUrl}
          />

        ))}

      </div>

    </div>
  );
}

export default ProductDetails;