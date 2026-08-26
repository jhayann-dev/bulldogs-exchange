import { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext.jsx';
import { getAllOrdersAdmin, updateOrderStatus } from '../../config/api';

const statusColors = {
  pending: 'bg-zinc-200 text-zinc-700',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-yellow-100 text-yellow-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const AdminOrdersPage = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadOrders = () => {
    setLoading(true);
    getAllOrdersAdmin(token)
      .then((data) => setOrders(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setError('');
    try {
      const updated = await updateOrderStatus(orderId, newStatus, token);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updated : o))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o) => o.orderStatus === filter);

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="border-y-2 border-zinc-900 bg-zinc-900 px-4 py-10 sm:px-6 lg:px-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-500">
          Admin Panel
        </p>
        <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">
          Manage Orders
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
          Confirm orders and mark them ready for claiming.
        </p>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full border-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition ${
                filter === s
                  ? 'border-zinc-900 bg-zinc-900 text-zinc-50'
                  : 'border-zinc-300 text-zinc-600 hover:border-zinc-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading && <p className="text-sm text-zinc-600">Loading orders...</p>}

        {!loading && filteredOrders.length === 0 && (
          <p className="text-sm text-zinc-600">No orders found.</p>
        )}

        {!loading && filteredOrders.length > 0 && (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="rounded-3xl border-2 border-zinc-900 bg-zinc-50 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="mt-1 text-xs text-zinc-600">
                      {order.user?.firstName} {order.user?.lastName} · {order.user?.email}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${statusColors[order.orderStatus]}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs text-zinc-700">
                  {order.items.map((item, idx) => (
                    <p key={idx}>
                      {item.quantity}x {item.product?.productName || 'Product'} — ₱
                      {(item.priceAtAddition * item.quantity).toLocaleString()}
                    </p>
                  ))}
                </div>

                <div className="mt-3 grid gap-1 text-xs text-zinc-600 sm:grid-cols-2">
                  <p><span className="font-semibold">Total:</span> ₱{order.totalAmount.toLocaleString()}</p>
                  <p><span className="font-semibold">Payment:</span> {order.paymentMethod} ({order.paymentStatus})</p>
                  <p className="sm:col-span-2"><span className="font-semibold">Pickup/Shipping:</span> {order.shippingAddress}</p>
                  <p className="sm:col-span-2"><span className="font-semibold">Placed:</span> {new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    disabled={order.orderStatus !== 'pending' || updatingId === order._id}
                    onClick={() => handleStatusChange(order._id, 'processing')}
                    className="rounded-xl border-2 border-zinc-900 bg-zinc-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Confirm Order
                  </button>
                  <button
                    disabled={order.orderStatus !== 'processing' || updatingId === order._id}
                    onClick={() => handleStatusChange(order._id, 'shipped')}
                    className="rounded-xl border-2 border-zinc-900 bg-yellow-500 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Ready for Claiming
                  </button>
                  <button
                    disabled={order.orderStatus !== 'shipped' || updatingId === order._id}
                    onClick={() => handleStatusChange(order._id, 'delivered')}
                    className="rounded-xl border-2 border-zinc-900 bg-green-500 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Mark Claimed
                  </button>
                  <button
                    disabled={['delivered', 'cancelled'].includes(order.orderStatus) || updatingId === order._id}
                    onClick={() => handleStatusChange(order._id, 'cancelled')}
                    className="rounded-xl border-2 border-red-600 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Cancel
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

export default AdminOrdersPage;