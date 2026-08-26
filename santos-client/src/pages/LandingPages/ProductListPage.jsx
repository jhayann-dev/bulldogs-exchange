import { useState, useEffect } from 'react';
import Button from '../../components/Button.jsx';
import ProductList from '../../components/ProductList.jsx';
import { getProducts, getCategories } from '../../config/api';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : data.data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');

    const timeout = setTimeout(() => {
      getProducts({ search, category })
        .then((data) => setProducts(data.data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, category]);

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="border-y-2 border-zinc-900 bg-blue-900 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-900">
          Products
        </p>
        <h1 className="max-w-xl text-3xl font-bold leading-tight text-yellow-500 sm:text-4xl">
          Shop campus essentials in a simple product grid
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-50 sm:text-base">
          Browse practical items for class, study, commute, and everyday campus routines.
        </p>
        <div className="mt-6">
          <Button to="/">Back Home</Button>
        </div>
      </section>

      <section className="border-y-2 border-zinc-900 bg-yellow-500 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
            Featured Products
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Product card grid</h2>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border-2 border-zinc-900 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 sm:max-w-xs"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border-2 border-zinc-900 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none sm:w-auto"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.categoryName}>
                {cat.categoryName}
              </option>
            ))}
          </select>

          {(search || category) && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategory('');
              }}
              className="text-xs font-semibold uppercase tracking-widest text-zinc-700 underline underline-offset-2 hover:text-zinc-900"
            >
              Clear Filters
            </button>
          )}
        </div>

        {loading && <p className="text-sm text-zinc-700">Loading products...</p>}
        {error && <p className="text-sm text-red-700">Error: {error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="text-sm text-zinc-700">No products found.</p>
        )}
        {!loading && !error && products.length > 0 && <ProductList products={products} />}
      </section>
    </div>
  );
};

export default ProductListPage;