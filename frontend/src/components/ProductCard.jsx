import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartContextValue';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const image = product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
  const stock = product.countInStock ?? product.stock ?? 0;
  const rating = product.rating ?? product.ratings ?? 0;
  const reviewCount = product.numReviews ?? 0;

  return (
    <article className="store-product-card">
      <Link to={`/product/${product._id}`} className="store-product-card__image">
        <img src={image} alt={product.name} />
      </Link>
      <div className="store-product-card__body">
        <p>{product.brand || 'Amazon marketplace'}</p>
        <Link to={`/product/${product._id}`}><h3>{product.name}</h3></Link>
        <div className="store-product-card__rating"><FaStar /> {rating} <span>({reviewCount})</span></div>
        <strong>₹{Number(product.price || 0).toLocaleString('en-IN')}</strong>
        <small className={stock > 0 ? 'in-stock' : 'out-stock'}>{stock > 0 ? 'In stock' : 'Currently unavailable'}</small>
        <button type="button" onClick={() => addToCart(product)} disabled={stock <= 0}>
          <FaShoppingCart /> {stock > 0 ? 'Add to cart' : 'Unavailable'}
        </button>
      </div>
      <style>{`
        .store-product-card { display: flex; flex-direction: column; overflow: hidden; background: #fff; border-radius: .75rem; border: 1px solid #e1e4e7; transition: transform .2s ease, box-shadow .2s ease; }
        .store-product-card:hover { transform: translateY(-4px); box-shadow: 0 10px 24px rgba(0,0,0,.12); }
        .store-product-card__image { height: 210px; display: grid; place-items: center; padding: 1.25rem; background: #f7f8f8; }
        .store-product-card__image img { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; }
        .store-product-card__body { display: flex; flex: 1; flex-direction: column; align-items: flex-start; padding: 1rem; }
        .store-product-card__body > p { margin-bottom: .4rem; color: #687078; font-size: .72rem; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; }
        .store-product-card h3 { min-height: 2.7em; color: #131921; font-size: .97rem; line-height: 1.35; }
        .store-product-card__rating { margin: .7rem 0 .35rem; color: #c45500; font-size: .88rem; } .store-product-card__rating span { color: #5f6670; }
        .store-product-card strong { font-size: 1.35rem; color: #131921; } .store-product-card small { margin: .35rem 0 .75rem; }
        .in-stock { color: #067d62; } .out-stock { color: #b12704; }
        .store-product-card button { width: 100%; margin-top: auto; min-height: 38px; border: 1px solid #fcd200; border-radius: 999px; background: #ffd814; color: #131921; cursor: pointer; font-weight: 700; }
        .store-product-card button:hover:not(:disabled) { background: #f7ca00; } .store-product-card button:disabled { opacity: .55; cursor: not-allowed; }
      `}</style>
    </article>
  );
};

export default ProductCard;
