/* Auto-converted from _template/shop-details.html by scripts/html2jsx.mjs — do not hand-edit, re-run the script */
import Link from "next/link";
import Image from "next/image";
import NiceSelect from "@/components/layout/nice-select";

export default function ShopDetails() {
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
                                    <h1 className="breadcrumb-title text-white split-title">SHOP DETAILS</h1>
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
                                    Shop Details
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* shop Section Start */}
                    <section className="shop-details-section section-padding">
                        <div className="container">
                            <div className="shop-details-wrapper">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="shop-details-image">
                                        <div className="tab-content">
                                            <div id="thumb1" className="tab-pane fade show active">
                                                <div className="shop-thumb">
                                                    <Image src="/assets/img/inner-page/shop/shop-details-01.png" alt="img" width={648} height={618} />
                                                </div>
                                            </div>
                                            <div id="thumb2" className="tab-pane fade">
                                                <div className="shop-thumb">
                                                     <Image src="/assets/img/inner-page/shop/shop-details-01.png" alt="img" width={648} height={618} />
                                                </div>
                                            </div>
                                            <div id="thumb3" className="tab-pane fade">
                                                <div className="shop-thumb">
                                                     <Image src="/assets/img/inner-page/shop/shop-details-01.png" alt="img" width={648} height={618} />
                                                </div>
                                            </div>
                                            <div id="thumb4" className="tab-pane fade">
                                                <div className="shop-thumb">
                                                     <Image src="/assets/img/inner-page/shop/shop-details-01.png" alt="img" width={648} height={618} />
                                                </div>
                                            </div>
                                            </div>
                                            <ul className="nav mb-5">
                                                <li className="nav-item">
                                                    <a href="#thumb1" data-bs-toggle="tab" className="nav-link ps-0 active">
                                                        <Image src="/assets/img/inner-page/shop/small1.png" alt="img" width={100} height={96} />
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a href="#thumb2" data-bs-toggle="tab" className="nav-link">
                                                    <Image src="/assets/img/inner-page/shop/small2.png" alt="img" width={100} height={96} />
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a href="#thumb3" data-bs-toggle="tab" className="nav-link">
                                                        <Image src="/assets/img/inner-page/shop/small3.png" alt="img" width={100} height={98} />
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a href="#thumb4" data-bs-toggle="tab" className="nav-link">
                                                        <Image src="/assets/img/inner-page/shop/small4.png" alt="img" width={103} height={96} />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="product-details-content">
                                        <span className="des-sub">FAST FOOD</span>
                                        <h2 className="pb-3 text-anim">Classic Beef Hotdog</h2>
                                        <div className="star pb-3 wow fadeInUp">
                                            <a href="#"> <i className="fas fa-star"></i></a>
                                            <a href="#"><i className="fas fa-star"></i></a>
                                            <a href="#"> <i className="fas fa-star"></i></a>
                                            <a href="#"><i className="fas fa-star"></i></a>
                                            <a href="#"><i className="fas fa-star"></i></a>
                                            <span>(4.50)4 Reviews</span>
                                        </div>
                                        <div className="price-list wow fadeInUp" data-wow-delay=".4s">
                                            <ul>
                                                <li>
                                                    $899.00
                                                </li>
                                                <li>
                                                    <del>$999.00</del>
                                                </li>
                                            </ul>
                                        </div>
                                        <p className="details-text mb-3 wow fadeInUp" data-wow-delay=".2s">
                                            This is a cutting-edge laptop designed to deliver exceptional performance and advanced features for professionals and creative enthusiasts.
                                        </p>
                                        <ul className="sp-details-list">
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                Use coupon SS23 to get extra $23 off (only this product)
                                            </li>
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                               Estimated delivery time 14-30 days
                                            </li>
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                18 months warranty at Genuine Warranty Center.
                                            </li>
                                        </ul>
                                        <div className="cart-quantity wow fadeInUp" data-wow-delay=".6s">
                                            <p className="qty">
                                                <button className="qtyminus" aria-hidden="true">−</button>
                                                <input type="number" name="qty" id="qty2" min="1" max="10" step="1" value="1" />
                                                <button className="qtyplus" aria-hidden="true">+</button>
                                            </p>
                                            <Link href="/shop-details" className="shop-btn theme-btn">Add to cart</Link>
                                            <div className="icon-item">
                                                <Link href="/wishlist" className="icon">
                                                    <i className="far fa-heart"></i>
                                                </Link>
                                                <Link href="/shop-details" className="icon">
                                                    <i className="far fa-share"></i>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="details-info"><span>SKU:</span> <Link href="/shop-details">124224</Link></div>
                                        <div className="details-info"><span>Categories:</span> <Link href="/shop-details">Pizza</Link></div>
                                        <div className="details-info"><span>Tags:</span> <Link href="/shop-details">Burgers, Pizza</Link></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="single-tab">
                                    <ul className="nav mb-5">
                                        <li className="nav-item">
                                        <a href="#description" data-bs-toggle="tab" className="nav-link ps-0 active">
                                            <span>Description</span>
                                        </a>
                                        </li>
                                        <li className="nav-item">
                                        <a href="#additional" data-bs-toggle="tab" className="nav-link">
                                            <span>Additional Information  </span>
                                        </a>
                                        </li>
                                        <li className="nav-item">
                                        <a href="#review" data-bs-toggle="tab" className="nav-link">
                                            <span>reviews (3)</span>
                                        </a>
                                        </li>
                                    </ul>
                                    <div className="tab-content">
                                        <div id="description" className="tab-pane fade show active">
                                        <div className="description-items">
                                            <div className="description-content">
                                                <h3>Product descriptions</h3>
                                                <p className="mb-4">
                                                    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.  When purchasing or selling a handcrafted painting, it's essential to have a clear understanding of these product details to make an informed decision and to provide potential buyers with a comprehensive description of the artwork. Additionally, the value and significance of a handcrafted painting can be influenced by factors like the artist's reputation, the rarity of the piece, and the demand for their work in the
                                                    art market.
                                                </p>
                                                <p>
                                                    When purchasing or selling a handcrafted painting, it's essential to have a clear understanding of these product details to make an informed decision and to provide potential buyers with a comprehensive description of the artwork. Additionally, the value and significance of a handcrafted painting can be influenced by factors like the artist's reputation, the rarity of the piece, and the demand for their work in the
                                                    art market.painting can be influenced by factors like the artist's reputation, the rarity of the piece, and the demand for their work in the
                                                    art market.
                                                </p>
                                                <div className="description-list-items d-flex justify-content-between">
                                                    <ul className="description-list">
                                                    <li>
                                                        Model wears:
                                                        <span>UK 10/ EU 38/ US 6</span>
                                                    </li>
                                                    <li>
                                                        Occasion:
                                                        <span> Lifestyle, Sport</span>
                                                    </li>
                                                    <li>
                                                        Country:
                                                        <span>Italy</span>
                                                    </li>
                                                    </ul>
                                                    <ul className="description-list">
                                                    <li>
                                                        Model wears:
                                                        <span>UK 10/ EU 38/ US 6</span>
                                                    </li>
                                                    <li>
                                                        Occasion:
                                                        <span> Lifestyle, Sport</span>
                                                    </li>
                                                    <li>
                                                        Country:
                                                        <span>Italy</span>
                                                    </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        </div>
                                        <div id="additional" className="tab-pane fade">
                                        <div className="table-responsive mb-15">
                                            <table className="table table-bordered">
                                                <tbody>
                                                    <tr>
                                                    <td>Weight</td>
                                                    <td>240 Ton</td>
                                                    </tr>
                                                    <tr>
                                                    <td>Dimensions</td>
                                                    <td>20 × 30 × 40 cm</td>
                                                    </tr>
                                                    <tr>
                                                    <td>Colors</td>
                                                    <td>Black, Blue, Green</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        </div>
                                        <div id="review" className="tab-pane fade">
                                        <div className="review-items">
                                            <div className="admin-items d-flex flex-wrap flex-md-nowrap align-items-center pb-4">
                                                <div className="admin-img pb-4 pb-md-0 me-4">
                                                    <Image src="/assets/img/inner-page/shop/client-01.png" alt="image" width={100} height={100} />
                                                </div>
                                                <div className="content p-4">
                                                    <div className="head-content pb-1 d-flex flex-wrap justify-content-between">
                                                    <h3>miklos salsa<span>27June 2026 at 5.44pm</span></h3>
                                                    <div className="star">
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                    </div>
                                                    </div>
                                                    <p>
                                                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Curabitur vulputate vestibulum Phasellus rhoncus dolor eget viverra pretium.Curabitur vulputate vestibulum Phasellus rhoncus dolor eget viverra pretium.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="admin-items d-flex flex-wrap flex-md-nowrap align-items-center pb-4">
                                                <div className="admin-img pb-4 pb-md-0 me-4">
                                                    <Image src="/assets/img/inner-page/shop/client-02.png" alt="image" width={100} height={100} />
                                                </div>
                                                <div className="content p-4">
                                                    <div className="head-content pb-1 d-flex flex-wrap justify-content-between">
                                                    <h3>Ethan Turner <span>27June 2026 at 5.44pm</span></h3>
                                                    <div className="star">
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                    </div>
                                                    </div>
                                                    <p>
                                                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Curabitur vulputate vestibulum Phasellus rhoncus dolor eget viverra pretium.Curabitur vulputate vestibulum Phasellus rhoncus dolor eget viverra pretium.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="admin-items d-flex flex-wrap flex-md-nowrap align-items-center pb-4">
                                                <div className="admin-img pb-4 pb-md-0 me-4">
                                                    <Image src="/assets/img/inner-page/shop/client-03.png" alt="image" width={100} height={100} />
                                                </div>
                                                <div className="content p-4">
                                                    <div className="head-content pb-1 d-flex flex-wrap justify-content-between">
                                                    <h3>Devid Miller<span>27June 2026 at 5.44pm</span></h3>
                                                    <div className="star">
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                    </div>
                                                    </div>
                                                    <p>
                                                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Curabitur vulputate vestibulum Phasellus rhoncus dolor eget viverra pretium.Curabitur vulputate vestibulum Phasellus rhoncus dolor eget viverra pretium.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="review-title mt-5 py-15 mb-30">
                                                <h4>add a review</h4>
                                                <div className="rate-now d-flex align-items-center">
                                                    <p>Rate this product? *</p>
                                                    <div className="star">
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="review-form">
                                                <form action="#" id="contact-form" method="POST">
                                                    <div className="row g-4">
                                                    <div className="col-lg-6">
                                                        <div className="form-clt">
                                                            <input type="text" name="name" id="name" placeholder="Full Name" />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="form-clt">
                                                            <input type="text" name="email" id="email" placeholder="email addres" />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12 wow fadeInUp" data-wow-delay=".8">
                                                        <div className="form-clt-big form-clt">
                                                            <textarea name="message" id="message" placeholder="message"></textarea> 
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 wow fadeInUp" data-wow-delay=".9">
                                                        <button type="submit" className="theme-btn">
                                                            Post Submit <i className="far fa-arrow-right"></i>
                                                        </button>
                                                    </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

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
