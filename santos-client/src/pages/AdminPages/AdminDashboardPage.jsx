import { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext.jsx';
import Button from '../../components/Button';
import {
  getProducts,
  getAllOrdersAdmin,
  getAllReviewsAdmin,
  getAllUsersAdmin,
} from '../../config/api';

const AdminDashboardPage = () => {
  const { token } = useAuth();

  const [stats, setStats] = useState({
    products: 0,
    ordersToConfirm: 0,
    reviews: 0,
    users: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoadingStats(true);
      try {
        const [productsRes, ordersRes, reviewsRes, usersRes] = await Promise.all([
          getProducts({ limit: 100 }),
          getAllOrdersAdmin(token),
          getAllReviewsAdmin(token),
          getAllUsersAdmin(token),
        ]);

        setStats({
          products: productsRes.data?.length || 0,
          ordersToConfirm: ordersRes.filter((o) => o.orderStatus === 'pending').length,
          reviews: reviewsRes.length,
          users: usersRes.length,
        });
      } catch (err) {
        console.error('Failed to load admin stats:', err.message);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [token]);

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="border-y-2 border-zinc-900 bg-zinc-900 px-4 py-10 sm:px-6 lg:px-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-500">
          Admin Panel
        </p>
        <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">
          Admin Dashboard
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
          Manage products, orders, reviews, and users across BulldogEx Shop.
        </p>
      </section>

      <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
            Store Overview
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Quick admin blocks</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border-2 border-zinc-900 bg-zinc-200 p-5">
            <p className="text-2xl font-bold text-zinc-900">
              {loadingStats ? '…' : stats.products}
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Products
            </p>
          </div>
          <div className="rounded-3xl border-2 border-zinc-900 bg-zinc-200 p-5">
            <p className="text-2xl font-bold text-zinc-900">
              {loadingStats ? '…' : stats.ordersToConfirm}
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Orders to Confirm
            </p>
          </div>
          <div className="rounded-3xl border-2 border-zinc-900 bg-zinc-200 p-5">
            <p className="text-2xl font-bold text-zinc-900">
              {loadingStats ? '…' : stats.reviews}
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Reviews
            </p>
          </div>
          <div className="rounded-3xl border-2 border-zinc-900 bg-zinc-200 p-5">
            <p className="text-2xl font-bold text-zinc-900">
              {loadingStats ? '…' : stats.users}
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Users
            </p>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-zinc-900 bg-zinc-900 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-500">
            Management
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-50">Admin tools</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article className="flex flex-col rounded-3xl border-2 border-zinc-700 bg-zinc-800 p-4">
            <h3 className="text-lg font-semibold text-zinc-50">Products</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Create, view, and edit products in the catalog.
            </p>
            <Button to="/admin/products" className="mt-4 mt-auto" variant="secondary">
              Manage Products
            </Button>
          </article>

          <article className="flex flex-col rounded-3xl border-2 border-zinc-700 bg-zinc-800 p-4">
            <h3 className="text-lg font-semibold text-zinc-50">Orders</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Confirm orders and mark them ready for claiming.
            </p>
            <Button to="/admin/orders" className="mt-4 mt-auto" variant="secondary">
              Manage Orders
            </Button>
          </article>

          <article className="flex flex-col rounded-3xl border-2 border-zinc-700 bg-zinc-800 p-4">
            <h3 className="text-lg font-semibold text-zinc-50">Reviews</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              View customer reviews and edit ratings or comments.
            </p>
            <Button to="/admin/reviews" className="mt-4 mt-auto" variant="secondary">
              Manage Reviews
            </Button>
          </article>

          <article className="flex flex-col rounded-3xl border-2 border-zinc-700 bg-zinc-800 p-4">
            <h3 className="text-lg font-semibold text-zinc-50">Users</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              View, edit, and set users active or inactive.
            </p>
            <Button to="/admin/users" className="mt-4 mt-auto" variant="secondary">
              Manage Users
            </Button>
          </article>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;