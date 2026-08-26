import { useEffect, useState } from "react";
import api from "../services/api";

const statuses = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

function formatDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  return new Date(value).toLocaleDateString();
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (loadError) {
      console.error("Admin orders error:", loadError);
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadInitialOrders = async () => {
      try {
        const response = await api.get("/orders");
        if (active) {
          setOrders(Array.isArray(response.data) ? response.data : []);
        }
      } catch (loadError) {
        console.error("Admin orders error:", loadError);
        if (active) {
          setError("Unable to load orders.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadInitialOrders();

    return () => {
      active = false;
    };
  }, []);

  const updateStatus = async (order, status) => {
    setSavingId(order.id);
    setError("");
    setMessage("");

    try {
      const response = await api.put(`/orders/${order.id}`, {
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        orderNumber: order.orderNumber,
        orderDate: order.orderDate,
        productName: order.productName,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        phoneNumber: order.phoneNumber,
        status,
      });

      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder.id === order.id ? response.data : currentOrder
        )
      );
      setSelectedOrder((currentOrder) =>
        currentOrder?.id === order.id ? response.data : currentOrder
      );
      setMessage("Order status updated successfully.");
    } catch (updateError) {
      console.error("Order status update error:", updateError);
      setError("Unable to update order status.");
    } finally {
      setSavingId(null);
    }
  };

  const totalRevenue = orders.reduce(
    (total, order) => total + (Number(order.totalPrice) || 0),
    0
  );
  const cancelledOrders = orders.filter((order) => order.status === "CANCELLED").length;
  const activeOrders = orders.length - cancelledOrders;

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Order Management</h1>
        <button type="button" className="btn btn-outline-dark" onClick={loadOrders}>
          Refresh Orders
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="row g-3 mb-4">
        <div className="col-md-3"><div className="card shadow-sm"><div className="card-body"><h6>Total Orders</h6><h3>{orders.length}</h3></div></div></div>
        <div className="col-md-3"><div className="card shadow-sm"><div className="card-body"><h6>Active Orders</h6><h3>{activeOrders}</h3></div></div></div>
        <div className="col-md-3"><div className="card shadow-sm"><div className="card-body"><h6>Cancelled</h6><h3>{cancelledOrders}</h3></div></div></div>
        <div className="col-md-3"><div className="card shadow-sm"><div className="card-body"><h6>Order Value</h6><h3>₹{totalRevenue.toLocaleString()}</h3></div></div></div>
      </div>

      {loading && <p>Loading orders...</p>}
      {!loading && !orders.length && <div className="alert alert-info">No orders found.</div>}

      {!loading && orders.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Product</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNumber || `ORDER-${order.id}`}</td>
                  <td>{order.customerName || order.customerEmail || "Unknown"}</td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td>{order.productName}</td>
                  <td>{order.quantity}</td>
                  <td>₹{Number(order.totalPrice).toLocaleString()}</td>
                  <td>
                    <select
                      className="form-select"
                      value={order.status || "PLACED"}
                      onChange={(event) => updateStatus(order, event.target.value)}
                      disabled={savingId === order.id}
                    >
                      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                  <td>
                    <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => setSelectedOrder(order)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h3>Order Details</h3>
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelectedOrder(null)} />
            </div>
            <p><strong>Order:</strong> {selectedOrder.orderNumber || `ORDER-${selectedOrder.id}`}</p>
            <p><strong>Customer:</strong> {selectedOrder.customerName || selectedOrder.customerEmail}</p>
            <p><strong>Email:</strong> {selectedOrder.customerEmail || "Not available"}</p>
            <p><strong>Phone:</strong> {selectedOrder.phoneNumber || "Not available"}</p>
            <p><strong>Date:</strong> {formatDate(selectedOrder.orderDate)}</p>
            <p><strong>Product:</strong> {selectedOrder.productName}</p>
            <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
            <p><strong>Total:</strong> ₹{Number(selectedOrder.totalPrice).toLocaleString()}</p>
            <p><strong>Status:</strong> {selectedOrder.status || "PLACED"}</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminOrders;
