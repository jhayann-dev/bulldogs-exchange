import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { useAuth } from '../../context/authContext.jsx';
import { getProducts, getCategories, getAllOrdersAdmin } from '../../config/api';
import logo from '../../assets/img/nubdexchange_logo.png';
import NUShirt1 from '../../assets/img/NUShirt1.png';
import baller from '../../assets/img/baller.jpg';
import cap from '../../assets/img/cap.png';
import jacket from '../../assets/img/jacket.png';

const AboutPage = () => {
  const { token, hasRole } = useAuth();

  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: null,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoadingStats(true);
      try {
        const calls = [getProducts({ limit: 100 }), getCategories()];
        if (hasRole('admin')) {
          calls.push(getAllOrdersAdmin(token));
        }

        const [productsRes, categoriesRes, ordersRes] = await Promise.all(calls);

        setStats({
          products: productsRes.data?.length || 0,
          categories: categoriesRes.length || 0,
          orders: ordersRes ? ordersRes.length : null,
        });
      } catch (err) {
        console.error('Failed to load about page stats:', err.message);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [token, hasRole]);

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="border-y-2 border-zinc-900 bg-yellow-500 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="rounded-3xl border-2 border-dashed border-zinc-300 bg-blue-900 p-6">
            <div className="flex min-h-72 items-center justify-center rounded-[1.25rem] bg-zinc-200">
              <img src={logo} alt="BulldogEx" className="h-100 w-100 rounded-full border-2 border-zinc-900 bg-zinc-50 object-contain" />
            </div>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
              About Store
            </p>
            <h1 className="max-w-xl text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl">
              A campus shop focused on useful products and simple ordering.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-600 sm:text-base">
              BulldogEx Shop keeps the low-fidelity layout system while presenting clear
              product categories, quick actions, and straightforward store information.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button to="/" variant="primary">
                Back Home
              </Button>
              <Button to="/products">Open Products</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
            Store Overview
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Quick store blocks</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border-2 border-zinc-900 bg-blue-900 p-5">
            <p className="text-2xl font-bold text-zinc-50">
              {loadingStats ? '…' : String(stats.products).padStart(2, '0')}
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-50">
              Items
            </p>
          </div>
          <div className="rounded-3xl border-2 border-zinc-900 bg-blue-900 p-5">
            <p className="text-2xl font-bold text-zinc-50">
              {loadingStats ? '…' : String(stats.categories).padStart(2, '0')}
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-50">
              Categories
            </p>
          </div>
          <div className="rounded-3xl border-2 border-zinc-900 bg-blue-900 p-5">
            <p className="text-2xl font-bold text-zinc-50">03</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-50">
              Pickup Slots
            </p>
          </div>
          <div className="rounded-3xl border-2 border-zinc-900 bg-blue-900 p-5">
            <p className="text-2xl font-bold text-zinc-50">
              {loadingStats ? '…' : stats.orders !== null ? String(stats.orders).padStart(2, '0') : '24'}
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-50">
              Orders
            </p>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-zinc-900 bg-yellow-500 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
              Store Flow
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Stacked shopping wireframe</h2>

            <div className="mt-6 space-y-4">
              <article className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-5">
                <h3 className="text-lg font-semibold text-zinc-900">Curated Catalog</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Products are grouped by daily need so shoppers can scan faster.
                </p>
              </article>

              <article className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-5">
                <h3 className="text-lg font-semibold text-zinc-900">Simple Checkout</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Product pages keep price, stock, and action buttons easy to find.
                </p>
              </article>

              <article className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-5">
                <h3 className="text-lg font-semibold text-zinc-900">Pickup Ready</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Store information stays direct for students who need quick order updates.
                </p>
              </article>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-zinc-900 bg-blue-900 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-500">
              Category Grid
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="flex aspect-square items-center justify-center rounded-[1.25rem] bg-zinc-200">
                <img src={NUShirt1} alt="NU Shirt 1" className="border-2 border-zinc-900 bg-zinc-100 rounded-[1.25rem] transition-transform duration-500 hover:scale-110"/>
              </div>
              <div className="flex aspect-square items-center justify-center rounded-[1.25rem] bg-zinc-200">
                <img src={baller} alt="NU Baller" className="border-2 border-zinc-900 bg-zinc-100 rounded-[1.25rem] transition-transform duration-500 hover:scale-110"/>
              </div>
              <div className="flex aspect-square items-center justify-center rounded-[1.25rem] bg-zinc-200">
                <img src={cap} alt="NU Cap" className="border-2 border-zinc-900 bg-zinc-100 rounded-[1.25rem] transition-transform duration-500 hover:scale-110"/>
              </div>
              <div className="flex aspect-square items-center justify-center rounded-[1.25rem] bg-zinc-200">
                <img src={jacket} alt="NU Jacket" className="border-2 border-zinc-900 bg-zinc-100 rounded-[1.25rem] transition-transform duration-500 hover:scale-110"/>
              </div>
            </div>
            <Button to="/products" className="mt-5">View Products</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;