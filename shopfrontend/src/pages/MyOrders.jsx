import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import api from "../services/api";

function getToken() {
  return localStorage.getItem("token");
}

function groupOrders(orders) {
  return Object.values(
    orders.reduce((groups, order) => {
      const key = order.orderNumber || `ORDER-${order.id}`;
      const group = groups[key] || {
        orderNumber: key,
        orderDate: order.orderDate,
        status: order.status,
        total: 0,
        items: [],
        itemIds: [],
      };

      group.items.push(order);
      group.itemIds.push(order.id);
      group.total += Number(order.totalPrice) || 0;
      group.status = group.items.every(
        (item) => item.status === "CANCELLED"
      )
        ? "CANCELLED"
        : group.items[0].status || "PLACED";
      groups[key] = group;
      return groups;
    }, {})
  );
}

function formatDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  return new Date(value).toLocaleDateString();
}

function MyOrders() {
  const token = getToken();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await api.get("/orders/my");
        setOrders(groupOrders(Array.isArray(response.data) ? response.data : []));
      } catch (loadError) {
        console.error("My orders error:", loadError);
        setError("Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadOrders();
    }
  }, [token]);

  const handleCancelOrder = async (order) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    setCancelling(order.orderNumber);
    setError("");

    try {
      await api.put(`/orders/group/${order.orderNumber}/cancel`);
      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder.orderNumber === order.orderNumber
            ? { ...currentOrder, status: "CANCELLED" }
            : currentOrder
        )
      );
    } catch (cancelError) {
      console.error("Cancel order error:", cancelError);
      setError("Unable to cancel this order.");
    } finally {
      setCancelling("");
    }
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="container py-5">
      <h1 className="mb-4">My Orders</h1>
      {loading && <p>Loading orders...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && orders.length === 0 && (
        <div className="alert alert-info">You have not placed any orders yet.</div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Order</th>
                <th>Order Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderNumber}>
                  <td>{order.orderNumber}</td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td>{order.items.reduce((count, item) => count + item.quantity, 0)}</td>
                  <td>₹{order.total.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${order.status === "CANCELLED" ? "bg-danger" : "bg-success"}`}>
                      {order.status || "PLACED"}
                    </span>
                  </td>
                  <td className="d-flex gap-2">
                    <Link className="btn btn-outline-dark btn-sm" to={`/orders/${order.orderNumber}`}>
                      View Details
                    </Link>
                    {order.status !== "CANCELLED" && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleCancelOrder(order)}
                        disabled={cancelling === order.orderNumber}
                      >
                        {cancelling === order.orderNumber ? "Cancelling..." : "Cancel Order"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default MyOrders;
