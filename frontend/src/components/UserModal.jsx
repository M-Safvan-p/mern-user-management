import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  createUser,
  updateUser,
} from "../features/admin/adminSlice";

export default function UserModal({ user, onClose, refresh }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fill form if editing
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        role: user.role || "user",
      });
      return;
    }

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
    });
  }, [user]);

  //  Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); 
  };

  //  Validation
  const validate = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.email.trim()) return "Email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Invalid email format";
    }

    if (!user && !formData.password) {
      return "Password is required";
    }

    if (!user && formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return null;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      return setError(validationError);
    }

    try {
      setLoading(true);

      if (user) {
        const updatePayload = {
          name: formData.name,
          email: formData.email,
        };

        await dispatch(
          updateUser({ id: user._id, data: updatePayload })
        ).unwrap();
      } else {
        const createPayload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "user",
        };

        await dispatch(createUser(createPayload)).unwrap();
      }

      refresh();   // refresh list
      onClose();   // close modal only on success
    } catch (err) {
      setError(err || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>{user ? "Edit User" : "Add User"}</h3>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />

          {!user && (
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
            />
          )}

          <div style={styles.actions}>
            <button
              type="submit"
              style={styles.saveBtn}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              style={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
  },

  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
  },

  saveBtn: {
    background: "#2ecc71",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  cancelBtn: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  error: {
    color: "red",
    marginBottom: "10px",
    fontSize: "14px",
  },
};
