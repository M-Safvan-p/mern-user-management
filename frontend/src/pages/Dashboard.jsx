import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { fetchUsers, deleteUser } from "../features/admin/adminSlice";
import UserModal from "../components/UserModal";

function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const adminState = useSelector((state) => state.admin);
  const users = adminState.users.filter((listedUser) => listedUser.role !== "admin");
  const loading = adminState.loading;
  const error = adminState.error;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((listedUser) => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      listedUser.name?.toLowerCase().includes(query) ||
      listedUser.email?.toLowerCase().includes(query)
    );
  });

  // Fetch users
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Delete user
  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (!isConfirmed) return;

    dispatch(deleteUser(id));
  };

  // Logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Welcome Admin {user?.name}</h2>
        <button onClick={handleLogout} style={styles.logout}>
          Logout
        </button>
      </div>

      <button
        style={styles.addBtn}
        onClick={() => {
          setEditUser(null);
          setOpenModal(true);
        }}
      >
        + Add User
      </button>

      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      {error && <p style={styles.error}>{error}</p>}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="3" style={styles.td}>
                  {searchTerm.trim() ? "No matching users found" : "No users found"}
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id}>
                  <td style={styles.td}>{u.name}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>
                    <button
                      style={{ ...styles.actionBtn, ...styles.editBtn }}
                      onClick={() => {
                        setEditUser(u);
                        setOpenModal(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                      onClick={() => handleDelete(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {openModal && (
        <UserModal
          user={editUser}
          onClose={() => setOpenModal(false)}
          refresh={() => dispatch(fetchUsers())}
        />
      )}
    </div>
  );
}

export default AdminDashboard;

const styles = {
  container: {
    padding: "30px",
    background: "#f4f6f9",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  logout: {
    padding: "8px 15px",
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  addBtn: {
    marginBottom: "15px",
    padding: "10px 15px",
    background: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  searchInput: {
    width: "100%",
    maxWidth: "360px",
    marginBottom: "15px",
    padding: "10px 12px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
  },

  th: {
    background: "#2c3e50",
    color: "#fff",
    padding: "12px",
    textAlign: "left",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
  },

  actionBtn: {
    marginRight: "10px",
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },

  editBtn: {
    background: "#3498db",
    color: "#fff",
  },

  deleteBtn: {
    background: "#e74c3c",
    color: "#fff",
  },

  error: {
    color: "red",
    marginBottom: "10px",
  },
};
