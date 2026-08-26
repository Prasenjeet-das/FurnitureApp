import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

function Profile() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {

    const fetchProfile = async () => {
        try {

          const response = await api.get("/users/profile");

  console.log("My Profile:", response.data);

  setUser(response.data);

} catch (error) {

  console.error("Profile Error:", error);

} finally {

  setLoading(false);

}
      
    };

    fetchProfile();

  }, [token]);

  const handleEdit = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    });
    setMessage("");
    setError("");
    setEditing(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await api.put("/users/profile", {
        ...formData,
        role: user.role,
      });
      setUser(response.data);
      setMessage("Profile updated successfully.");
      setEditing(false);
    } catch (saveError) {
      console.error("Profile update error:", saveError);
      setError(
        saveError.response?.status === 403
          ? "You are not authorized to update this profile. Please log in again."
          : "Unable to update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };


  if (!token) {
    return <Navigate to="/login" />;
  }


  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading Profile...</h4>
      </div>
    );
  }


  if (!user) {
    return (
      <div className="container mt-5">

        <div className="alert alert-danger">
          User profile not found.
        </div>

      </div>
    );
  }


  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <div className="card shadow">

            <div className="card-body p-4">

              <h2 className="text-center mb-4">My Account</h2>

              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              {editing ? (
                <form onSubmit={handleSave}>
                  <div className="mb-3">
                    <label htmlFor="profile-name" className="form-label fw-bold">
                      Name
                    </label>
                    <input
                      id="profile-name"
                      name="name"
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="profile-email" className="form-label fw-bold">
                      Email
                    </label>
                    <input
                      id="profile-email"
                      name="email"
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="profile-phone" className="form-label fw-bold">
                      Phone
                    </label>
                    <input
                      id="profile-phone"
                      name="phone"
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="shipping-address" className="form-label fw-bold">
                      Shipping Address
                    </label>
                    <textarea
                      id="shipping-address"
                      name="address"
                      className="form-control"
                      value={formData.address}
                      onChange={handleChange}
                      rows="4"
                      required
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success" disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setEditing(false)}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
              <div className="mb-3">

                <label className="form-label fw-bold">
                  Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={user.name || ""}
                  readOnly
                />

              </div>


              <div className="mb-3">

                <label className="form-label fw-bold">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  value={user.email || ""}
                  readOnly
                />

              </div>


              <div className="mb-3">

                <label className="form-label fw-bold">
                  Phone
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={user.phone || ""}
                  readOnly
                />

              </div>


              <div className="mb-3">

                <label className="form-label fw-bold">
                  Address
                </label>

                <textarea
                  className="form-control"
                  value={user.address || ""}
                  readOnly
                  rows="3"
                />

              </div>


              <div className="mb-3">

                <label className="form-label fw-bold">
                  Role
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={user.role || ""}
                  readOnly
                />

              </div>

              <button type="button" className="btn btn-warning w-100" onClick={handleEdit}>
                Edit Profile
              </button>
                </>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;