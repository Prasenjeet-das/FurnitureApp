import { useEffect, useState } from "react";
import api from "../services/api";

function AdminProducts() {

  // =========================================================
  // PRODUCT FORM STATES
  // =========================================================

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  // =========================================================
  // EDIT STATE
  // =========================================================

  const [editingProductId, setEditingProductId] =
    useState(null);

  // =========================================================
  // CURRENT IMAGE
  // =========================================================

  const [currentImage, setCurrentImage] =
    useState("");

  // =========================================================
  // UI STATES
  // =========================================================

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // PRODUCT LIST
  // =========================================================

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] =
    useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  const categories = [...new Set(
    products.map((product) => product.category).filter(Boolean)
  )].sort();

  const filteredProducts = products
    .filter((product) => {
      const productName = product.productName?.toLowerCase() || "";
      const productCategory = product.category || "";
      const productPrice = Number(product.price) || 0;
      const minimum = minPrice === "" ? 0 : Number(minPrice);
      const maximum = maxPrice === "" ? Infinity : Number(maxPrice);

      return (
        productName.includes(searchTerm.toLowerCase().trim()) &&
        (!selectedCategory || productCategory === selectedCategory) &&
        productPrice >= minimum &&
        productPrice <= maximum
      );
    })
    .sort((firstProduct, secondProduct) => {
      if (sortBy === "price-low") {
        return Number(firstProduct.price) - Number(secondProduct.price);
      }

      if (sortBy === "price-high") {
        return Number(secondProduct.price) - Number(firstProduct.price);
      }

      if (sortBy === "name") {
        return firstProduct.productName.localeCompare(secondProduct.productName);
      }

      return 0;
    });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
  };

  // =========================================================
  // OPEN ADD PRODUCT FORM
  // =========================================================

  const handleOpenForm = () => {

    setEditingProductId(null);

    setProductName("");
    setDescription("");
    setPrice("");
    setQuantity("");
    setCategory("");
    setImage(null);
    setCurrentImage("");

    setMessage("");
    setError("");

    setShowForm(true);
  };

  // =========================================================
  // CLOSE FORM
  // =========================================================

  const handleCloseForm = () => {

    setShowForm(false);

    setEditingProductId(null);

    setProductName("");
    setDescription("");
    setPrice("");
    setQuantity("");
    setCategory("");
    setImage(null);
    setCurrentImage("");

    setMessage("");
    setError("");
  };

  // =========================================================
  // EDIT PRODUCT
  // =========================================================

  const handleEdit = (product) => {

    setEditingProductId(product.id);

    setProductName(
      product.productName || ""
    );

    setDescription(
      product.description || ""
    );

    setPrice(
      product.price || ""
    );

    setQuantity(
      product.quantity || ""
    );

    setCategory(
      product.category || ""
    );

    // Current image
    setCurrentImage(
      product.imageUrl || ""
    );

    // New image initially empty
    setImage(null);

    setMessage("");
    setError("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =========================================================
  // IMAGE SELECT
  // =========================================================

  const handleImageChange = (event) => {

    const selectedImage =
      event.target.files[0];

    setImage(selectedImage);
  };

  // =========================================================
  // ADD / UPDATE PRODUCT
  // =========================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {

      // =====================================================
      // EDIT PRODUCT
      // =====================================================

      if (editingProductId) {

        // ---------------------------------------------------
        // UPDATE PRODUCT DETAILS
        // ---------------------------------------------------

        const productData = {

          productName:
            productName,

          description:
            description,

          price:
            Number(price),

          quantity:
            Number(quantity),

          category:
            category,

          imageUrl:
            currentImage
        };

        await api.put(
          `/products/${editingProductId}`,
          productData
        );

        // ---------------------------------------------------
        // CHANGE IMAGE IF NEW IMAGE SELECTED
        // ---------------------------------------------------

        if (image) {

          const formData =
            new FormData();

          formData.append(
            "file",
            image
          );
          const token = localStorage.getItem("token");
          await api.post(
            `/products/${editingProductId}/image`,
            formData,
            {
              headers: {
              Authorization: `Bearer ${token}`
            }
           }
          );
        }

        // ---------------------------------------------------
        // SUCCESS MESSAGE
        // ---------------------------------------------------

        if (image) {

          setMessage(
            "Product and image updated successfully!"
          );

        } else {

          setMessage(
            "Product updated successfully!"
          );
        }
      }

      // =====================================================
      // ADD NEW PRODUCT
      // =====================================================

      else {

        // ---------------------------------------------------
        // IMAGE REQUIRED
        // ---------------------------------------------------

        if (!image) {

          setError(
            "Please select a product image."
          );

          setLoading(false);

          return;
        }

        // ---------------------------------------------------
        // PRODUCT DATA
        // ---------------------------------------------------

        const productData = {

          productName:
            productName,

          description:
            description,

          price:
            Number(price),

          quantity:
            Number(quantity),

          category:
            category,

          imageUrl:
            ""
        };

        // ---------------------------------------------------
        // CREATE PRODUCT
        // ---------------------------------------------------

        const productResponse =
          await api.post(
            "/products",
            productData
          );

        const productId =
          productResponse.data.id;

        // ---------------------------------------------------
        // UPLOAD IMAGE
        // ---------------------------------------------------

        const formData =
          new FormData();

        formData.append(
          "file",
          image
        );

        await api.post(
          `/products/${productId}/image`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data"
            }
          }
        );

        setMessage(
          "Product and image uploaded successfully!"
        );
      }

      // =====================================================
      // REFRESH PRODUCT LIST
      // =====================================================

      await fetchProducts();

      // =====================================================
      // CLOSE FORM
      // =====================================================

      setShowForm(false);

      setEditingProductId(null);

      setProductName("");
      setDescription("");
      setPrice("");
      setQuantity("");
      setCategory("");
      setImage(null);
      setCurrentImage("");

      event.target.reset();

    } catch (error) {

      console.error(
        "Product Operation Error:",
        error
      );

      if (error.response) {

        setError(
          error.response.data?.message ||
          error.response.data ||
          "Product operation failed."
        );

      } else {

        setError(
          "Unable to connect to server."
        );
      }

    } finally {

      setLoading(false);
    }
  };

  // =========================================================
  // DELETE PRODUCT
  // =========================================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(
        `/products/${id}`
      );

      setMessage(
        "Product deleted successfully."
      );

      await fetchProducts();

    } catch (error) {

      console.error(
        "Delete Product Error:",
        error
      );

      setError(
        "Unable to delete product."
      );
    }
  };

  return (

    <div className="container mt-5 mb-5">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2>
          Admin Products
        </h2>

        {!showForm && (

          <button
            className="btn btn-warning"
            onClick={handleOpenForm}
          >
            + Add Product
          </button>

        )}

      </div>

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {message && (

        <div className="alert alert-success">
          {message}
        </div>

      )}

      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (

        <div className="alert alert-danger">
          {error}
        </div>

      )}

      {/* =====================================================
          ADD / EDIT FORM
      ===================================================== */}

      {showForm && (

        <div className="row justify-content-center mb-5">

          <div className="col-md-8">

            <div className="card shadow">

              <div className="card-body p-4">

                {/* FORM HEADER */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <h3 className="mb-0">

                    {editingProductId
                      ? "Edit Product"
                      : "Add New Product"
                    }

                  </h3>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCloseForm}
                  >
                    Cancel
                  </button>

                </div>

                <form onSubmit={handleSubmit}>

                  {/* =================================================
                      PRODUCT NAME
                  ================================================= */}

                  <div className="mb-3">

                    <label className="form-label">
                      Product Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter product name"
                      value={productName}
                      onChange={(event) =>
                        setProductName(
                          event.target.value
                        )
                      }
                      required
                    />

                  </div>

                  {/* =================================================
                      DESCRIPTION
                  ================================================= */}

                  <div className="mb-3">

                    <label className="form-label">
                      Description
                    </label>

                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Enter product description"
                      value={description}
                      onChange={(event) =>
                        setDescription(
                          event.target.value
                        )
                      }
                      required
                    />

                  </div>

                  {/* =================================================
                      PRICE
                  ================================================= */}

                  <div className="mb-3">

                    <label className="form-label">
                      Price
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter price"
                      value={price}
                      onChange={(event) =>
                        setPrice(
                          event.target.value
                        )
                      }
                      required
                    />

                  </div>

                  {/* =================================================
                      QUANTITY
                  ================================================= */}

                  <div className="mb-3">

                    <label className="form-label">
                      Quantity
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter quantity"
                      value={quantity}
                      onChange={(event) =>
                        setQuantity(
                          event.target.value
                        )
                      }
                      required
                    />

                  </div>

                  {/* =================================================
                      CATEGORY
                  ================================================= */}

                  <div className="mb-3">

                    <label className="form-label">
                      Category
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter category"
                      value={category}
                      onChange={(event) =>
                        setCategory(
                          event.target.value
                        )
                      }
                      required
                    />

                  </div>

                  {/* =================================================
                      CURRENT IMAGE - EDIT MODE
                  ================================================= */}

                  {editingProductId &&
                    currentImage && (

                    <div className="mb-3">

                      <label className="form-label">
                        Current Product Image
                      </label>

                      <div>

                        <img
                          src={currentImage}
                          alt="Current Product"
                          style={{
                            width: "180px",
                            height: "140px",
                            objectFit: "cover",
                            borderRadius: "8px"
                          }}
                        />

                      </div>

                    </div>

                  )}

                  {/* =================================================
                      PRODUCT IMAGE
                  ================================================= */}

                  <div className="mb-4">

                    <label className="form-label">

                      {editingProductId
                        ? "Change Product Image"
                        : "Product Image"
                      }

                    </label>

                    <input
                      type="file"
                      className="form-control"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      required={!editingProductId}
                    />

                    <div className="form-text">

                      {editingProductId

                        ? "Leave empty to keep the current image. Select a new image to replace it."

                        : "JPG, PNG or WEBP image only. Maximum 5 MB."
                      }

                    </div>

                  </div>

                  {/* =================================================
                      SELECTED NEW IMAGE PREVIEW
                  ================================================= */}

                  {image && (

                    <div className="mb-4">

                      <p className="fw-bold mb-2">
                        New Image Preview
                      </p>

                      <img
                        src={URL.createObjectURL(image)}
                        alt="New Product"
                        style={{
                          width: "180px",
                          height: "140px",
                          objectFit: "cover",
                          borderRadius: "8px"
                        }}
                      />

                    </div>

                  )}

                  {/* =================================================
                      SUBMIT BUTTON
                  ================================================= */}

                  <div className="d-flex gap-2">

                    <button
                      type="submit"
                      className="btn btn-warning flex-grow-1"
                      disabled={loading}
                    >

                      {loading

                        ? "Saving..."

                        : editingProductId
                        ? "Update Product"
                        : "Add Product"

                      }

                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseForm}
                      disabled={loading}
                    >
                      Cancel
                    </button>

                  </div>

                </form>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          PRODUCT LIST
      ===================================================== */}

      <div className="mt-4">

        <h3 className="mb-4">
          Manage Products
        </h3>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-lg-4">
                <label htmlFor="admin-product-search" className="form-label">
                  Search Products
                </label>
                <input
                  id="admin-product-search"
                  type="search"
                  className="form-control"
                  placeholder="Search by product name"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <div className="col-md-4 col-lg-2">
                <label htmlFor="admin-product-category" className="form-label">
                  Category
                </label>
                <select
                  id="admin-product-category"
                  className="form-select"
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 col-lg-2">
                <label htmlFor="admin-minimum-price" className="form-label">
                  Minimum Price
                </label>
                <input
                  id="admin-minimum-price"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="₹ Min"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                />
              </div>

              <div className="col-md-4 col-lg-2">
                <label htmlFor="admin-maximum-price" className="form-label">
                  Maximum Price
                </label>
                <input
                  id="admin-maximum-price"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="₹ Max"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                />
              </div>

              <div className="col-md-6 col-lg-2">
                <label htmlFor="admin-product-sort" className="form-label">
                  Sort By
                </label>
                <select
                  id="admin-product-sort"
                  className="form-select"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              <div className="col-md-6 col-lg-2">
                <button type="button" className="btn btn-outline-secondary w-100" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {productsLoading ? (

          <div className="text-center">

            <h5>
              Loading Products...
            </h5>

          </div>

        ) : products.length === 0 ? (

          <div className="alert alert-info text-center">
            No products available.
          </div>

        ) : filteredProducts.length === 0 ? (

          <div className="alert alert-info text-center">
            No products match your filters.
          </div>

        ) : (

          <div className="row">

            {filteredProducts.map((product) => (

              <div
                className="col-lg-4 col-md-6 mb-4"
                key={product.id}
              >

                <div className="card h-100 shadow-sm">

                  {/* PRODUCT IMAGE */}

                  {product.imageUrl ? (

                    <img
                      src={product.imageUrl}
                      className="card-img-top"
                      alt={product.productName}
                      style={{
                        height: "220px",
                        objectFit: "cover"
                      }}
                    />

                  ) : (

                    <div
                      className="d-flex align-items-center justify-content-center bg-light"
                      style={{
                        height: "220px"
                      }}
                    >

                      <span className="text-muted">
                        No Image
                      </span>

                    </div>

                  )}

                  {/* PRODUCT DETAILS */}

                  <div className="card-body">

                    <h5 className="card-title">
                      {product.productName}
                    </h5>

                    <p className="card-text">
                      {product.description}
                    </p>

                    <p className="mb-1">
                      <strong>
                        Price:
                      </strong>{" "}
                      ₹ {product.price}
                    </p>

                    <p className="mb-1">
                      <strong>
                        Quantity:
                      </strong>{" "}
                      {product.quantity}
                    </p>

                    <p className="mb-3">
                      <strong>
                        Category:
                      </strong>{" "}
                      {product.category}
                    </p>

                    {/* EDIT */}

                    <button
                      className="btn btn-primary w-100 mb-2"
                      onClick={() =>
                        handleEdit(product)
                      }
                    >
                      Edit Product
                    </button>

                    {/* DELETE */}

                    <button
                      className="btn btn-danger w-100"
                      onClick={() =>
                        handleDelete(
                          product.id
                        )
                      }
                    >
                      Delete Product
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminProducts;