import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { useAuth } from '../../context/authContext.jsx';
import { getProducts, getCategories, getAllOrdersAdmin } from '../../config/api';
import banner from '../../assets/img/nu_bulldogex_banner.jpg';

const categoryImageMap = {
  Electronics: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
  Books: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80',
  Clothing: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
};
const defaultCategoryImage =
  'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=800&q=80';

const HomePage = () => {
    const { token, hasRole } = useAuth();

    const [categories, setCategories] = useState([]);
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

                setCategories(categoriesRes || []);
                setStats({
                    products: productsRes.data?.length || 0,
                    categories: categoriesRes.length || 0,
                    orders: ordersRes ? ordersRes.length : null,
                });
            } catch (err) {
                console.error('Failed to load homepage stats:', err.message);
            } finally {
                setLoadingStats(false);
            }
        };

        loadStats();
    }, [token, hasRole]);

    return (
        <div className="flex w-full flex-col gap-6">
            <section className="relative min-h-[28rem] overflow-hidden border-y-2 border-zinc-900 bg-zinc-900 px-4 py-10 sm:px-6 lg:px-8">
                <img
                    src={banner}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-zinc-900/45" />

                <div className="relative z-10 flex min-h-[22rem] items-start justify-end text-right sm:min-h-[24rem]">
                    <div className="max-w-xl">
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-200">
                            Campus Marketplace
                        </p>
                        <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">
                            Welcome to BulldogEx Shop
                        </h1>
                        <p className="mt-4 text-sm leading-7 text-zinc-100 sm:text-base">
                            Explore campus uniforms, student essentials, and school merch in one
                            quick storefront.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-end gap-3">
                            <Button to="/products">
                                Shop Now
                            </Button>
                            <Button to="/about" variant="primary">
                                About Store
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mb-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                        Store Overview
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Quick shopping blocks</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-3xl border-2 border-zinc-900 bg-yellow-500 p-5">
                        <p className="text-2xl font-bold text-zinc-900">
                            {loadingStats ? '…' : String(stats.products).padStart(2, '0')}
                        </p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                            Products
                        </p>
                    </div>
                    <div className="rounded-3xl border-2 border-zinc-900 bg-yellow-500 p-5">
                        <p className="text-2xl font-bold text-zinc-900">
                            {loadingStats ? '…' : String(stats.categories).padStart(2, '0')}
                        </p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                            Categories
                        </p>
                    </div>
                    <div className="rounded-3xl border-2 border-zinc-900 bg-yellow-500 p-5">
                        <p className="text-2xl font-bold text-zinc-900">
                            {loadingStats ? '…' : stats.orders !== null ? String(stats.orders).padStart(2, '0') : '24'}
                        </p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                            Orders
                        </p>
                    </div>
                    <div className="rounded-3xl border-2 border-zinc-900 bg-yellow-500 p-5">
                        <p className="text-2xl font-bold text-zinc-900">03</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                            Pickup Slots
                        </p>
                    </div>
                </div>
            </section>

            <section className="border-y-2 border-zinc-900 bg-blue-900 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mb-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-50">
                        Shop Sections
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-zinc-50">Simple store cards</h2>
                </div>

                {loadingStats && (
                    <p className="text-sm text-zinc-200">Loading categories...</p>
                )}

                {!loadingStats && categories.length === 0 && (
                    <p className="text-sm text-zinc-200">No categories yet.</p>
                )}

                {!loadingStats && categories.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-3">
                        {categories.map((cat) => (
                            <article
                                key={cat._id}
                                className="flex flex-col rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-4"
                            >
                                <div className="flex aspect-4/3 items-center justify-center rounded-[1.25rem] bg-zinc-200 overflow-hidden">
                                    <img
                                        src={categoryImageMap[cat.categoryName] || defaultCategoryImage}
                                        alt={cat.categoryName}
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                </div>

                                <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                                    {cat.categoryName}
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-zinc-600">
                                    {cat.description}
                                </p>
                                <Button
                                    to={`/products?category=${cat._id}`}
                                    className="mt-4 mt-auto"
                                    variant="primary"
                                >
                                    Shop {cat.categoryName}
                                </Button>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;