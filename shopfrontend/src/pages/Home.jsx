import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import bed from "../assets/image/bed.jpg";
import bed3 from "../assets/image/bed3.jpg";
import api from "../services/api";

const bedImages = [bed, bed3];

function Home() {
  const [products, setProducts] = useState([]);
  const [bedImageIndex, setBedImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const imageTimer = setInterval(() => {
      setBedImageIndex((currentIndex) => (currentIndex + 1) % bedImages.length);
    }, 4000);

    return () => clearInterval(imageTimer);
  }, []);

  return (
    <>
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(20,16,14,0.82) 0%, rgba(20,16,14,0.55) 38%, rgba(20,16,14,0.15) 62%, rgba(20,16,14,0.05) 100%), url(${bedImages[bedImageIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 0.8s ease-in-out",
          minHeight: "640px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h1 className="fw-bold" style={{ color: "#fff", textShadow: "0 2px 24px rgba(0,0,0,0.35)" }}>
                Premium Furniture
                <br />
                For Modern Living
              </h1>

              <p className="hero-copy" style={{ color: "rgba(255,255,255,0.88)" }}>
                Thoughtfully designed furniture for comfortable, beautiful,
                and welcoming modern homes.
              </p>

              <button className="btn btn-warning me-3" onClick={() => navigate("/products")}>
                Shop Now
              </button>

              <button className="btn btn-secondary" onClick={() => navigate("/about")}>
                Explore
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mt-5">

        <h2 style={{ color: "black" }}>Featured Products</h2>

        <div className="row">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.productName}
              price={product.price}
              image={product.imageUrl}
              featured
            />
          ))}
        </div>

        <section className="container py-5">
          <h2 className="text-center mb-5" style={{ color: "black" }}>
            Why Choose Us
          </h2>

          <div className="row text-center">
            <div className="col-md-3">
              <h1>🚚</h1>
              <h4>Free Delivery</h4>
              <p>Free shipping on all orders.</p>
            </div>

            <div className="col-md-3">
              <h1>💳</h1>
              <h4>Secure Payment</h4>
              <p>100% Safe Online Payment.</p>
            </div>

            <div className="col-md-3">
              <h1>⭐</h1>
              <h4>Premium Quality</h4>
              <p>Best quality furniture products.</p>
            </div>

            <div className="col-md-3">
              <h1>📞</h1>
              <h4>24×7 Support</h4>
              <p>Customer support anytime.</p>
            </div>
          </div>
        </section>

      </section>

      <Footer />
    </>
  );
}

export default Home;