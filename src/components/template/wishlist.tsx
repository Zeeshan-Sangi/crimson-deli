/* Auto-converted from _template/wishlist.html by scripts/html2jsx.mjs — do not hand-edit, re-run the script */
import Link from "next/link";
import Image from "next/image";

export default function Wishlist() {
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
                                    <h1 className="breadcrumb-title text-white split-title">wishlist</h1>
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
                                    wishlist
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
                                                <th>Product</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th><br className="d-block" /></th>
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
                                                <td>
                                                    <span className="price-usd">
                                                        $15.40 USD
                                                    </span>
                                                </td>
                                                <td className="price-quantity">
                                                    <div
                                                    className="quantity d-inline-flex align-items-center justify-content-center gap-1 py-2 px-4 border n50-border_20 text-sm">
                                                    <button className="quantityDecrement"><i className="fal fa-minus"></i></button>
                                                    <input type="text" value="1" className="quantityValue" />
                                                    <button className="quantityIncrement"><i className="fal fa-plus"></i></button>
                                                </div>
                                                </td>
                                                <td>
                                                    <Link href="/shop-cart" className="theme-btn add-carts-btns">Add to cart</Link>
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
                                                <td>
                                                    <span className="price-usd">
                                                        $25.50 USD
                                                    </span>
                                                </td>
                                                <td className="price-quantity">
                                                    <div
                                                        className="quantity d-inline-flex align-items-center justify-content-center gap-1 py-2 px-4 border n50-border_20 text-sm">
                                                        <button className="quantityDecrement"><i className="fal fa-minus"></i></button>
                                                        <input type="text" value="1" className="quantityValue" />
                                                        <button className="quantityIncrement"><i className="fal fa-plus"></i></button>
                                                    </div>
                                                </td>
                                                <td>
                                                     <Link href="/shop-cart" className="theme-btn add-carts-btns">Add to cart</Link>
                                                </td>
                                            </tr>
                                            <tr className="align-items-center py-3">
                                                <td>
                                                    <div className="cart-item-thumb d-flex align-items-center gap-4">
                                                        <i className="fas fa-times"></i>
                                                        <Image className="w-100" src="/assets/img/inner-page/shop/shop-cart-03.png" alt="product" width={45} height={45} />
                                                        <span className="head text-nowrap">Siganil</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="price-usd">
                                                        $35.50 USD
                                                    </span>
                                                </td>
                                                <td className="price-quantity">
                                                    <div
                                                        className="quantity d-inline-flex align-items-center justify-content-center gap-1 py-2 px-4 border n50-border_20 text-sm">
                                                        <button className="quantityDecrement"><i className="fal fa-minus"></i></button>
                                                        <input type="text" value="1" className="quantityValue" />
                                                        <button className="quantityIncrement"><i className="fal fa-plus"></i></button>
                                                    </div>
                                                </td>
                                                <td>
                                                     <Link href="/shop-cart" className="theme-btn add-carts-btns">Add to cart</Link>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    
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
