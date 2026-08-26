import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from '../../components/Button.jsx';
import { getProductById, getProductReviews, createReview, addToCart } from '../../config/api';
import { useAuth } from '../../context/authContext.jsx';

function ProductPage() {
  const { id } = useParams();
  const { user, token, hasRole } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [cartMessage, setCartMessage] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    getProductById(id)
      .then((json) => setProduct(json.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const loadReviews = () => {
    setReviewsLoading(true);
    getProductReviews(id)
      .then((data) => setReviews(data))
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setSubmitting(true);

    try {
      await createReview({ product: id, rating, comment }, token);
      setComment('');
      setRating(5);
      loadReviews();
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) return;
    setAddingToCart(true);
    setCartMessage('');
    try {
      await addToCart(user.id, product._id, 1, product.price, token);
      setCartMessage('Added to cart!');
    } catch (err) {
      setCartMessage(err.message);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full flex-col gap-6">
        <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <p className="text-zinc-600">Loading product...</p>
        </section>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex w-full flex-col gap-6">
        <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-zinc-900">Product not found</h1>
            <Button to="/products" className="mt-6">Back to Products</Button>
          </div>
        </section>
      </div>
    );
  }

  const imageUrl = product.images?.[0] || '/placeholder.png';
  const alreadyReviewed = user && reviews.some((r) => r.user?._id === user.id);

  return (
    <div className="flex w-full flex-col gap-6">

      <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-4">
            <Button to="/products">Back to Products</Button>
          </div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
            {product.category?.categoryName}
          </p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl">
            {product.productName}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-600">
            <span className="font-bold text-zinc-900">₱{product.price.toLocaleString()}</span>
            <span>{product.stock} in stock</span>
            <span className="capitalize">{product.condition}</span>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex aspect-4/3 items-center justify-center rounded-[1.25rem] border-2 border-zinc-900 bg-zinc-200 overflow-hidden">
            <img
              src={imageUrl}
              alt={product.productName}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>

          <div className="prose prose-sm max-w-none space-y-4 text-zinc-700">
            <p className="text-base leading-7 text-zinc-700 whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          {product.seller && (
            <p className="mt-4 text-sm text-zinc-500">
              Sold by {product.seller.firstName} {product.seller.lastName}
            </p>
          )}

          <div className="mt-8 border-t-2 border-zinc-900 pt-6">
            {user ? (
              <Button variant="primary" className="mr-3" onClick={handleAddToCart} disabled={addingToCart}>
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
            ) : (
              <Button to="/auth/signin" variant="primary" className="mr-3">Log In to Add to Cart</Button>
            )}
            <Button to="/products">Back to Products</Button>

            {cartMessage && <p className="mt-3 text-sm text-zinc-700">{cartMessage}</p>}
          </div>
        </div>
      </section>

      <section className="border-y-2 border-zinc-900 bg-blue-900 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-50">
            Reviews
          </p>
          <h2 className="mb-6 text-2xl font-semibold text-zinc-50">
            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
          </h2>

          {reviewsLoading && <p className="text-sm text-zinc-200">Loading reviews...</p>}

          {!reviewsLoading && reviews.length === 0 && (
            <p className="text-sm text-zinc-200">No reviews yet. Be the first to review this product.</p>
          )}

          {!reviewsLoading && reviews.length > 0 && (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="rounded-2xl border-2 border-zinc-700 bg-zinc-800 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-zinc-50">
                      {review.user?.firstName} {review.user?.lastName}
                    </p>
                    <span className="text-sm font-bold text-yellow-500">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-sm leading-6 text-zinc-300">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {hasRole('buyer') && !alreadyReviewed && (
            <form onSubmit={handleReviewSubmit} className="mt-8 rounded-2xl border-2 border-zinc-700 bg-zinc-800 p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-50">
                Write a review
              </h3>

              {reviewError && (
                <p className="mb-4 rounded-lg border border-red-400 bg-red-900/40 px-4 py-2 text-sm text-red-200">
                  {reviewError}
                </p>
              )}

              <label className="mb-2 block text-xs font-medium text-zinc-300">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="mb-4 w-full rounded-xl border-2 border-zinc-600 bg-zinc-900 px-4 py-2 text-sm text-zinc-50 outline-none"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                ))}
              </select>

              <label className="mb-2 block text-xs font-medium text-zinc-300">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Share your thoughts about this product..."
                className="mb-4 w-full rounded-xl border-2 border-zinc-600 bg-zinc-900 px-4 py-2 text-sm text-zinc-50 outline-none placeholder:text-zinc-500"
              />

              <Button type="submit" variant="secondary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          )}

          {!user && (
            <p className="mt-6 text-sm text-zinc-300">
              <a href="/auth/signin" className="font-semibold text-yellow-500 underline">Log in</a> to write a review.
            </p>
          )}

          {alreadyReviewed && (
            <p className="mt-6 text-sm text-zinc-300">You've already reviewed this product.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default ProductPage;