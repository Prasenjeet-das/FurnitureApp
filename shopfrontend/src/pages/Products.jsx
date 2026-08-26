import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import api from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (fetchError) {
        console.error("Error fetching products:", fetchError);
        setError("Unable to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [...new Set(
    products.map((product) => product.category).filter(Boolean)
  )].sort();

  const filteredProducts = products
    .filter((product) => {
      const productName = product.productName?.toLowerCase() || "";
      const category = product.category || "";
      const price = Number(product.price) || 0;
      const minimum = minPrice === "" ? 0 : Number(minPrice);
      const maximum = maxPrice === "" ? Infinity : Number(maxPrice);

      return (
        productName.includes(searchTerm.toLowerCase().trim()) &&
        (!selectedCategory || category === selectedCategory) &&
        price >= minimum &&
        price <= maximum
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

  return (
    <>
      <main className="container py-5">
        <h1 className="mb-4">All Products</h1>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-lg-4">
                <label htmlFor="product-search" className="form-label">
                  Search Products
                </label>
                <input
                  id="product-search"
                  type="search"
                  className="form-control"
                  placeholder="Search by product name"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <div className="col-md-4 col-lg-2">
                <label htmlFor="product-category" className="form-label">
                  Category
                </label>
                <select
                  id="product-category"
                  className="form-select"
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 col-lg-2">
                <label htmlFor="minimum-price" className="form-label">
                  Minimum Price
                </label>
                <input
                  id="minimum-price"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="₹ Min"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                />
              </div>

              <div className="col-md-4 col-lg-2">
                <label htmlFor="maximum-price" className="form-label">
                  Maximum Price
                </label>
                <input
                  id="maximum-price"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="₹ Max"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                />
              </div>

              <div className="col-md-6 col-lg-2">
                <label htmlFor="product-sort" className="form-label">
                  Sort By
                </label>
                <select
                  id="product-sort"
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
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading && <p>Loading products...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && filteredProducts.length === 0 && (
          <p>
            {products.length === 0
              ? "No products available."
              : "No products match your filters."}
          </p>
        )}

        <div className="row">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.productName}
              price={product.price}
              image={product.imageUrl}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Products;