import Button from './Button';

const ProductCard = ({ product, index }) => {
  const imageUrl = product.images?.[0] || '/placeholder.png';

  return (
    <article className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-4">

      <div className="flex aspect-4/3 items-center justify-center rounded-[1.25rem] bg-zinc-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.productName}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
        {product.category?.categoryName} {String(index + 1).padStart(2, '0')}
      </p>

      <h3 className="mt-2 text-lg font-semibold text-zinc-900">
        {product.productName}
      </h3>

      <p className="mt-2 text-base font-bold text-zinc-900">
        ₱{product.price.toLocaleString()}
      </p>

      <p className="mt-3 text-sm leading-6 text-zinc-600">
        {product.description?.substring(0, 120)}...
      </p>

      <Button to={`/products/${product._id}`} className="mt-4">
        View Product
      </Button>
    </article>
  );
};

export default ProductCard;