import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUsersAPI,
  deleteUserAPI,
  createUserAPI,
  updateUserAPI,
} from "./adminAPI";

// FETCH USERS
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUsersAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

// DELETE USER
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await deleteUserAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

// CREATE USER
export const createUser = createAsyncThunk(
  "admin/createUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createUserAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

// UPDATE USER
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateUserAPI(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

// SLICE
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.users ?? [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      })

      // DELETE
      .addCase(deleteUser.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = (state.users || []).filter((u) => u._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete user";
      })

      // CREATE
      .addCase(createUser.pending, (state) => {
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users = state.users || [];
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload || "Failed to create user";
      })

      // UPDATE
      .addCase(updateUser.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.users = (state.users || []).map((u) =>
          u._id === action.payload._id ? action.payload : u,
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload || "Failed to update user";
      });
  },
});

export default adminSlice.reducer;
