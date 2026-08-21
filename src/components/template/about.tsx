/* Auto-converted from _template/about.html by scripts/html2jsx.mjs — do not hand-edit, re-run the script */
import Link from "next/link";
import Image from "next/image";
import Slider from "@/components/ui/slider";

export default function About() {
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
                                    <h1 className="breadcrumb-title text-white split-title">About us</h1>
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
                                        About us
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Why-Choose-Us-Section Start */}
                    <section className="why-choose-us-section-4 section-padding">
                        <div className="left-shape float-bob-y">
                            <Image src="/assets/img/home-4/choose-1.png" alt="img" width={120} height={279} />
                        </div>
                        <div className="right-shape float-bob-y">
                            <Image src="/assets/img/home-4/choose-2.png" alt="img" width={156} height={120} />
                        </div>
                        <div className="container">
                            <div className="why-choose-us-wrapper-4">
                                <div className="row g-4 align-items-center">
                                    <div className="col-lg-6 wow fadeInUp" data-wow-delay=".3s">
                                        <div className="burger-image float-bob-y">
                                            <Image src="/assets/img/home-4/burger-1.png" alt="img" width={694} height={649} />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="choose-us-content">
                                            <div className="section-title mb-0">
                                                <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">Best Food Menu</span>
                                                <h2 className="tx-title sec_title  tz-itm-title tz-itm-anim">
                                                  We’re Making the <br /> Best burger for You
                                                </h2>
                                                <div className="sec-line mt-3 mb-4">
                                                    <Image src="/assets/img/home-1/sec-line.png" alt="img" width={263} height={23} />
                                                </div>
                                            </div>
                                            <p className="text wow fadeInUp" data-wow-delay=".3s">
                                               We prioritize eco-friendly practices that protect natural resources and ensure long-term agricultural productivity for generations. Every solution we offer is designed to support farmers.
                                            </p>
                                            <div className="choose-us-box">
                                                <ul className="list wow fadeInUp" data-wow-delay=".3s">
                                                    <li>
                                                        <i className="fa-solid fa-chevrons-right"></i>
                                                        Natural Healthy Products
                                                    </li>
                                                    <li>
                                                        <i className="fa-solid fa-chevrons-right"></i>
                                                        Gourmet Mushrooms
                                                    </li>
                                                    <li>
                                                        <i className="fa-solid fa-chevrons-right"></i>
                                                        Argo Farming
                                                    </li>
                                                </ul>
                                                <ul className="list wow fadeInUp" data-wow-delay=".5s">
                                                    <li>
                                                        <i className="fa-solid fa-chevrons-right"></i>
                                                        Fertilizer Distribution
                                                    </li>
                                                    <li>
                                                        <i className="fa-solid fa-chevrons-right"></i>
                                                        Best Quality Standards
                                                    </li>
                                                    <li>
                                                        <i className="fa-solid fa-chevrons-right"></i>
                                                        Multifunctional Farming
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="choose-button wow fadeInUp" data-wow-delay=".7s">
                                                <Link href="/contact" className="theme-btn theme-bg-2">Order Now
                                                    <i className="fa-solid fa-basket-shopping"></i>
                                                </Link>
                                                <Link href="/contact" className="theme-btn  small-btn">Reserve Table
                                                    <i className="fa-regular fa-arrow-up-right"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Discount Food Start */}
                    <section className="discount-food-section fix section-padding pt-0">
                        <div className="container">
                            <div className="row g-3">
                                <div className="col-xl-8">
                                    <div className="discount-food-banner-1 bg-cover wow fadeInUp" data-wow-delay=".3s" style={{backgroundImage: "url('/assets/img/home-1/food-banner-1.jpg')"}}>
                                        <div className="sticker-image">
                                            <Image src="/assets/img/home-1/sticker.png" alt="img" width={187} height={135} />
                                        </div>
                                        <div className="content-box">
                                            <div className="content">
                                                <span>***   FOR LIMITED TIME ONLY  ***</span>
                                                <h2 className="title">50% Offer</h2>
                                            </div>
                                            <Link href="/shop-details" className="theme-btn small-btn">Order Now <i className="fa-solid fa-basket-shopping"></i></Link>
                                        </div>
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-lg-6 wow fadeInUp" data-wow-delay=".5s">
                                            <div className="discount-food-banner-2 bg-cover" style={{backgroundImage: "url('/assets/img/home-1/food-banner-2.jpg')"}}>
                                                <div className="content">
                                                    <span className="sub-text">
                                                        Today’s
                                                    </span>
                                                    <h2>
                                                        Special <br />
                                                       <span> Food Menu</span>
                                                    </h2>
                                                    <p>This Weekend Only</p>
                                                </div>
                                                <div className="food-image">
                                                    <Image src="/assets/img/home-1/food-menu2.png" alt="img" width={365} height={193} />
                                                    <div className="discount-box">
                                                        <Image src="/assets/img/home-1/discount-box.png" alt="img" width={132} height={132} />
                                                        <div className="cont">
                                                            <p>ONLY</p>
                                                            <span>$19</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                         <div className="col-lg-6 wow fadeInUp" data-wow-delay=".7s">
                                            <div className="discount-food-banner-3">
                                                <Image src="/assets/img/home-1/food-banner-3.jpg" alt="img" width={433} height={403} />
                                                <h2 className="title">
                                                    Yummy <br /> Delicious Hot <br /> Pizza
                                                </h2>
                                                <div className="shape1">
                                                    <Image src="/assets/img/home-1/shape1.png" alt="img" width={79} height={98} />
                                                </div>
                                                <div className="shape2">
                                                    <Image src="/assets/img/home-1/shape2.png" alt="img" width={170} height={172} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 wow fadeInUp" data-wow-delay=".9s">
                                    <div className="discount-food-banner-4 bg-cover" style={{backgroundImage: "url('/assets/img/home-1/food-banner-4.jpg')"}}>
                                        <div className="content">
                                            <span className="menu-text">Special Menu</span>
                                            <h2>Chessey Pizza</h2>
                                            <h3>CHEF SPECIAL</h3>
                                            <Link href="/shop-details" className="theme-btn small-btn">Order Now <i className="fa-solid fa-basket-shopping"></i></Link>
                                        </div>
                                        <div className="thumb">
                                            <Image src="/assets/img/home-1/pizza-discount.png" alt="img" width={375} height={349} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="dis-shape">
                                <Image src="/assets/img/home-1/shape-5.png" alt="img" width={264} height={195} />
                            </div>
                        </div>
                    </section>
                    
                    {/* Food-Menu-Section Start */}
                    <section className="food-menu-section-3 section-padding pt-0 fix">
                        <div className="right-shape">
                            <Image src="/assets/img/home-3/tara-2.png" alt="img" width={160} height={136} />
                        </div>
                        <div className="right-shape-2">
                            <Image src="/assets/img/home-3/food-shape-6.png" alt="img" width={204} height={317} />
                        </div>
                        <div className="container">
                            <div className="section-title text-center mb-0">
                                <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">Best Food Menu</span>
                                <h2 className="tx-title sec_title  tz-itm-title tz-itm-anim">
                                   Our Best Foods Menus
                                </h2>
                                <div className="sec-line mt-3 mb-4">
                                    <Image src="/assets/img/home-1/sec-line.png" alt="img" width={263} height={23} />
                                </div>
                            </div>
                            <div className="best-food-menu-wrapper-3">
                                <div className="row g-4">
                                    <div className="col-xl-3 col-lg-6 col-md-6 order-1 wow fadeInUp" data-wow-delay=".3s">
                                        <div className="food-menu-image">
                                           <Image src="/assets/img/home-3/food-menu.jpg" alt="img" width={509} height={761} />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-12 order-3 order-xl-2">
                                        <div className="food-menu-mid-item">
                                            <ul className="nav">
                                                <li className="nav-item wow fadeInUp" data-wow-delay=".2s">
                                                    <a href="#Burger" data-bs-toggle="tab" className="nav-link active">
                                                        Beef Burger
                                                    </a>
                                                </li>
                                                <li className="nav-item wow fadeInUp" data-wow-delay=".4s">
                                                    <a href="#Pizza" data-bs-toggle="tab" className="nav-link">
                                                        Chicken Pizza
                                                    </a>
                                                </li>
                                                <li className="nav-item wow fadeInUp" data-wow-delay=".6s">
                                                    <a href="#Fresh" data-bs-toggle="tab" className="nav-link">
                                                    Fresh Pasta
                                                    </a>
                                                </li>
                                                <li className="nav-item wow fadeInUp" data-wow-delay=".6s">
                                                    <a href="#Sushi" data-bs-toggle="tab" className="nav-link">
                                                    Hot Sushi
                                                    </a>
                                                </li>
                                            </ul>
                                            <div className="tab-content">
                                                <div id="Burger" className="tab-pane fade show active">
                                                    <div className="food-menu-items-3 wow fadeInUp" data-wow-delay=".3s">
                                                        <div className="food-menu-itemss">
                                                            <div className="thumb">
                                                                <Image src="/assets/img/home-3/f-1.png" alt="img" width={110} height={92} />
                                                            </div>
                                                            <div className="content">
                                                                <h3 className="title">Spicy Chicken Roll</h3>
                                                                <p>Burger, coke, fries, chicken nuggets</p>
                                                                <span className="price">$25</span>
                                                            </div>
                                                        </div>
                                                        <div className="food-menu-itemss">
                                                            <div className="thumb">
                                                                <Image src="/assets/img/home-3/f-2.png" alt="img" width={92} height={92} />
                                                            </div>
                                                            <div className="content">
                                                                <h3 className="title">Happy Lunch Combo</h3>
                                                                <p>Burger, coke, fries, chicken nuggets</p>
                                                                <span className="price">$29</span>
                                                            </div>
                                                        </div>
                                                        <div className="food-menu-itemss">
                                                            <div className="thumb">
                                                                <Image src="/assets/img/home-3/f-3.png" alt="img" width={88} height={92} />
                                                            </div>
                                                            <div className="content">
                                                                <h3 className="title">Spicy Beef Burrito</h3>
                                                                <p>Burger, coke, fries, chicken nuggets</p>
                                                                <span className="price">$21</span>
                                                            </div>
                                                        </div>
                                                        <div className="food-menu-itemss">
                                                            <div className="thumb">
                                                                <Image src="/assets/img/home-3/f-4.png" alt="img" width={121} height={92} />
                                                            </div>
                                                            <div className="content">
                                                                <h3 className="title">Classic Chicken Tacos</h3>
                                                                <p>Burger, coke, fries, chicken nuggets</p>
                                                                <span className="price">$05</span>
                                                            </div>
                                                        </div>
                                                        <div className="food-button">
                                                            <Link href="/shop-details" className="theme-btn small-btn">Reserve Table
                                                             <i className="fa-regular fa-arrow-up-right"></i>
                                                        </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div id="Pizza" className="tab-pane fade">
                                                    <div className="food-menu-items-3">
                                                        <div className="food-menu-itemss">
                                                            <div className="thumb">
                                                                <Image src="/assets/img/home-3/f-1.png" alt="img" width={110} height={92} />
                                                            </div>
                                                            <div className="content">
                                                                <h3 className="title">Spicy Chicken Roll</h3>
                                                                <p>Burger, coke, fries, chicken nuggets</p>
                                                                <span className="price">$25</span>
                                                            </div>
                                                        </div>
                                                        <div className="food-menu-itemss">
                                                            <div className="thumb">
                                                                <Image src="/assets/img/home-3/f-2.png" alt="img" width={92} height={92} />
                                                            </div>
                                                            <div className="content">
                                                                <h3 className="title">Happy Lunch Combo</h3>
                                                                <p>Burger, coke, fries, chicken nuggets</p>
                                                                <span className="price">$29</span>
                                                            </div>
                                                        </div>
                                                        <div className="food-menu-itemss">
                                                            <div className="thumb">
                                                                <Image src="/assets/img/home-3/f-3.png" alt="img" width={88} height={92} />
                                                            </div>
                                                            <div className="content">
                                                                <h3 className="title">Spicy Beef Burrito</h3>
                                                                <p>Burger, coke, fries, chicken nuggets</p>
                                                                <span className="price">$21</span>
                                                            </div>
                                                        </div>
                                                        <div className="food-menu-itemss">
                                                            <div className="thumb">
                                                                <Image src="/assets/img/home-3/f-4.png" alt="img" width={121} height={92} />
                                                            </div>
                                                            <div className="content">
                                                                <h3 className="title">Classic Chicken Tacos</h3>
                                                                <p>Burger, coke, fries, chicken nuggets</p>
                                                                <span className="price">$05</span>
                                                            </div>
                                                        </div>
                                                        <div className="food-button">
                                                            <Link href="/shop-details" className="theme-btn small-btn">Reserve Table
                                                             <i className="fa-regular fa-arrow-up-right"></i>
                                                           </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div id="Fresh" className="tab-pane fade">
                                                    <div className="food-menu-items-3">
                                                        <div className="food-menu-itemss">
                                                            <div className="thumb">
                                                                <Image src="/assets/img/home-3/f-1.png" alt="img" width={110} height={92} />
                                                            </div>
                                                            <div className="content">
                                                                <h3 className="title">Spicy Chicken Roll</h3>
                                                                <p>Burger, coke, fries, chicken nuggets</p>
                                                                <span className="price">$25</span>
                                                            </div>
                                                        </div>
                                                        <div className="food-menu-itemss">
                                                            <div className="thumb">
                                                                <Image src="/assets/img/home-3/f-2.png" alt="img" width={92} height={92} />
                                                            </div>
                                                            <div className="content">
                                                                <h3 className="title">Happy Lunch Combo</h3>
                                                                <p>Burger, coke, fries, chicken nuggets</p>
                                                                <span className="price">$29</span>
                                                            </div>
                                                        </div>
                                                        <div className="food-menu-itemss">
                                                            <div className="thumb">
                                                                <Image src="/assets/img/home-3/f-3.png" alt="img" width={88} height={92} />
                                                            </div>
                                                            <div className="content">
                                                                <h3 className="title">Spicy Beef Burrito</h3>
                                                                <p>Burger, coke, fries, chicken nuggets</p>
                                                                <span className="price">$21</span>
                                                            </div>
                                                        </div>
                                                        <div className="food-menu-itemss">
                                                            <div className="thumb">
                                                                <Image src="/assets/img/home-3/f-4.png" alt="img" width={121} height={92} />
                                                            </div>
                                                            <div className="content">
                                                                <h3 className="title">Classic Chicken Tacos</h3>
                                                                <p>Burger, coke, fries, chicken nuggets</p>
                                                                <span className="price">$05</span>
                                                            </div>
                                                        </div>
                                                        <div className="food-button">
                                                            <Link href="/shop-details" className="theme-btn small-btn">Reserve Table
                                                             <i className="fa-regular fa-arrow-up-right"></i>
                                                        </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                                 <div id="Sushi" className="tab-pane fade">
                                                    <div className="food-menu-items-3">
                                                        <div className="food-menu-itemss">
                                                            <div className="thumb">
                                                                <Image src="/assets/img/home-3/f-1.png" alt="img" width={110} height={92} />
                                                            </div>
                                                            <div className="content">
                                                                <h3 className="title">Spicy Chicken Roll</h3>
                                                                <p>Burger, coke, fries, chicken nuggets</p>
                                                                <span className="price">$25</span>
                                                            </div>
                                                        </div>
                                                        <div className="food-menu-itemss">
                                                            <div className="thumb">
                                                                <Image src="/assets/img/home-3/f-2.png" alt="img" width={92} height={92} />
                                                            </div>
                                                            <div className="content">
                                                                <h3 className="title">Happy Lunch Combo</h3>
                                                                <p>Burger, coke, fries, chicken nuggets</p>
                                                                <span className="price">$29</span>
                                                            </div>
                                                        </div>
                                                        <div className="food-menu-itemss">
                                                            <div className="thumb">
                                                                <Image src="/assets/img/home-3/f-3.png" alt="img" width={88} height={92} />
                                                            </div>
                                                            <div className="content">
                                                                <h3 className="title">Spicy Beef Burrito</h3>
                                                                <p>Burger, coke, fries, chicken nuggets</p>
                                                                <span className="price">$21</span>
                                                            </div>
                                                        </div>
                                                        <div className="food-menu-itemss">
                                                            <div className="thumb">
                                                                <Image src="/assets/img/home-3/f-4.png" alt="img" width={121} height={92} />
                                                            </div>
                                                            <div className="content">
                                                                <h3 className="title">Classic Chicken Tacos</h3>
                                                                <p>Burger, coke, fries, chicken nuggets</p>
                                                                <span className="price">$05</span>
                                                            </div>
                                                        </div>
                                                        <div className="food-button">
                                                            <Link href="/shop-details" className="theme-btn small-btn">Reserve Table
                                                             <i className="fa-regular fa-arrow-up-right"></i>
                                                        </Link>
                                                        </div>
                                                    </div>
                                                 </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-lg-6 col-md-6 order-2 order-xl-3 wow fadeInUp" data-wow-delay=".5s">
                                        <div className="food-menu-image-2">
                                            <Image src="/assets/img/home-3/food-menu-2.jpg" alt="img" width={393} height={512} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Gallery Section Start */}
                    <div className="gallery-section fix">
                        <div className="container">
                            <div className="section-title text-center mb-0">
                                <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">Our Food Gallery</span>
                                <h2 className="tx-title sec_title  tz-itm-title tz-itm-anim">
                                    Let’s See our Fast Food Category
                                </h2>
                                <div className="sec-line mt-3">
                                    <Image src="/assets/img/home-1/sec-line.png" alt="img" width={263} height={23} />
                                </div>
                            </div>
                        </div>
                        <div className="gallery-area">
                            <div className="gallery-shape-1">
                                <Image src="/assets/img/home-2/gallery-shape.png" alt="img" width={1920} height={84} />
                            </div>
                            <div className="gallery-shape-2">
                                <Image src="/assets/img/home-2/gallery-shape2.png" alt="img" width={1920} height={84} />
                            </div>
                            <Slider
      preset="galler-slider"
      slides={[
        { content: (
          <>

                                        <div className="gallery-block-one">
                                            <Image src="/assets/img/home-2/gallery-1.jpg" alt="img" width={665} height={628} />
                                        </div>
          </>
        ) },
        { content: (
          <>

                                        <div className="gallery-block-one">
                                            <Image src="/assets/img/home-2/gallery-2.jpg" alt="img" width={665} height={628} />
                                        </div>
          </>
        ) },
        { content: (
          <>

                                        <div className="gallery-block-one">
                                            <Image src="/assets/img/home-2/gallery-3.jpg" alt="img" width={665} height={628} />
                                        </div>
          </>
        ) },
      ]}
    />
                        </div>
                        <div className="container">
                            <div className="gallery-btn">
                                <Link href="/gallery" className="theme-btn small-btn">View Our Gallery <i className="fa-light fa-arrow-up-right"></i></Link>
                            </div>
                        </div>
                    </div>

                    {/* Best Delivery Start */}
                    <section className="best-delivery-section fix section-padding">
                        <div className="container">
                            <div className="best-delivery-wrapper">
                                <div className="row g-4">
                                    <div className="col-xl-4 col-lg-6 cols-item-1">
                                        <div className="content">
                                            <div className="section-title mb-0">
                                                <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">Best Delivery</span>
                                                <h2 className="tx-title sec_title  tz-itm-title tz-itm-anim">
                                               Choose what you want, select a pick up time
                                                </h2>
                                                <div className="sec-line mt-3">
                                                    <Image src="/assets/img/home-1/sec-line.png" alt="img" width={263} height={23} />
                                                </div>
                                            </div>
                                            <p className="text wow fadeInUp" data-wow-delay=".3s">
                                                As well known and we are very busy all days advice you. advice you to call us of before arriving, so we can guarantee your seat.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-xl-5 cols-item-3">
                                        <div className="delivery-items text-center">
                                            <div className="delivery-image float-bob-x">
                                                <Image src="/assets/img/home-1/delivery-image.png" alt="img" width={392} height={336} />
                                            </div>
                                            <Link href="/shop-details" className="theme-btn small-btn">Order Now <i className="fa-solid fa-basket-shopping"></i></Link>
                                        </div>
                                    </div>
                                     <div className="col-xl-3 col-lg-6 cols-item-2">
                                        <div className="content-2">
                                            <div className="section-title mb-0">
                                                <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">Earn The Points</span>
                                                <h2 className="tx-title sec_title  tz-itm-title tz-itm-anim">
                                                    Earn points every time you order online
                                                </h2>
                                                <div className="sec-line mt-3">
                                                    <Image src="/assets/img/home-1/sec-line.png" alt="img" width={263} height={23} />
                                                </div>
                                            </div>
                                           <div className="info-items wow fadeInUp" data-wow-delay=".5s">
                                                <p>
                                                    We have global customer of  agriculturel products
                                                </p>
                                                <div className="info-img">
                                                    <Image src="/assets/img/home-1/info.png" alt="img" width={172} height={64} />
                                                </div>
                                           </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Discount Banner Start */}
                    <section className="discount-banner-section-4 fix hero-ptb image-distortion p-relative z-index-1" data-background="/_next/image?url=%2Fassets%2Fimg%2Fhome-4%2Fbanner-bg.jpg&w=1920&q=75">
                        <div className="bottom-shape">
                            <Image src="/assets/img/home-4/banner.png" alt="img" width={1920} height={50} />
                        </div>
                        <div className="tomato-shape float-bob-x">
                            <Image src="/assets/img/home-4/tomato-2.png" alt="img" width={239} height={245} />
                        </div>
                        <div className="offer float-bob-y">
                            <Image src="/assets/img/home-4/offer.png" alt="img" width={331} height={234} />
                        </div>
                        <div className="left-shape float-bob-y">
                            <Image src="/assets/img/home-4/rice.png" alt="img" width={234} height={321} />
                        </div>
                        <div className="pizza-shape">
                            <Image src="/assets/img/home-4/pizza-5.png" alt="" width={757} height={721} />
                        </div>
                        <div className="container">
                            <div className="row g-4 align-items-end">
                            <div className="col-lg-6">
                                <div className="discount-banner-content-4">
                                    <h2 className="tx-title sec_title  tz-itm-title tz-itm-anim">Delicious</h2>
                                    <p>
                                        Our culinary sanctuary, where every dish tells a story every bite is an adventure.
                                    </p>
                                    <div className="red-image">
                                        <Image src="/assets/img/home-4/red-shape.png" alt="img" width={483} height={64} />
                                        <span>50% Discount Offer</span>
                                    </div>
                                    <Link href="/shop" className="theme-btn  small-btn">Browse Offers
                                        <i className="fa-regular fa-arrow-up-right"></i>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="right-content">
                                    <h2 className="tx-title sec_title  tz-itm-title tz-itm-anim">Pizza</h2>
                                </div>
                            </div>
                        </div>
                        </div>
                    </section>

                     {/* Testimonial Section Start */}
                    <section className="testimonial-section-3 section-padding fix">
                        <div className="left-shape float-bob-y">
                            <Image src="/assets/img/home-3/burger.png" alt="img" width={213} height={164} />
                        </div>
                        <div className="right-shape float-bob-y">
                            <Image src="/assets/img/home-3/pizza.png" alt="img" width={144} height={335} />
                        </div>
                        <div className="container">
                             <div className="testimonial-wrapper-3">
                                <div className="row g-4">
                                <div className="col-lg-4">
                                    <div className="testimonial-content">
                                        <div className="section-title">
                                            <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">Our Testimonials</span>
                                            <h2 className="tx-title sec_title  tz-itm-title tz-itm-anim">
                                                Our Clients <br /> Testimonials
                                            </h2>
                                            <div className="sec-line mt-3 mb-4">
                                                <Image src="/assets/img/home-1/sec-line.png" alt="img" width={263} height={23} />
                                            </div>
                                        </div>
                                        <div className="rating-box wow fadeInUp" data-wow-delay=".3s">
                                            <div className="review-content">
                                                <h2>4.6</h2>
                                                <span>3223+ Reviews</span>
                                            </div>
                                            <div className="rating-content">
                                                <h3>Average Rating</h3>
                                                <div className="rating-image">
                                                    <Image src="/assets/img/home-3/star.png" alt="img" width={25} height={25} />
                                                    <Image src="/assets/img/home-3/star.png" alt="img" width={25} height={25} />
                                                    <Image src="/assets/img/home-3/star.png" alt="img" width={25} height={25} />
                                                    <Image src="/assets/img/home-3/star.png" alt="img" width={25} height={25} />
                                                    <Image src="/assets/img/home-3/star.png" alt="img" width={25} height={25} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-8">
                                    <div className="testimonial-right-item">
                                        <Slider
      preset="testimonial-slider-3"
      slides={[
        { content: (
          <>

                                                    <div className="testimonial-card-item">
                                                        <div className="icon">
                                                            <img src="/assets/img/home-3/icon/07.svg" alt="img" />
                                                        </div>
                                                        <div className="content-item">
                                                            <div className="left-content">
                                                                <h4>RATED 4.9/5</h4>
                                                                <Image src="/assets/img/home-3/google.png" alt="img" width={20} height={20} />
                                                            </div>
                                                            <div className="right-content">
                                                                <h5>“Best In Town”</h5>
                                                                <p>
                                                                    On the other hand denounce righteous indignation and dislike men who beguile and demoralize charms pleasure the moment.
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="info-item">
                                                            <img src="/assets/img/home-3/icon/06.svg" alt="img" />
                                                            <Image src="/assets/img/home-3/client-1.png" alt="img" width={46} height={46} />
                                                            <div className="content">
                                                                <h6>Somilla D. Silva</h6>
                                                                <span>Green Garden Owner</span>
                                                            </div>
                                                        </div>
                                                    </div>
          </>
        ) },
        { content: (
          <>

                                                    <div className="testimonial-card-item">
                                                        <div className="icon">
                                                            <img src="/assets/img/home-3/icon/07.svg" alt="img" />
                                                        </div>
                                                        <div className="content-item">
                                                            <div className="left-content">
                                                                <h4>RATED 4.9/5</h4>
                                                                <Image src="/assets/img/home-3/google.png" alt="img" width={20} height={20} />
                                                            </div>
                                                            <div className="right-content">
                                                                <h5>“Best In Town”</h5>
                                                                <p>
                                                                    On the other hand denounce righteous indignation and dislike men who beguile and demoralize charms pleasure the moment.
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="info-item">
                                                            <img src="/assets/img/home-3/icon/06.svg" alt="img" />
                                                            <Image src="/assets/img/home-3/client-1.png" alt="img" width={46} height={46} />
                                                            <div className="content">
                                                                <h6>Somilla D. Silva</h6>
                                                                <span>Green Garden Owner</span>
                                                            </div>
                                                        </div>
                                                    </div>
          </>
        ) },
      ]}
    />
                                        <div className="arrow-button">
                                            <button className="array-prev">
                                                <i className="fa-solid fa-arrow-left-long"></i>
                                            </button>
                                            <button className="array-next">
                                                <i className="fa-solid fa-arrow-right-long"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                             </div>
                            <div className="brand-wrapper-3">
                                <Slider
      preset="brand-slider-5"
      slides={[
        { content: (
          <>

                                            <div className="brand-image text-center">
                                                <Image src="/assets/img/home-3/b-1.png" alt="img" width={112} height={57} />
                                            </div>
          </>
        ) },
        { content: (
          <>

                                            <div className="brand-image text-center">
                                                <Image src="/assets/img/home-3/b-2.png" alt="img" width={131} height={79} />
                                            </div>
          </>
        ) },
        { content: (
          <>

                                            <div className="brand-image text-center">
                                                <Image src="/assets/img/home-3/b-3.png" alt="img" width={134} height={61} />
                                            </div>
          </>
        ) },
        { content: (
          <>

                                            <div className="brand-image text-center">
                                                <Image src="/assets/img/home-3/b-4.png" alt="img" width={103} height={83} />
                                            </div>
          </>
        ) },
        { content: (
          <>

                                            <div className="brand-image text-center">
                                                <Image src="/assets/img/home-3/b-5.png" alt="img" width={119} height={67} />
                                            </div>
          </>
        ) },
        { content: (
          <>

                                            <div className="brand-image text-center">
                                                <Image src="/assets/img/home-3/b-6.png" alt="img" width={144} height={55} />
                                            </div>
          </>
        ) },
      ]}
    />
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
