import Link from "next/link";
import Image from "next/image";
import NiceSelect from "@/components/layout/nice-select";
import type { Product } from "@/data/products";

/** The template's decorative card backdrop, lifted verbatim. */
function CardShape() {
  return (
        <svg width="292" height="162" viewBox="0 0 292 162" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 20C0 8.95431 8.95431 0 20 0H272C283.046 0 292 8.9543 292 20V95.3843C292 101.5 289.23 107.256 284.227 110.772C263.695 125.2 205.494 162 146 162C86.5063 162 28.3054 125.2 7.77321 110.772C2.76957 107.256 0 101.5 0 95.3843V20Z" fill="#F4F1EA"></path>
        </svg>
  );
}

const MAX_STARS = 5;

/** One product card, matching the template's .food-category-items-4 markup. */
export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="food-category-items-4">
      <div className="shape">
        <CardShape />
      </div>
      <div className="icon">
        <Link href={`/shop-details?id=${product.id}`} aria-label={`View ${product.name}`}>
          <i className="fa-solid fa-plus"></i>
        </Link>
        <div className="frame">
          <Image src="/assets/img/home-4/frame.png" alt="" width={30} height={39} />
        </div>
      </div>
      <div className="thumb">
        <Image src={product.image} alt={product.name} width={189} height={187} />
      </div>
      <div className="content">
        <div className="star" aria-label={`${product.rating} out of ${MAX_STARS} stars`}>
          {Array.from({ length: MAX_STARS }, (_, i) => (
            <i
              key={i}
              className={i < product.rating ? "fa-etch fa-solid fa-star" : "fa-light fa-star"}
            ></i>
          ))}
        </div>
        <h2 className="title">
          <Link href={`/shop-details?id=${product.id}`}>{product.name}</Link>
        </h2>
        <p>Find top-rated dinnerware, flatware and barware at Crimson Deli.</p>
        <div className="pricing-item">
          <div className="form-clt">
            <div className="form">
              <NiceSelect className="single-select w-100" options={product.sizes} />
            </div>
          </div>
          <span className="price">${'{'}product.price.toFixed(2){'}'}</span>
        </div>
      </div>
    </div>
  );
}
