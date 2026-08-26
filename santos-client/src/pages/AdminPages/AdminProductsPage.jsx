import { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext.jsx';
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../config/api';

const inputClasses =
  'mt-2 w-full rounded-xl border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400';

const emptyForm = {
  productName: '',
  description: '',
  price: '',
  category: '',
  stock: 1,
  condition: 'used',
  status: 'available',
  images: '',
};

const AdminProductsPage = () => {
  const { user, token } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    getProducts({ limit: 100 })
      .then((data) => setProducts(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
    getCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product._id);
    setForm({
      productName: product.productName,
      description: product.description || '',
      price: product.price,
      category: product.category?._id || '',
      stock: product.stock,
      condition: product.condition,
      status: product.status,
      images: (product.images || []).join(', '),
    });
    setFormError('');
    setShowForm(true);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    const payload = {
      productName: form.productName,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock),
      condition: form.condition,
      status: form.status,
      images: form.images
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean),
    };

    if (!editingId) {
      payload.seller = user.id;
    }

    try {
      if (editingId) {
        await updateProduct(editingId, payload, token);
      } else {
        await createProduct(payload, token);
      }
      setShowForm(false);
      loadProducts();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProduct(id, token);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="border-y-2 border-zinc-900 bg-zinc-900 px-4 py-10 sm:px-6 lg:px-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-500">
          Admin Panel
        </p>
        <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">
          Manage Products
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
          Create, view, and edit products in the catalog.
        </p>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-zinc-600">{products.length} product(s)</p>
          <button
            onClick={openCreateForm}
            className="rounded-xl border-2 border-zinc-900 bg-zinc-900 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-50"
          >
            + Add Product
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {showForm && (
          <div className="mb-6 rounded-3xl border-2 border-zinc-900 bg-zinc-50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900">
              {editingId ? 'Edit Product' : 'New Product'}
            </h2>

            {formError && (
              <p className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
                {formError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-zinc-700">Product Name</label>
                <input
                  value={form.productName}
                  onChange={handleChange('productName')}
                  required
                  className={inputClasses}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-zinc-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={handleChange('description')}
                  rows={3}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700">Price (₱)</label>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={handleChange('price')}
                  required
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700">Stock</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange('stock')}
                  required
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700">Category</label>
                <select
                  value={form.category}
                  onChange={handleChange('category')}
                  required
                  className={inputClasses}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700">Condition</label>
                <select
                  value={form.condition}
                  onChange={handleChange('condition')}
                  className={inputClasses}
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700">Status</label>
                <select
                  value={form.status}
                  onChange={handleChange('status')}
                  className={inputClasses}
                >
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-zinc-700">
                  Image URLs (comma-separated)
                </label>
                <input
                  value={form.images}
                  onChange={handleChange('images')}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  className={inputClasses}
                />
              </div>

              <div className="flex gap-3 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-zinc-900 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-50 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-xl border-2 border-zinc-900 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-900"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && <p className="text-sm text-zinc-600">Loading products...</p>}

        {!loading && products.length === 0 && (
          <p className="text-sm text-zinc-600">No products yet.</p>
        )}

        {!loading && products.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="rounded-3xl border-2 border-zinc-900 bg-zinc-50 p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-zinc-900">{product.productName}</h3>
                  <span className="rounded-full bg-zinc-200 px-2 py-1 text-[10px] font-bold uppercase text-zinc-700">
                    {product.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  {product.category?.categoryName || 'Uncategorized'}
                </p>
                <p className="mt-3 text-lg font-bold text-zinc-900">
                  ₱{product.price.toLocaleString()}
                </p>
                <p className="text-xs text-zinc-600">Stock: {product.stock}</p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openEditForm(product)}
                    className="flex-1 rounded-xl border-2 border-zinc-900 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 rounded-xl border-2 border-red-600 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminProductsPage;