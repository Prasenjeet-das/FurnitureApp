import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer id="contact" className="bg-dark text-white mt-5 py-4">
      <div className="container">

        <div className="row">

          <div className="col-md-4">
            <h4>Furniture Shop</h4>
            <p>
              Premium Furniture for Modern Living.
            </p>
          </div>

          <div className="col-md-4">
            <h4>Quick Links</h4>

            <Link className="text-white text-decoration-none d-block mb-2" to="/">Home</Link>
            <Link className="text-white text-decoration-none d-block mb-2" to="/products">Products</Link>
            <Link className="text-white text-decoration-none d-block mb-2" to="/about">About</Link>
            <Link className="text-white text-decoration-none d-block" to="/login">Login</Link>
          </div>

          <div className="col-md-4">
            <h4>Contact</h4>

            <p>📧 support@furnitureshop.com</p>
            <p>📞 +919608212323</p>
            <p>📍 Fudkipur, Udhwa, Sahibganj, Jharkhand (816108)</p>
          </div>

        </div>

        <hr />

        <p className="text-center">
          © 2026 Furniture Shop | All Rights Reserved
        </p>

      </div>
    </footer>
  );
}

export default Footer;