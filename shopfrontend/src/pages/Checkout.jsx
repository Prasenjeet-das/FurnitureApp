import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import api from "../services/api";

function getCurrentUserName() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || payload.email || null;
  } catch {
    return null;
  }
}

function isAdminUser(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return String(payload.role || "")
      .replace(/^ROLE_/, "")
      .toUpperCase() === "ADMIN";
  } catch {
    return false;
  }
}

function Checkout() {
  const { cartItems, cartLoading, clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [address, setAddress] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const token = localStorage.getItem("token");
  const buyNowProduct = location.state?.buyNowProduct;
  const buyNowQuantity = location.state?.buyNowQuantity || 1;
  const checkoutItems = buyNowProduct
    ? [{
      ...buyNowProduct,
      name: buyNowProduct.productName || buyNowProduct.name,
      quantity: buyNowQuantity,
    }]
    : cartItems;
  const isBuyNow = Boolean(buyNowProduct);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/users/profile");
        setProfile(response.data);
        setAddress(response.data.address || "");
      } catch (profileError) {
        console.error("Checkout profile error:", profileError);
        setError("Unable to load your shipping address.");
      } finally {
        setLoadingProfile(false);
      }
    };

    if (token) {
      loadProfile();
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isAdminUser(token)) {
    return <Navigate to="/products" replace />;
  }

  const subtotal = checkoutItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryCharge = subtotal > 0 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryCharge;

  const createOrders = async (method) => {
    const customerName = profile?.name || getCurrentUserName();
    const customerEmail = profile?.email || getCurrentUserName();
    const orderNumber = `ORD-${Date.now()}`;

    await Promise.all(
      checkoutItems.map((item) =>
        api.post("/orders", {
          customerName,
          customerEmail,
          orderNumber,
          productName: item.name || item.productName,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
          phoneNumber: profile?.phone || "",
          paymentMethod: method,
          status: "PLACED",
        })
      )
    );

    if (!isBuyNow) {
      await clearCart();
    }
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (cartLoading || loadingProfile || placingOrder || paymentLoading) {
      return;
    }

    if (!checkoutItems.length) {
      setError("Your cart is empty.");
      return;
    }

    if (!address.trim()) {
      setError("Please enter a shipping address.");
      return;
    }

    if (address.trim().length < 10) {
      setError("Please enter a complete shipping address.");
      return;
    }

    if (checkoutItems.some((item) => Number(item.price) <= 0 || item.quantity < 1)) {
      setError("Your cart contains an invalid product or quantity.");
      return;
    }

    if (!Number.isFinite(total) || total <= 0) {
      setError("Unable to calculate the order total.");
      return;
    }

    setPlacingOrder(true);

    if (paymentMethod === "COD") {
      try {
        await createOrders("COD");
        setSuccess("Order placed successfully. Pay cash when your order is delivered.");
      } catch (orderError) {
        console.error("Cash on delivery order error:", orderError);
        setError("Unable to place your order. Please try again.");
      } finally {
        setPlacingOrder(false);
      }
      return;
    }

    setPaymentLoading(true);

    try {
      const response = await api.post("/payments/order", {
        amount: Math.round(total * 100),
      });

      if (!window.Razorpay) {
        throw new Error("Razorpay Checkout is not loaded.");
      }

      const razorpay = new window.Razorpay({
        key: response.data.keyId,
        amount: response.data.amount,
        currency: response.data.currency,
        name: "Furniture Shop",
        description: "Furniture purchase",
        order_id: response.data.orderId,
        ...(paymentMethod === "QR" && {
          config: {
            display: {
              blocks: {
                upi: {
                  name: "UPI / QR Code",
                  instruments: [{ method: "upi" }],
                },
              },
              sequence: ["block.upi"],
              preferences: { show_default_blocks: false },
            },
          },
        }),
        prefill: {
          name: profile?.name || "",
          email: profile?.email || getCurrentUserName(),
          contact: profile?.phone || "",
        },
        handler: async (paymentResponse) => {
          try {
            await api.post("/payments/verify", {
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
              amount: Math.round(total * 100),
            });

            await createOrders(paymentMethod);
            setSuccess(
              `${paymentMethod === "QR" ? "QR payment" : "Payment"} successful. Order placed successfully.`
            );
          } catch (verificationError) {
            console.error("Payment verification error:", verificationError);
            setError("Payment verification failed. Your order was not placed.");
          } finally {
            setPaymentLoading(false);
            setPlacingOrder(false);
          }
        },
        modal: {
          ondismiss: () => {
            setError("Payment cancelled. Your order was not placed.");
            setPaymentLoading(false);
            setPlacingOrder(false);
          },
        },
      });

      razorpay.on("payment.failed", (paymentError) => {
        console.error("Razorpay payment failed:", paymentError);
        setError("Payment failed. Please try again.");
        setPaymentLoading(false);
        setPlacingOrder(false);
      });

      razorpay.open();
    } catch (paymentError) {
      console.error("Payment order error:", paymentError);
      setError(
        paymentError.response?.data || "Unable to start payment. Please try again."
      );
      setPaymentLoading(false);
    } finally {
      if (!window.Razorpay) {
        setPlacingOrder(false);
      }
    }
  };

  return (
    <main className="container py-5">
      <h1 className="mb-4">Checkout</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && (
        <div className="alert alert-success">
          {success} You can continue shopping.
          <button
            type="button"
            className="btn btn-sm btn-success ms-3"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      )}

      {!success && (
        <div className="row g-4">
          <div className="col-lg-7">
            <section className="card shadow-sm h-100">
              <div className="card-body">
                <h4 className="mb-3">Cart Summary</h4>
                {cartLoading ? (
                  <p>Loading cart...</p>
                ) : checkoutItems.length === 0 ? (
                  <div className="alert alert-info mb-0">Your cart is empty.</div>
                ) : (
                  checkoutItems.map((item) => (
                    <div
                      className="d-flex justify-content-between border-bottom py-3"
                      key={item.id}
                    >
                      <div>
                        <strong>{item.name || item.productName}</strong>
                        <div className="text-muted">
                          {item.quantity} x ₹{item.price.toLocaleString()}
                        </div>
                      </div>
                      <strong>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </strong>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="col-lg-5">
            <form onSubmit={handlePlaceOrder}>
              <section className="card shadow-sm mb-4">
                <div className="card-body">
                  <h4 className="mb-3">Shipping Address</h4>
                  {loadingProfile ? (
                    <p>Loading address...</p>
                  ) : (
                    <textarea
                      className="form-control"
                      rows="4"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      placeholder="Enter your shipping address"
                      required
                    />
                  )}
                </div>
              </section>

              <section className="card shadow-sm">
                <div className="card-body">
                  <h4>Payment Method</h4>
                  <div className="vstack gap-2 mb-4">
                    {[
                      ["COD", "Cash on Delivery", "Pay with cash when your order arrives."],
                      ["ONLINE", "Online Payment", "Pay securely with card, UPI, or net banking."],
                      ["QR", "UPI QR Code", "Scan a QR code to complete your payment."],
                    ].map(([value, label, description]) => (
                      <label className="border rounded p-3" key={value}>
                        <span className="d-flex align-items-start gap-2">
                          <input
                            className="form-check-input mt-1"
                            type="radio"
                            name="paymentMethod"
                            value={value}
                            checked={paymentMethod === value}
                            onChange={(event) => setPaymentMethod(event.target.value)}
                          />
                          <span>
                            <strong>{label}</strong>
                            <small className="d-block text-muted">{description}</small>
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
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
                      ₹{deliveryCharge.toLocaleString()}
                    </span>
                  </p>
                  <hr />
                  <h5>
                    Total
                    <span className="float-end">₹{total.toLocaleString()}</span>
                  </h5>
                  <button
                    type="submit"
                    className="btn btn-success w-100 mt-3"
                    disabled={placingOrder || loadingProfile || !checkoutItems.length}
                  >
                    {placingOrder
                      ? paymentMethod === "COD" ? "Placing Order..." : "Opening Payment..."
                      : paymentMethod === "COD" ? "Place Order" : "Pay Securely"}
                  </button>
                </div>
              </section>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Checkout;
