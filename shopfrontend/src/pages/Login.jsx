import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (event) => {

    event.preventDefault();

    setError("");

    try {

      const response = await api.post("auth/login", {
        email: email,
        password: password
      });

      const token = response.data.token;

      // Save JWT token
      localStorage.setItem("token", token);

      // Get role from JWT
      const tokenData = JSON.parse(
        atob(token.split(".")[1])
      );

      const role = tokenData.role;

      // Save role
      localStorage.setItem("role", role);

      console.log("Login successful");
      console.log("Role:", role);

      // Redirect according to role
      if (role === "ROLE_ADMIN") {

        navigate("/admin");

      } else if (role === "ROLE_USER") {

        navigate("/");

      } else {

        setError("Invalid user role.");

        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }

    } catch (error) {

      console.error("Login Error:", error);

      setError("Invalid email or password.");

    }
  };

  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow">

            <div className="card-body p-4">

              <h2 className="text-center mb-4">
                Login
              </h2>

              {!showLoginForm ? (
                <div className="d-grid gap-3">
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => navigate("/register")}
                  >
                    New User - Register
                  </button>

                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => setShowLoginForm(true)}
                  >
                    Already Registered - Login
                  </button>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="alert alert-danger">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleLogin}>

                {/* Email */}

                <div className="mb-3">

                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                  />

                </div>

                {/* Password */}

                <div className="mb-3">

                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                  />

                </div>

                {/* Login Button */}

                <div className="d-grid">

                  <button
                    type="submit"
                    className="btn btn-warning"
                  >
                    Login
                  </button>

                </div>

                  </form>
                </>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;