import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {

  const navigate = useNavigate();

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);

  useEffect(() => {
    const loadDashboardCounts = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);

        setTotalProducts(productsResponse.data.length);
        setTotalCategories(categoriesResponse.data.length);
      } catch (error) {
        console.error("Error fetching dashboard counts:", error);
      }
    };

    loadDashboardCounts();
  }, []);

  return (
    <div className="container mt-5 mb-5">

      {/* Dashboard Heading */}

      <div className="text-center mb-5">

        <h2 className="fw-bold">
          Admin Dashboard
        </h2>

        <p className="text-muted">
          Manage your furniture shop
        </p>

      </div>


      {/* Statistics Cards */}

      <div className="row g-4 mb-5">

        {/* Total Products */}

        <div className="col-md-6">

          <div className="card shadow-sm h-100">

            <div className="card-body text-center p-4">

              <div className="fs-1 mb-2">
                📦
              </div>

              <h5 className="text-muted">
                Total Products
              </h5>

              <h2 className="fw-bold">
                {totalProducts}
              </h2>

            </div>

          </div>

        </div>


        {/* Total Categories */}

        <div className="col-md-6">

          <div className="card shadow-sm h-100">

            <div className="card-body text-center p-4">

              <div className="fs-1 mb-2">
                📂
              </div>

              <h5 className="text-muted">
                Total Categories
              </h5>

              <h2 className="fw-bold">
                {totalCategories}
              </h2>

            </div>

          </div>

        </div>

      </div>


      {/* Admin Actions */}

      <div className="row g-4 justify-content-center">

        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center p-4">
              <h4 className="mb-3">Manage Orders</h4>
              <p className="text-muted">
                View orders, inspect details and update order status.
              </p>
              <button
                className="btn btn-primary w-100"
                onClick={() => navigate("/admin/orders")}
              >
                Order Management
              </button>
            </div>
          </div>
        </div>

        {/* Add Product */}

        <div className="col-md-4">

          <div className="card shadow-sm h-100">

            <div className="card-body text-center p-4">

              <h4 className="mb-3">
                ➕ Add Product
              </h4>

              <p className="text-muted">
                Add a new furniture product with
                image, price, quantity and category.
              </p>

              <button
                className="btn btn-warning w-100"
                onClick={() =>
                  navigate("/admin/products")
                }
              >
                Add Product
              </button>

            </div>

          </div>

        </div>


        {/* Manage Products */}

        <div className="col-md-4">

          <div className="card shadow-sm h-100">

            <div className="card-body text-center p-4">

              <h4 className="mb-3">
                📋 Manage Products
              </h4>

              <p className="text-muted">
                View, edit, delete products and
                change product images.
              </p>

              <button
                className="btn btn-dark w-100"
                onClick={() =>
                  navigate("/admin/products")
                }
              >
                Manage Products
              </button>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;