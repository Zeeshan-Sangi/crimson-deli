/* Auto-converted from _template/shop.html by scripts/html2jsx.mjs — do not hand-edit, re-run the script */
import Link from "next/link";
import Image from "next/image";
import NiceSelect from "@/components/layout/nice-select";

export default function Shop() {
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
                                    <h1 className="breadcrumb-title text-white split-title">SHOP GRID</h1>
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
                                    SHOP GRID
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                     {/* Food-Category-Section Start */}
                    <section className="food-category-section-4 section-padding fix">
                        <div className="container">
                            <div className="shop-notices-wrapper">
                               <form action="#">
                                    <input type="text" placeholder="Search..." />
                                    <button type="submit"><i className="fa-regular fa-magnifying-glass"></i></button>
                                </form>
                                <div className="shop-showing"> 
                                    <p>Showing 1–12 of 13 results</p>
                                    <ul className="nav">
                                        <li className="nav-item">
                                            <a href="#grid" data-bs-toggle="tab" className="nav-link active">
                                                <i className="fa-solid fa-grid"></i>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#list" data-bs-toggle="tab" className="nav-link">
                                                <i className="fa-solid fa-list"></i>
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="form-clt">
                                        <div className="form">
                                            <NiceSelect className="single-select w-100" options={["Default Shorting", "Sort by popularity", "Sort by popularity", "Sort by latest"]} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                             <div className="tab-content">
                                <div id="grid" className="tab-pane fade show active">
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
                                            <h2 className="title">
                                                <Link href="/shop-details">Classic Beef Hotdog</Link>
                                            </h2>
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
                                            <h2 className="title">
                                                <Link href="/shop-details">Crispy Onion Rings</Link>
                                            </h2>
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
                                            <h2 className="title">
                                                <Link href="/shop-details">Cheesy Beef Nachos</Link>
                                            </h2>
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
                                            <h2 className="title">
                                                <Link href="/shop-details">Crispy Chicken Burger</Link>
                                            </h2>
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
                                            <Image src="/assets/img/home-4/food-11.png" alt="img" width={185} height={183} />
                                        </div>
                                        <div className="content">
                                            <div className="star">
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-light fa-star"></i>
                                            </div>
                                            <h2 className="title">
                                                <Link href="/shop-details">Double Cheese Pizza</Link>
                                            </h2>
                                            <p>
                                                Find top-rated dinnerware, flatware and barware at Crimson Deli.
                                            </p>
                                            <div className="pricing-item">
                                                <div className="form-clt">
                                                    <div className="form">
                                                        <NiceSelect className="single-select w-100" options={["Large", "Medium", "Small"]} />
                                                    </div>
                                                </div>
                                                <span className="price">$15.99</span>
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
                                            <Image src="/assets/img/home-4/food-12.png" alt="img" width={208} height={187} />
                                        </div>
                                        <div className="content">
                                            <div className="star">
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-light fa-star"></i>
                                            </div>
                                            <h2 className="title">
                                                <Link href="/shop-details">Pepperoni Calzone</Link>
                                            </h2>
                                            <p>
                                                Find top-rated dinnerware, flatware and barware at Crimson Deli.
                                            </p>
                                            <div className="pricing-item">
                                                <div className="form-clt">
                                                    <div className="form">
                                                        <NiceSelect className="single-select w-100" options={["Large", "Medium", "Small"]} />
                                                    </div>
                                                </div>
                                                <span className="price">$09.99</span>
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
                                            <Image src="/assets/img/home-4/food-13.png" alt="img" width={179} height={187} />
                                        </div>
                                        <div className="content">
                                            <div className="star">
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-light fa-star"></i>
                                            </div>
                                            <h2 className="title">
                                                <Link href="/shop-details">Spicy Beef Burrito</Link>
                                            </h2>
                                            <p>
                                                Find top-rated dinnerware, flatware and barware at Crimson Deli.
                                            </p>
                                            <div className="pricing-item">
                                                <div className="form-clt">
                                                    <div className="form">
                                                        <NiceSelect className="single-select w-100" options={["Large", "Medium", "Small"]} />
                                                    </div>
                                                </div>
                                                <span className="price">$07.99</span>
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
                                            <Image src="/assets/img/home-4/food-14.png" alt="img" width={219} height={187} />
                                        </div>
                                        <div className="content">
                                            <div className="star">
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-light fa-star"></i>
                                            </div>
                                            <h2 className="title">
                                                <Link href="/shop-details">BBQ Chicken Wings</Link>
                                            </h2>
                                            <p>
                                                Find top-rated dinnerware, flatware and barware at Crimson Deli.
                                            </p>
                                            <div className="pricing-item">
                                                <div className="form-clt">
                                                    <div className="form">
                                                        <NiceSelect className="single-select w-100" options={["Large", "Medium", "Small"]} />
                                                    </div>
                                                </div>
                                                <span className="price">$09.99</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                                            <Image src="/assets/img/home-4/food-15.png" alt="img" width={205} height={156} />
                                        </div>
                                        <div className="content">
                                            <div className="star">
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-light fa-star"></i>
                                            </div>
                                            <h2 className="title">
                                                <Link href="/shop-details">Double Cheese Burger</Link>
                                            </h2>
                                            <p>
                                                Find top-rated dinnerware, flatware and barware at Crimson Deli.
                                            </p>
                                            <div className="pricing-item">
                                                <div className="form-clt">
                                                    <div className="form">
                                                        <NiceSelect className="single-select w-100" options={["Large", "Medium", "Small"]} />
                                                    </div>
                                                </div>
                                                <span className="price">$15.99</span>
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
                                            <Image src="/assets/img/home-4/food-16.png" alt="img" width={200} height={156} />
                                        </div>
                                        <div className="content">
                                            <div className="star">
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-light fa-star"></i>
                                            </div>
                                            <h2 className="title">
                                                <Link href="/shop-details">Pepperoni Pizza</Link>
                                            </h2>
                                            <p>
                                                Find top-rated dinnerware, flatware and barware at Crimson Deli.
                                            </p>
                                            <div className="pricing-item">
                                                <div className="form-clt">
                                                    <div className="form">
                                                        <NiceSelect className="single-select w-100" options={["Large", "Medium", "Small"]} />
                                                    </div>
                                                </div>
                                                <span className="price">$09.99</span>
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
                                            <Image src="/assets/img/home-4/food-17.png" alt="img" width={210} height={156} />
                                        </div>
                                        <div className="content">
                                            <div className="star">
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-light fa-star"></i>
                                            </div>
                                            <h2 className="title">
                                                <Link href="/shop-details">Black Hum Burger</Link>
                                            </h2>
                                            <p>
                                                Find top-rated dinnerware, flatware and barware at Crimson Deli.
                                            </p>
                                            <div className="pricing-item">
                                                <div className="form-clt">
                                                    <div className="form">
                                                        <NiceSelect className="single-select w-100" options={["Large", "Medium", "Small"]} />
                                                    </div>
                                                </div>
                                                <span className="price">$07.99</span>
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
                                            <Image src="/assets/img/home-4/food-18.png" alt="img" width={244} height={156} />
                                        </div>
                                        <div className="content">
                                            <div className="star">
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-light fa-star"></i>
                                            </div>
                                            <h2 className="title">
                                                <Link href="/shop-details">Special Biryani</Link>
                                            </h2>
                                            <p>
                                                Find top-rated dinnerware, flatware and barware at Crimson Deli.
                                            </p>
                                            <div className="pricing-item">
                                                <div className="form-clt">
                                                    <div className="form">
                                                        <NiceSelect className="single-select w-100" options={["Large", "Medium", "Small"]} />
                                                    </div>
                                                </div>
                                                <span className="price">$09.99</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    </div>
                                    <div className="page-nav-wrap text-center">
                                        <ul>
                                            <li><a className="page-numbers" href="#">01</a></li>
                                            <li><a className="page-numbers" href="#">02</a></li>
                                            <li><a className="page-numbers" href="#">03</a></li>
                                            <li className="active"><a className="page-numbers" href="#">next</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div id="list" className="tab-pane fade">
                                    <div className="shop-list-area">
                                        <div className="shop-list-inner">
                                            <div className="icon">
                                                <Link href="/shop"><i className="fa-solid fa-plus"></i></Link>
                                                <div className="frame">
                                                    <Image src="/assets/img/home-4/frame.png" alt="img" width={30} height={39} />
                                                </div>
                                            </div>
                                        <div className="shape">
                                            <svg width="179" height="322" viewBox="0 0 179 322" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 322C8.95429 322 -3.91405e-07 313.046 -8.74228e-07 302L-1.32008e-05 20C-1.36837e-05 8.95432 8.95429 -3.91405e-07 20 -8.74228e-07L106.422 -4.65184e-06C112.53 -4.91886e-06 118.299 2.78857 121.832 7.77209C137.353 29.6681 179 94.604 179 161C179 227.396 137.354 292.332 121.832 314.228C118.299 319.211 112.53 322 106.422 322L20 322Z" fill="#F4F1EA"/>
                                            </svg>

                                        </div>
                                        <div className="thumb">
                                            <Image src="/assets/img/inner/shop-1.png" alt="img" width={251} height={249} />
                                        </div>
                                        <div className="content">
                                            <div className="star">
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-etch fa-solid fa-star"></i>
                                                <i className="fa-light fa-star"></i>
                                            </div>
                                            <h2 className="title">
                                                <Link href="/shop-details">Classic Beef Hotdog</Link>
                                            </h2>
                                            <p className="text">
                                                Find top-rated dinnerware, flatware and barware at Crimson Deli. Delectus error inventore aspernatur nisi qui. Distinctio deleniti eligendi esse est neque rerum minus. Consequatur iure voluptatem autem cupiditate.
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
                                        <div className="shop-list-inner">
                                            <div className="icon">
                                                <Link href="/shop"><i className="fa-solid fa-plus"></i></Link>
                                                <div className="frame">
                                                    <Image src="/assets/img/home-4/frame.png" alt="img" width={30} height={39} />
                                                </div>
                                            </div>
                                            <div className="shape">
                                                <svg width="179" height="322" viewBox="0 0 179 322" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 322C8.95429 322 -3.91405e-07 313.046 -8.74228e-07 302L-1.32008e-05 20C-1.36837e-05 8.95432 8.95429 -3.91405e-07 20 -8.74228e-07L106.422 -4.65184e-06C112.53 -4.91886e-06 118.299 2.78857 121.832 7.77209C137.353 29.6681 179 94.604 179 161C179 227.396 137.354 292.332 121.832 314.228C118.299 319.211 112.53 322 106.422 322L20 322Z" fill="#F4F1EA"/>
                                                </svg>

                                            </div>
                                            <div className="thumb">
                                                <Image src="/assets/img/inner/shop-2.png" alt="img" width={255} height={252} />
                                            </div>
                                            <div className="content">
                                                <div className="star">
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-light fa-star"></i>
                                                </div>
                                                <h2 className="title">
                                                    <Link href="/shop-details">Crispy Onion Rings</Link>
                                                </h2>
                                                <p className="text">
                                                    Find top-rated dinnerware, flatware and barware at Crimson Deli. Delectus error inventore aspernatur nisi qui. Distinctio deleniti eligendi esse est neque rerum minus. Consequatur iure voluptatem autem cupiditate.
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
                                        <div className="shop-list-inner">
                                            <div className="icon">
                                                <Link href="/shop"><i className="fa-solid fa-plus"></i></Link>
                                                <div className="frame">
                                                    <Image src="/assets/img/home-4/frame.png" alt="img" width={30} height={39} />
                                                </div>
                                            </div>
                                            <div className="shape">
                                                <svg width="179" height="322" viewBox="0 0 179 322" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 322C8.95429 322 -3.91405e-07 313.046 -8.74228e-07 302L-1.32008e-05 20C-1.36837e-05 8.95432 8.95429 -3.91405e-07 20 -8.74228e-07L106.422 -4.65184e-06C112.53 -4.91886e-06 118.299 2.78857 121.832 7.77209C137.353 29.6681 179 94.604 179 161C179 227.396 137.354 292.332 121.832 314.228C118.299 319.211 112.53 322 106.422 322L20 322Z" fill="#F4F1EA"/>
                                                </svg>

                                            </div>
                                            <div className="thumb">
                                                <Image src="/assets/img/inner/shop-3.png" alt="img" width={251} height={248} />
                                            </div>
                                            <div className="content">
                                                <div className="star">
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-light fa-star"></i>
                                                </div>
                                                <h2 className="title">
                                                    <Link href="/shop-details">Cheesy Beef Nachos</Link>
                                                </h2>
                                                <p className="text">
                                                    Find top-rated dinnerware, flatware and barware at Crimson Deli. Delectus error inventore aspernatur nisi qui. Distinctio deleniti eligendi esse est neque rerum minus. Consequatur iure voluptatem autem cupiditate.
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
                                        <div className="shop-list-inner">
                                            <div className="icon">
                                                <Link href="/shop"><i className="fa-solid fa-plus"></i></Link>
                                                <div className="frame">
                                                    <Image src="/assets/img/home-4/frame.png" alt="img" width={30} height={39} />
                                                </div>
                                            </div>
                                            <div className="shape">
                                                <svg width="179" height="322" viewBox="0 0 179 322" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 322C8.95429 322 -3.91405e-07 313.046 -8.74228e-07 302L-1.32008e-05 20C-1.36837e-05 8.95432 8.95429 -3.91405e-07 20 -8.74228e-07L106.422 -4.65184e-06C112.53 -4.91886e-06 118.299 2.78857 121.832 7.77209C137.353 29.6681 179 94.604 179 161C179 227.396 137.354 292.332 121.832 314.228C118.299 319.211 112.53 322 106.422 322L20 322Z" fill="#F4F1EA"/>
                                                </svg>

                                            </div>
                                            <div className="thumb">
                                                <Image src="/assets/img/inner/shop-4.png" alt="img" width={293} height={224} />
                                            </div>
                                            <div className="content">
                                                <div className="star">
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-light fa-star"></i>
                                                </div>
                                                <h2 className="title">
                                                    <Link href="/shop-details">Crispy Chicken Burger</Link>
                                                </h2>
                                                <p className="text">
                                                    Find top-rated dinnerware, flatware and barware at Crimson Deli. Delectus error inventore aspernatur nisi qui. Distinctio deleniti eligendi esse est neque rerum minus. Consequatur iure voluptatem autem cupiditate.
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
                                        <div className="shop-list-inner">
                                            <div className="icon">
                                                <Link href="/shop"><i className="fa-solid fa-plus"></i></Link>
                                                <div className="frame">
                                                    <Image src="/assets/img/home-4/frame.png" alt="img" width={30} height={39} />
                                                </div>
                                            </div>
                                            <div className="shape">
                                                <svg width="179" height="322" viewBox="0 0 179 322" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 322C8.95429 322 -3.91405e-07 313.046 -8.74228e-07 302L-1.32008e-05 20C-1.36837e-05 8.95432 8.95429 -3.91405e-07 20 -8.74228e-07L106.422 -4.65184e-06C112.53 -4.91886e-06 118.299 2.78857 121.832 7.77209C137.353 29.6681 179 94.604 179 161C179 227.396 137.354 292.332 121.832 314.228C118.299 319.211 112.53 322 106.422 322L20 322Z" fill="#F4F1EA"/>
                                                </svg>

                                            </div>
                                            <div className="thumb">
                                                <Image src="/assets/img/inner/shop-5.png" alt="img" width={241} height={252} />
                                            </div>
                                            <div className="content">
                                                <div className="star">
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-light fa-star"></i>
                                                </div>
                                                <h2 className="title">
                                                    <Link href="/shop-details">Double Cheese Pizza</Link>
                                                </h2>
                                                <p className="text">
                                                    Find top-rated dinnerware, flatware and barware at Crimson Deli. Delectus error inventore aspernatur nisi qui. Distinctio deleniti eligendi esse est neque rerum minus. Consequatur iure voluptatem autem cupiditate.
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
                                        <div className="shop-list-inner">
                                            <div className="icon">
                                                <Link href="/shop"><i className="fa-solid fa-plus"></i></Link>
                                                <div className="frame">
                                                    <Image src="/assets/img/home-4/frame.png" alt="img" width={30} height={39} />
                                                </div>
                                            </div>
                                            <div className="shape">
                                                <svg width="179" height="322" viewBox="0 0 179 322" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 322C8.95429 322 -3.91405e-07 313.046 -8.74228e-07 302L-1.32008e-05 20C-1.36837e-05 8.95432 8.95429 -3.91405e-07 20 -8.74228e-07L106.422 -4.65184e-06C112.53 -4.91886e-06 118.299 2.78857 121.832 7.77209C137.353 29.6681 179 94.604 179 161C179 227.396 137.354 292.332 121.832 314.228C118.299 319.211 112.53 322 106.422 322L20 322Z" fill="#F4F1EA"/>
                                                </svg>

                                            </div>
                                            <div className="thumb">
                                                <Image src="/assets/img/inner/shop-6.png" alt="img" width={294} height={236} />
                                            </div>
                                            <div className="content">
                                                <div className="star">
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-light fa-star"></i>
                                                </div>
                                                <h2 className="title">
                                                    <Link href="/shop-details">Black Hum Burger</Link>
                                                </h2>
                                                <p className="text">
                                                    Find top-rated dinnerware, flatware and barware at Crimson Deli. Delectus error inventore aspernatur nisi qui. Distinctio deleniti eligendi esse est neque rerum minus. Consequatur iure voluptatem autem cupiditate.
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
                                        <div className="shop-list-inner">
                                            <div className="icon">
                                                <Link href="/shop"><i className="fa-solid fa-plus"></i></Link>
                                                <div className="frame">
                                                    <Image src="/assets/img/home-4/frame.png" alt="img" width={30} height={39} />
                                                </div>
                                            </div>
                                            <div className="shape">
                                                <svg width="179" height="322" viewBox="0 0 179 322" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 322C8.95429 322 -3.91405e-07 313.046 -8.74228e-07 302L-1.32008e-05 20C-1.36837e-05 8.95432 8.95429 -3.91405e-07 20 -8.74228e-07L106.422 -4.65184e-06C112.53 -4.91886e-06 118.299 2.78857 121.832 7.77209C137.353 29.6681 179 94.604 179 161C179 227.396 137.354 292.332 121.832 314.228C118.299 319.211 112.53 322 106.422 322L20 322Z" fill="#F4F1EA"/>
                                                </svg>

                                            </div>
                                            <div className="thumb">
                                                <Image src="/assets/img/inner/shop-7.png" alt="img" width={295} height={252} />
                                            </div>
                                            <div className="content">
                                                <div className="star">
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-light fa-star"></i>
                                                </div>
                                                <h2 className="title">
                                                    <Link href="/shop-details">Spicy Beef Salad</Link>
                                                </h2>
                                                <p className="text">
                                                    Find top-rated dinnerware, flatware and barware at Crimson Deli. Delectus error inventore aspernatur nisi qui. Distinctio deleniti eligendi esse est neque rerum minus. Consequatur iure voluptatem autem cupiditate.
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
                                        <div className="shop-list-inner">
                                            <div className="icon">
                                                <Link href="/shop"><i className="fa-solid fa-plus"></i></Link>
                                                <div className="frame">
                                                    <Image src="/assets/img/home-4/frame.png" alt="img" width={30} height={39} />
                                                </div>
                                            </div>
                                            <div className="shape">
                                                <svg width="179" height="322" viewBox="0 0 179 322" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 322C8.95429 322 -3.91405e-07 313.046 -8.74228e-07 302L-1.32008e-05 20C-1.36837e-05 8.95432 8.95429 -3.91405e-07 20 -8.74228e-07L106.422 -4.65184e-06C112.53 -4.91886e-06 118.299 2.78857 121.832 7.77209C137.353 29.6681 179 94.604 179 161C179 227.396 137.354 292.332 121.832 314.228C118.299 319.211 112.53 322 106.422 322L20 322Z" fill="#F4F1EA"/>
                                                </svg>

                                            </div>
                                            <div className="thumb">
                                                <Image src="/assets/img/inner/shop-8.png" alt="img" width={295} height={219} />
                                            </div>
                                            <div className="content">
                                                <div className="star">
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-light fa-star"></i>
                                                </div>
                                                <h2 className="title">
                                                    <Link href="/shop-details">BBQ Chicken Wings</Link>
                                                </h2>
                                                <p className="text">
                                                    Find top-rated dinnerware, flatware and barware at Crimson Deli. Delectus error inventore aspernatur nisi qui. Distinctio deleniti eligendi esse est neque rerum minus. Consequatur iure voluptatem autem cupiditate.
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
                                        <div className="shop-list-inner">
                                            <div className="icon">
                                                <Link href="/shop"><i className="fa-solid fa-plus"></i></Link>
                                                <div className="frame">
                                                    <Image src="/assets/img/home-4/frame.png" alt="img" width={30} height={39} />
                                                </div>
                                            </div>
                                            <div className="shape">
                                                <svg width="179" height="322" viewBox="0 0 179 322" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 322C8.95429 322 -3.91405e-07 313.046 -8.74228e-07 302L-1.32008e-05 20C-1.36837e-05 8.95432 8.95429 -3.91405e-07 20 -8.74228e-07L106.422 -4.65184e-06C112.53 -4.91886e-06 118.299 2.78857 121.832 7.77209C137.353 29.6681 179 94.604 179 161C179 227.396 137.354 292.332 121.832 314.228C118.299 319.211 112.53 322 106.422 322L20 322Z" fill="#F4F1EA"/>
                                                </svg>

                                            </div>
                                            <div className="thumb">
                                                <Image src="/assets/img/inner/shop-9.png" alt="img" width={266} height={249} />
                                            </div>
                                            <div className="content">
                                                <div className="star">
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-light fa-star"></i>
                                                </div>
                                                <h2 className="title">
                                                    <Link href="/shop-details">Pepperoni Pizza</Link>
                                                </h2>
                                                <p className="text">
                                                    Find top-rated dinnerware, flatware and barware at Crimson Deli. Delectus error inventore aspernatur nisi qui. Distinctio deleniti eligendi esse est neque rerum minus. Consequatur iure voluptatem autem cupiditate.
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
                                        <div className="shop-list-inner">
                                            <div className="icon">
                                                <Link href="/shop"><i className="fa-solid fa-plus"></i></Link>
                                                <div className="frame">
                                                    <Image src="/assets/img/home-4/frame.png" alt="img" width={30} height={39} />
                                                </div>
                                            </div>
                                            <div className="shape">
                                                <svg width="179" height="322" viewBox="0 0 179 322" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 322C8.95429 322 -3.91405e-07 313.046 -8.74228e-07 302L-1.32008e-05 20C-1.36837e-05 8.95432 8.95429 -3.91405e-07 20 -8.74228e-07L106.422 -4.65184e-06C112.53 -4.91886e-06 118.299 2.78857 121.832 7.77209C137.353 29.6681 179 94.604 179 161C179 227.396 137.354 292.332 121.832 314.228C118.299 319.211 112.53 322 106.422 322L20 322Z" fill="#F4F1EA"/>
                                                </svg>

                                            </div>
                                            <div className="thumb">
                                                <Image src="/assets/img/inner/shop-10.png" alt="img" width={262} height={222} />
                                            </div>
                                            <div className="content">
                                                <div className="star">
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-etch fa-solid fa-star"></i>
                                                    <i className="fa-light fa-star"></i>
                                                </div>
                                                <h2 className="title">
                                                    <Link href="/shop-details">Double Cheese Burger</Link>
                                                </h2>
                                                <p className="text">
                                                    Find top-rated dinnerware, flatware and barware at Crimson Deli. Delectus error inventore aspernatur nisi qui. Distinctio deleniti eligendi esse est neque rerum minus. Consequatur iure voluptatem autem cupiditate.
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
                                    <div className="page-nav-wrap text-center">
                                        <ul>
                                            <li><a className="page-numbers" href="#">01</a></li>
                                            <li><a className="page-numbers" href="#">02</a></li>
                                            <li><a className="page-numbers" href="#">03</a></li>
                                            <li className="active"><a className="page-numbers" href="#">next</a></li>
                                        </ul>
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
