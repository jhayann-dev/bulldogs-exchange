import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import banner from '../../assets/img/nu_bulldogex_banner.jpg';
import { useAuth } from '../../context/authContext.jsx';
import { getMyCart, createOrder, clearMyCart, getMyOrders } from '../../config/api';

const orderStatusColors = {
  pending: 'bg-zinc-200 text-zinc-700',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-yellow-100 text-yellow-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const OrdersPage = () => {
  const { user, token } = useAuth();

  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [cartLoading, setCartLoading] = useState(true);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Pickup');
  const [checkoutError, setCheckoutError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  const loadCart = () => {
    setCartLoading(true);
    getMyCart(user.id, token)
      .then((data) => setCart(data))
      .catch(() => setCart({ items: [], totalPrice: 0 }))
      .finally(() => setCartLoading(false));
  };

  const loadOrders = () => {
    setOrdersLoading(true);
    getMyOrders(token)
      .then((data) => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  };

  useEffect(() => {
    loadCart();
    loadOrders();
  }, []);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setCheckoutError('');

    if (cart.items.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }

    setPlacingOrder(true);
    try {
      await createOrder(
        {
          items: cart.items.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
            priceAtAddition: item.priceAtAddition,
          })),
          totalAmount: cart.totalPrice,
          shippingAddress,
          paymentMethod,
        },
        token
      );

      await clearMyCart(user.id, token);
      setShippingAddress('');
      loadCart();
      loadOrders();
    } catch (err) {
      setCheckoutError(err.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  const pendingCount = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'processing').length;
  const shippedCount = orders.filter((o) => o.orderStatus === 'shipped').length;
  const deliveredCount = orders.filter((o) => o.orderStatus === 'delivered').length;

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="relative min-h-[20rem] overflow-hidden border-y-2 border-zinc-900 bg-zinc-900 px-4 py-10 sm:px-6 lg:px-8">
        <img src={banner} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-zinc-900/45" />

        <div className="relative z-10 flex min-h-[14rem] items-center">
          <div className="max-w-xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-200">
              My Account
            </p>
            <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">
              Order Ongoing
            </h1>
            <p className="mt-4 text-sm leading-7 text-zinc-100 sm:text-base">
              Review your cart, checkout, and track orders waiting for pickup.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
            Order Overview
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Quick order blocks</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border-2 border-zinc-900 bg-yellow-500 p-5">
            <p className="text-2xl font-bold text-zinc-900">{cart.items.length}</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              In Cart
            </p>
          </div>
          <div className="rounded-3xl border-2 border-zinc-900 bg-yellow-500 p-5">
            <p className="text-2xl font-bold text-zinc-900">{pendingCount}</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Pending
            </p>
          </div>
          <div className="rounded-3xl border-2 border-zinc-900 bg-yellow-500 p-5">
            <p className="text-2xl font-bold text-zinc-900">{shippedCount}</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Ready for Pickup
            </p>
          </div>
          <div className="rounded-3xl border-2 border-zinc-900 bg-yellow-500 p-5">
            <p className="text-2xl font-bold text-zinc-900">{deliveredCount}</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Completed
            </p>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-zinc-900 bg-blue-900 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-50">
            Cart
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-50">Checkout</h2>
        </div>

        {cartLoading && <p className="text-sm text-zinc-200">Loading cart...</p>}

        {!cartLoading && cart.items.length === 0 && (
          <div className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-6">
            <p className="text-sm leading-6 text-zinc-600">
              Your cart is empty. Add items from the product page first.
            </p>
            <Button to="/products" className="mt-4" variant="primary">
              Browse Products
            </Button>
          </div>
        )}

        {!cartLoading && cart.items.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.product._id} className="flex items-center justify-between rounded-2xl border-2 border-zinc-700 bg-zinc-800 p-4">
                  <div>
                    <p className="font-semibold text-zinc-50">{item.product.productName}</p>
                    <p className="text-sm text-zinc-400">
                      Qty {item.quantity} × ₱{item.priceAtAddition.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-bold text-yellow-500">
                    ₱{(item.priceAtAddition * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-4">
                <p className="font-semibold text-zinc-50">Total</p>
                <p className="text-lg font-bold text-yellow-500">₱{cart.totalPrice.toLocaleString()}</p>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-6">
              {checkoutError && (
                <p className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
                  {checkoutError}
                </p>
              )}

              <label className="mb-2 block text-xs font-medium text-zinc-700">Pickup / Shipping Details</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows={3}
                required
                placeholder="e.g. Pickup at NU CCIT building, or delivery address"
                className="mb-4 w-full rounded-xl border-2 border-zinc-900 bg-zinc-50 px-4 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
              />

              <label className="mb-2 block text-xs font-medium text-zinc-700">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mb-4 w-full rounded-xl border-2 border-zinc-900 bg-zinc-50 px-4 py-2 text-sm text-zinc-900 outline-none"
              >
                <option>Cash on Pickup</option>
                <option>GCash</option>
                <option>Bank Transfer</option>
              </select>

              <Button type="submit" variant="primary" className="w-full rounded-xl" disabled={placingOrder}>
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </Button>
            </form>
          </div>
        )}
      </section>

      <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
            Order History
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Your orders</h2>
        </div>

        {ordersLoading && <p className="text-sm text-zinc-600">Loading orders...</p>}
        {!ordersLoading && orders.length === 0 && (
          <p className="text-sm text-zinc-600">No orders placed yet.</p>
        )}

        {!ordersLoading && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="rounded-2xl border-2 border-zinc-900 bg-zinc-100 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-zinc-900">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${orderStatusColors[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <p className="mt-2 text-xs text-zinc-600">
                  {order.items.length} item(s) · ₱{order.totalAmount.toLocaleString()} · {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default OrdersPage;