export const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;

export const registerUser = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
};

export const getProducts = async (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== "" && v !== undefined && v !== null)
  ).toString();

  const res = await fetch(`${API_BASE_URL}/v1/product${query ? `?${query}` : ""}`);
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to load products");
  return data;
};

export const getProductById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/v1/product/${id}`);
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to load product");
  return data;
};

export const getCategories = async () => {
  const res = await fetch(`${API_BASE_URL}/category`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load categories");
  return data;
};

export const getProductReviews = async (productId) => {
  const res = await fetch(`${API_BASE_URL}/review/product/${productId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load reviews");
  return data;
};

export const createReview = async ({ product, rating, comment }, token) => {
  const res = await fetch(`${API_BASE_URL}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product, rating, comment }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to submit review");
  return data;
};

export const addToCart = async (userId, product, quantity, priceAtAddition, token) => {
  const res = await fetch(`${API_BASE_URL}/cart/${userId}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product, quantity, priceAtAddition }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add to cart");
  return data;
};

export const getMyCart = async (userId, token) => {
  const res = await fetch(`${API_BASE_URL}/cart/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return { items: [], totalPrice: 0 };
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load cart");
  return data;
};

export const getMyOrders = async (token) => {
  const res = await fetch(`${API_BASE_URL}/order`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load orders");
  return data;
};

export const createOrder = async (payload, token) => {
  const res = await fetch(`${API_BASE_URL}/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to place order");
  return data;
};

export const clearMyCart = async (userId, token) => {
  const res = await fetch(`${API_BASE_URL}/cart/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to clear cart");
  return data;
};

export const getUserProfile = async (userId, token) => {
  const res = await fetch(`${API_BASE_URL}/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load profile");
  return data;
};

export const updateProfile = async (userId, payload, token) => {
  const res = await fetch(`${API_BASE_URL}/user/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update profile");
  return data;
};

export const changePassword = async (userId, payload, token) => {
  const res = await fetch(`${API_BASE_URL}/user/${userId}/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to change password");
  return data;
};

// Admin: Products
export const createProduct = async (payload, token) => {
  const body = payload instanceof FormData ? payload : JSON.stringify(payload);
  const res = await fetch(`${API_BASE_URL}/v1/product`, {
    method: "POST",
    headers: {
      ...(payload instanceof FormData ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
    },
    body,
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to create product");
  return data;
};

export const updateProduct = async (id, payload, token) => {
  const body = payload instanceof FormData ? payload : JSON.stringify(payload);
  const res = await fetch(`${API_BASE_URL}/v1/product/${id}`, {
    method: "PUT",
    headers: {
      ...(payload instanceof FormData ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
    },
    body,
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to update product");
  return data;
};

export const deleteProduct = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/v1/product/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete product");
  return data;
};

// Admin: Orders
export const getAllOrdersAdmin = async (token) => {
  const res = await fetch(`${API_BASE_URL}/order`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load orders");
  return data;
};

export const updateOrderStatus = async (id, orderStatus, token) => {
  const res = await fetch(`${API_BASE_URL}/order/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ orderStatus }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update order");
  return data;
};

// Admin: Users
export const getAllUsersAdmin = async (token) => {
  const res = await fetch(`${API_BASE_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load users");
  return data;
};

export const setUserActive = async (id, isActive, token) => {
  const res = await fetch(`${API_BASE_URL}/user/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ isActive }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update user");
  return data;
};

export const updateUserAdmin = async (id, payload, token) => {
  const res = await fetch(`${API_BASE_URL}/user/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update user");
  return data;
};

// Admin: Reviews
export const getAllReviewsAdmin = async (token) => {
  const res = await fetch(`${API_BASE_URL}/review`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load reviews");
  return data;
};

export const deleteReviewAdmin = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/review/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete review");
  return data;
};

export const updateReviewAdmin = async (id, payload, token) => {
  const res = await fetch(`${API_BASE_URL}/review/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update review");
  return data;
};
