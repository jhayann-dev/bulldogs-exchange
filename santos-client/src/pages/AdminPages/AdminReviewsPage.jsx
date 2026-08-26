import { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext.jsx';
import { getAllReviewsAdmin, updateReviewAdmin } from '../../config/api';

const inputClasses =
  'mt-2 w-full rounded-xl border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400';

const AdminReviewsPage = () => {
  const { token } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadReviews = () => {
    setLoading(true);
    getAllReviewsAdmin(token)
      .then((data) => setReviews(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const openEditForm = (review) => {
    setEditingId(review._id);
    setForm({ rating: review.rating, comment: review.comment || '' });
    setFormError('');
  };

  const closeEditForm = () => {
    setEditingId(null);
    setForm({ rating: 5, comment: '' });
    setFormError('');
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    try {
      await updateReviewAdmin(
        editingId,
        { rating: Number(form.rating), comment: form.comment },
        token
      );
      closeEditForm();
      loadReviews();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="border-y-2 border-zinc-900 bg-zinc-900 px-4 py-10 sm:px-6 lg:px-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-500">
          Admin Panel
        </p>
        <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">
          Manage Reviews
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
          View customer reviews and edit ratings or comments as needed.
        </p>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-zinc-600">{reviews.length} review(s)</p>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading && <p className="text-sm text-zinc-600">Loading reviews...</p>}

        {!loading && reviews.length === 0 && (
          <p className="text-sm text-zinc-600">No reviews yet.</p>
        )}

        {!loading && reviews.length > 0 && (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="rounded-3xl border-2 border-zinc-900 bg-zinc-50 p-5"
              >
                {editingId === review._id ? (
                  <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                    {formError && (
                      <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 sm:col-span-2">
                        {formError}
                      </p>
                    )}

                    <div>
                      <label className="text-xs font-medium text-zinc-700">Rating (1-5)</label>
                      <select
                        value={form.rating}
                        onChange={handleChange('rating')}
                        className={inputClasses}
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-zinc-700">Comment</label>
                      <textarea
                        value={form.comment}
                        onChange={handleChange('comment')}
                        rows={3}
                        className={inputClasses}
                      />
                    </div>

                    <div className="flex gap-3 sm:col-span-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 rounded-xl bg-zinc-900 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-50 disabled:opacity-60"
                      >
                        {saving ? 'Saving...' : 'Update Review'}
                      </button>
                      <button
                        type="button"
                        onClick={closeEditForm}
                        className="flex-1 rounded-xl border-2 border-zinc-900 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-900"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">
                          {review.product?.productName || 'Product'}
                        </p>
                        <p className="mt-1 text-xs text-zinc-600">
                          {review.user?.firstName} {review.user?.lastName}
                        </p>
                      </div>
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-yellow-800">
                        {review.rating} / 5
                      </span>
                    </div>

                    {review.comment && (
                      <p className="mt-3 text-sm text-zinc-700">{review.comment}</p>
                    )}

                    <p className="mt-2 text-xs text-zinc-500">
                      {new Date(review.createdAt).toLocaleString()}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => openEditForm(review)}
                        className="flex-1 rounded-xl border-2 border-zinc-900 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-900 sm:flex-none sm:px-8"
                      >
                        Edit
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminReviewsPage;