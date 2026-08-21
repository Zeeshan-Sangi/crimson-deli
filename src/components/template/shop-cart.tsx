/* Auto-converted from _template/shop-cart.html by scripts/html2jsx.mjs — do not hand-edit, re-run the script */
import Link from "next/link";
import Image from "next/image";
import NiceSelect from "@/components/layout/nice-select";

export default function ShopCart() {
  return (
    <>

                    {/* Breadcrumb Section Start */}
                    <div className="breadcrumb-wrapper hero-ptb image-distortion p-relative z-index-1" data-background="/_next/image?url=%2Fassets%2Fimg%2Fbreadcrumb-bg.jpg&w=1920&q=75">
                        <div className="shape-1 d-none d-xl-block">
                            <Image src="/assets/img/shape-1.png" alt="img" width={493} height={344} />
                        </div>
                        <div className="girl-shape d-none d-xl-block">
                            <Image src="/assets/img/girl-image.png" alt="img" width={319} height={320} />
                        </div>
                        <div className="bottom-shape">
                            <Image src="/assets/img/bottom-shape.png" alt="img" width={1918} height={15} />
                        </div>
                        <div className="container">
                            <div className="page-heading">
                                <div className="breadcrumb-sub-title">
                                    <h1 className="breadcrumb-title text-white split-title">Shop Cart</h1>
                                </div>
                                <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
                                    <li>
                                        <Link href="/">
                                            Home Page
                                        </Link>
                                    </li>
                                    <li>
                                        <i className="fa-regular fa-chevrons-right"></i>
                                    </li>
                                    <li>
                                    Shop Cart
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* cart section start */}
                    <div className="cart-section section-padding">
                        <div className="container">
                            <div className="cart-list-area">
                                <div className="table-responsive">
                                    <table className="table common-table">
                                        <thead>
                                            <tr>
                                                <th className="text-center">Product</th>
                                                <th className="text-center">Price</th>
                                                <th className="text-center">Quantity</th>
                                                <th className="text-center">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="align-items-center py-3">
                                                <td>
                                                    <div className="cart-item-thumb d-flex align-items-center gap-4">
                                                        <i className="fas fa-times"></i>
                                                        <Image className="w-100" src="/assets/img/inner-page/shop/shop-cart-01.png" alt="product" width={46} height={45} />
                                                        <span className="head text-nowrap">Fresh Cream</span>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <span className="price-usd">
                                                        $12.40 USD
                                                    </span>
                                                </td>
                                                <td className="price-quantity text-center">
                                                    <div
                                                    className="quantity d-inline-flex align-items-center justify-content-center gap-1 py-2 px-4 border n50-border_20 text-sm">
                                                    <button className="quantityDecrement"><i className="fal fa-minus"></i></button>
                                                    <input type="text" value="1" className="quantityValue" />
                                                    <button className="quantityIncrement"><i className="fal fa-plus"></i></button>
                                                </div>
                                                </td>
                                                <td className="text-center">
                                                    <span className="price-usd">
                                                        $12.40 USD
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="align-items-center py-3">
                                                <td>
                                                    <div className="cart-item-thumb d-flex align-items-center gap-4">
                                                        <i className="fas fa-times"></i>
                                                        <Image className="w-100" src="/assets/img/inner-page/shop/shop-cart-02.png" alt="product" width={46} height={45} />
                                                        <span className="head text-nowrap">Shopping Bag</span>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <span className="price-usd">
                                                        $25.50 USD
                                                    </span>
                                                </td>
                                                <td className="price-quantity text-center">
                                                    <div
                                                        className="quantity d-inline-flex align-items-center justify-content-center gap-1 py-2 px-4 border n50-border_20 text-sm">
                                                        <button className="quantityDecrement"><i className="fal fa-minus"></i></button>
                                                        <input type="text" value="1" className="quantityValue" />
                                                        <button className="quantityIncrement"><i className="fal fa-plus"></i></button>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <span className="price-usd">
                                                        $25.50 USD
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="coupon-items d-flex flex-md-nowrap flex-wrap justify-content-between align-items-center gap-4 pt-4">
                                    <form action="#" className="d-flex flex-sm-nowrap flex-wrap align-items-center gap-3">
                                        <input type="text"
                                            placeholder="Enter coupon code" />
                                        <button type="submit" className="theme-btn alt-color radius-xs">Apply</button>
                                    </form>
                                    <button type="button" className="theme-btn alt-color radius-xs">Update Cart</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Cart Total section end */}
                    <div className="cart-total-area section-padding pt-0">
                        <div className="container">
                            <div className="cart-total-items">
                                <h2>Cart totals</h2>
                                <ul>
                                    <li>
                                        Subtotal <span className="subtotal">$37.90 USD</span>
                                    </li>
                                    <li>
                                        Total <span className="price">$37.90 USD</span>
                                    </li>
                                </ul>
                                <Link href="/checkout" className="theme-btn">Proceed to Checkout</Link>
                            </div>
                        </div>
                    </div>

                     {/* Best Food Menu Section Start */}
                    <section className="best-food-menu-two fix section-padding pt-0">
                        <div className="shape">
                            <Image src="/assets/img/home-2/shape8.png" alt="img" width={114} height={260} />
                        </div>
                        <div className="container">
                            <div className="section-title text-center">
                                <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">Similar Products</span>
                                <h2 className="tx-title sec_title  tz-itm-title tz-itm-anim">
                                  Your Can Choose This Products
                                </h2>
                                <div className="sec-line mt-3">
                                    <Image src="/assets/img/home-1/sec-line.png" alt="img" width={263} height={23} />
                                </div>
                            </div>
                            <div className="row">
                                 <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".2s">
                                            <div className="food-category-items-4">
                                                <div className="shape">
                                                    <svg width="292" height="162" viewBox="0 0 292 162" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M0 20C0 8.95431 8.95431 0 20 0H272C283.046 0 292 8.9543 292 20V95.3843C292 101.5 289.23 107.256 284.227 110.772C263.695 125.2 205.494 162 146 162C86.5063 162 28.3054 125.2 7.77321 110.772C2.76957 107.256 0 101.5 0 95.3843V20Z" fill="#F4F1EA"></path>
                                                    </svg>
                                                </div>
                                                <div className="icon">
                                                    <Link href="/shop"><i className="fa-solid fa-plus"></i></Link>
                                                    <div className="frame">
                                                        <Image src="/assets/img/home-4/frame.png" alt="img" width={30} height={39} />
                                                    </div>
                                                </div>
                                                <div className="thumb">
                                                    <Image src="/assets/img/home-4/food-7.png" alt="img" width={189} height={187} />
                                                </div>
                                                <div className="content">
                                                    <div className="star">
                                                        <i className="fa-etch fa-solid fa-star"></i>
                                                        <i className="fa-etch fa-solid fa-star"></i>
                                                        <i className="fa-etch fa-solid fa-star"></i>
                                                        <i className="fa-etch fa-solid fa-star"></i>
                                                        <i className="fa-light fa-star"></i>
                                                    </div>
                                                    <h3 className="title">
                                                        <Link href="/shop-details">Classic Beef Hotdog</Link>
                                                    </h3>
                                                    <p>
                                                        Find top-rated dinnerware, flatware and barware at Crimson Deli.
                                                    </p>
                                                    <div className="pricing-item">
                                                        <div className="form-clt">
                                                            <div className="form">
                                                                <NiceSelect className="single-select w-100" options={["Large", "Medium", "Small"]} />
                                                            </div>
                                                        </div>
                                                        <span className="price">$12.99</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".4s">
                                            <div className="food-category-items-4">
                                                <div className="shape">
                                                    <svg width="292" height="162" viewBox="0 0 292 162" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M0 20C0 8.95431 8.95431 0 20 0H272C283.046 0 292 8.9543 292 20V95.3843C292 101.5 289.23 107.256 284.227 110.772C263.695 125.2 205.494 162 146 162C86.5063 162 28.3054 125.2 7.77321 110.772C2.76957 107.256 0 101.5 0 95.3843V20Z" fill="#F4F1EA"></path>
                                                    </svg>
                                                </div>
                                                <div className="icon">
                                                    <Link href="/shop"><i className="fa-solid fa-plus"></i></Link>
                                                    <div className="frame">
                                                        <Image src="/assets/img/home-4/frame.png" alt="img" width={30} height={39} />
                                                    </div>
                                                </div>
                                                <div className="thumb">
                                                    <Image src="/assets/img/home-4/food-8.png" alt="img" width={189} height={187} />
                                                </div>
                                                <div className="content">
                                                    <div className="star">
                                                        <i className="fa-etch fa-solid fa-star"></i>
                                                        <i className="fa-etch fa-solid fa-star"></i>
                                                        <i className="fa-etch fa-solid fa-star"></i>
                                                        <i className="fa-etch fa-solid fa-star"></i>
                                                        <i className="fa-light fa-star"></i>
                                                    </div>
                                                    <h3 className="title">
                                                        <Link href="/shop-details">Crispy Onion Rings</Link>
                                                    </h3>
                                                    <p>
                                                        Find top-rated dinnerware, flatware and barware at Crimson Deli.
                                                    </p>
                                                    <div className="pricing-item">
                                                        <div className="form-clt">
                                                            <div className="form">
                                                                <NiceSelect className="single-select w-100" options={["Large", "Medium", "Small"]} />
                                                            </div>
                                                        </div>
                                                        <span className="price">$06.99</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".6s">
                                            <div className="food-category-items-4">
                                                <div className="shape">
                                                    <svg width="292" height="162" viewBox="0 0 292 162" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M0 20C0 8.95431 8.95431 0 20 0H272C283.046 0 292 8.9543 292 20V95.3843C292 101.5 289.23 107.256 284.227 110.772C263.695 125.2 205.494 162 146 162C86.5063 162 28.3054 125.2 7.77321 110.772C2.76957 107.256 0 101.5 0 95.3843V20Z" fill="#F4F1EA"></path>
                                                    </svg>
                                                </div>
                                                <div className="icon">
                                                    <Link href="/shop"><i className="fa-solid fa-plus"></i></Link>
                                                    <div className="frame">
                                                        <Image src="/assets/img/home-4/frame.png" alt="img" width={30} height={39} />
                                                    </div>
                                                </div>
                                                <div className="thumb">
                                                    <Image src="/assets/img/home-4/food-9.png" alt="img" width={241} height={187} />
                                                </div>
                                                <div className="content">
                                                    <div className="star">
                                                        <i className="fa-etch fa-solid fa-star"></i>
                                                        <i className="fa-etch fa-solid fa-star"></i>
                                                        <i className="fa-etch fa-solid fa-star"></i>
                                                        <i className="fa-etch fa-solid fa-star"></i>
                                                        <i className="fa-light fa-star"></i>
                                                    </div>
                                                    <h3 className="title">
                                                        <Link href="/shop-details">Cheesy Beef Nachos</Link>
                                                    </h3>
                                                    <p>
                                                        Find top-rated dinnerware, flatware and barware at Crimson Deli.
                                                    </p>
                                                    <div className="pricing-item">
                                                        <div className="form-clt">
                                                            <div className="form">
                                                                <NiceSelect className="single-select w-100" options={["Large", "Medium", "Small"]} />
                                                            </div>
                                                        </div>
                                                        <span className="price">$25.99</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".8s">
                                            <div className="food-category-items-4">
                                                <div className="shape">
                                                    <svg width="292" height="162" viewBox="0 0 292 162" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M0 20C0 8.95431 8.95431 0 20 0H272C283.046 0 292 8.9543 292 20V95.3843C292 101.5 289.23 107.256 284.227 110.772C263.695 125.2 205.494 162 146 162C86.5063 162 28.3054 125.2 7.77321 110.772C2.76957 107.256 0 101.5 0 95.3843V20Z" fill="#F4F1EA"></path>
                                                    </svg>
                                                </div>
                                                <div className="icon">
                                                    <Link href="/shop"><i className="fa-solid fa-plus"></i></Link>
                                                    <div className="frame">
                                                        <Image src="/assets/img/home-4/frame.png" alt="img" width={30} height={39} />
                                                    </div>
                                                </div>
                                                <div className="thumb">
                                                    <Image src="/assets/img/home-4/food-10.png" alt="img" width={233} height={187} />
                                                </div>
                                                <div className="content">
                                                    <div className="star">
                                                        <i className="fa-etch fa-solid fa-star"></i>
                                                        <i className="fa-etch fa-solid fa-star"></i>
                                                        <i className="fa-etch fa-solid fa-star"></i>
                                                        <i className="fa-etch fa-solid fa-star"></i>
                                                        <i className="fa-light fa-star"></i>
                                                    </div>
                                                    <h3 className="title">
                                                        <Link href="/shop-details">Crispy Chicken Burger</Link>
                                                    </h3>
                                                    <p>
                                                        Find top-rated dinnerware, flatware and barware at Crimson Deli.
                                                    </p>
                                                    <div className="pricing-item">
                                                        <div className="form-clt">
                                                            <div className="form">
                                                                <NiceSelect className="single-select w-100" options={["Large", "Medium", "Small"]} />
                                                            </div>
                                                        </div>
                                                        <span className="price">$13.99</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                            </div>
                        </div>
                    </section>

                    {/* Instagram Start */}
                    <div className="instagram-section fix pb-3">
                        <div className="marquee">
                            <div className="marquee-group">
                                <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-1.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-1.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-2.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-2.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-3.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-3.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-4.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-4.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-5.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-5.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-6.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-6.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-7.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-7.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-8.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-8.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-9.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-9.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                            </div>
                            <div className="marquee-group">
                                <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-1.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-1.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-2.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-2.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-3.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-3.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-4.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-4.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-5.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-5.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-6.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-6.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-7.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-7.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-8.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-8.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-9.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-9.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                            </div>
                            <div className="marquee-group">
                                <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-1.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-1.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-2.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-2.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-3.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-3.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-4.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-4.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-5.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-5.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-6.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-6.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-7.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-7.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-8.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-8.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                                 <div className="instagram-image">
                                    <Image src="/assets/img/home-2/instagram-image-9.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <Image src="/assets/img/home-2/instagram-image-9.jpg" alt="img" className="hover-img" width={210} height={220} />
                                    <a href="#" className="icon">
                                         <Image src="/assets/img/home-2/instagram.png" alt="img" width={40} height={40} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cta-Section Start */}
                    <section className="cta-section-4 section-padding pb-0 bg-white">
                        <div className="shape-1 d-none d-xl-block">
                            <Image src="/assets/img/home-2/footer-shape1.png" alt="img" width={442} height={502} />
                        </div>
                        <div className="shape-2 d-none d-xl-block">
                            <Image src="/assets/img/home-2/footer-shape3.png" alt="img" width={573} height={515} />
                        </div>
                         <div className="shape-3 d-none d-xl-block float-bob-y">
                            <Image src="/assets/img/home-2/footer-shape2.png" alt="img" width={123} height={209} />
                        </div>
                        <div className="container">
                            <div className="row g-6">
                                <div className="cta-from-content">
                                    <div className="section-title text-center mb-0">
                                        <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">Our Newsletter</span>
                                        <h2 className="tx-title sec_title  tz-itm-title tz-itm-anim">
                                         Get <span>10% off</span> Your order!
                                        </h2>
                                        <div className="sec-line mt-3 mb-4">
                                            <Image src="/assets/img/home-1/sec-line.png" alt="img" width={263} height={23} />
                                        </div>
                                        <p className="wow fadeInUp" data-wow-delay=".3s">Enter your email and receive a 10% discount on your next order!</p>
                                    </div>
                                    <div className="content wow fadeInUp" data-wow-delay=".5s">
                                        <form action="#">
                                        <input type="text" placeholder="Enter your email" />
                                            <button className="email-btn" type="submit">
                                                Subscribe
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
    </>
  );
}
