import { useCart } from "../context/useCart";
import CartItem from "../components/CartItem";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartLoading } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryCharge = subtotal > 0 ? Math.round(subtotal * 0.1) : 0;

  const total = subtotal + deliveryCharge;

  return (
    <div className="container mt-5">

      <h2 className="mb-4">Shopping Cart</h2>

      {cartLoading && <p>Loading cart...</p>}

      {cartItems.length === 0 ? (
        <div className="alert alert-info">
          Your cart is empty.
        </div>
      ) : (
        <div className="row">

          {/* Left Side */}
          <div className="col-lg-8">

            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                product={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}

          </div>

          {/* Right Side */}

          <div className="col-lg-4">

            <div className="card shadow">

              <div className="card-body">

                <h4>Order Summary</h4>

                <hr />

                <p>
                  Subtotal
                  <span className="float-end">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </p>

                <p>
                  Delivery (10%)
                  <span className="float-end">
                    ₹{deliveryCharge}
                  </span>
                </p>

                <hr />

                <h5>
                  Total
                  <span className="float-end">
                    ₹{total.toLocaleString()}
                  </span>
                </h5>

                <button
                  className="btn btn-success w-100 mt-3"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Cart;