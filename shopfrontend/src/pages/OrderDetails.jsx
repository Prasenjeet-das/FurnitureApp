import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import api from "../services/api";

function OrderDetails() {
  const { orderNumber } = useParams();
  const token = localStorage.getItem("token");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await api.get("/orders/my");
        const matchingItems = response.data.filter(
          (order) => (order.orderNumber || `ORDER-${order.id}`) === orderNumber
        );
        setItems(matchingItems);
      } catch (loadError) {
        console.error("Order details error:", loadError);
        setError("Unable to load order details.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadOrder();
    }
  }, [orderNumber, token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const total = items.reduce(
    (sum, item) => sum + (Number(item.totalPrice) || 0),
    0
  );
  const orderStatus = items.length > 0 && items.every(
    (item) => item.status === "CANCELLED"
  ) ? "CANCELLED" : items[0]?.status || "PLACED";

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Order Details</h1>
        <Link className="btn btn-outline-dark" to="/orders">Back to Orders</Link>
      </div>

      {loading && <p>Loading order...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && items.length === 0 && (
        <div className="alert alert-warning">Order not found.</div>
      )}

      {!loading && !error && items.length > 0 && (
        <section className="card shadow-sm">
          <div className="card-body">
            <h4>{orderNumber}</h4>
            <p className="text-muted">
              Order Date: {new Date(items[0].orderDate).toLocaleDateString()}
            </p>
            <p>
              Status: <span className={`badge ${orderStatus === "CANCELLED" ? "bg-danger" : "bg-success"}`}>
                {orderStatus}
              </span>
            </p>
            <hr />
            {items.map((item) => (
              <div className="d-flex justify-content-between border-bottom py-3" key={item.id}>
                <span>{item.productName} x {item.quantity}</span>
                <strong>₹{Number(item.totalPrice).toLocaleString()}</strong>
              </div>
            ))}
            <h5 className="text-end mt-3">Total: ₹{total.toLocaleString()}</h5>
          </div>
        </section>
      )}
    </main>
  );
}

export default OrderDetails;
