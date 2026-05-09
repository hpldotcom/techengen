import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BallTriangle } from "react-loader-spinner";
import { CartContent } from "../../Context/cartContent";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import API, { getImageUrl } from "../../api/api";
import styles from "./Details.module.css";


function Details() {
  const [details, setDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  let { addToCart } = useContext(CartContent);
  let params = useParams();

  async function getProductDetails() {
    try {
      let { data } = await API.get(`/products/${params.id}`);
      setDetails(data);
      setActiveImage(0);
    } catch (err) {
      console.error("Error fetching product:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function addCart() {
    addToCart(details);
    toast.success(`${details.name} added to cart!`);
  }

  useEffect(() => {
    getProductDetails();
  }, [params.id]);

  /** All images for this product — always fully qualified URLs */
  const allImages =
    details.images && details.images.length > 0
      ? details.images.map((img) => getImageUrl(img.imageUrl)).filter(Boolean)
      : details.imageUrl
        ? [getImageUrl(details.imageUrl)]
        : [];

  const currentImage =
    allImages[activeImage] || "https://placehold.co/500x500?text=No+Image";

  /**
   * Parse the description text into a list of spec rows.
   * Lines that look like "Key: Value" are treated as specs.
   * Plain lines are treated as notes.
   */
  function parseDescription(desc) {
    if (!desc) return { specs: [], notes: [] };
    const lines = desc
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const specs = [];
    const notes = [];
    for (const line of lines) {
      const colonIdx = line.indexOf(":");
      if (colonIdx > 0 && colonIdx < line.length - 1) {
        const key = line.slice(0, colonIdx).trim();
        const val = line.slice(colonIdx + 1).trim();
        if (key && val) {
          specs.push({ key, val });
          continue;
        }
      }
      notes.push(line);
    }

    return { specs, notes };
  }

  const { specs, notes } = parseDescription(details.description);
  const vid = {
    category: "CPUs",
  };
  const vidtwo = {
    category: "RAM",
  };
  const vidthree = {
    category: "GPUs",

  };
  const vidfour = {
    category: "motherboards",
  };
  const vidfive = {
    category: "storages",
  };
  return (
    <>
      <div className="container py-4">
        {isLoading ? (
          <div className="py-5 d-flex justify-content-center">
            <BallTriangle
              height={100}
              width={100}
              radius={5}
              color="var(--primary)"
              ariaLabel="loading"
              visible={true}
            />
          </div>
        ) : (
          <div className={styles.detailsWrap}>
            <Helmet>
              <title>{details.name} | Shop</title>
            </Helmet>

            <div className="row g-0">
              {/* ── Image Gallery Section ───────────────────────────── */}
              <div className="col-md-6">
                <div className={styles.imageSection}>
                  {/* Main image */}
                  <div className={styles.mainImageWrap}>
                    <img
                      src={currentImage}
                      className={styles.mainImage}
                      alt={details.name}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/500";
                      }}
                    />
                  </div>
                  <div className={styles.vid}>
                    <h2>totorial:</h2>
                    {details.category.name === vid.category ? (
                      <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/qfeeVzxO7hw?si=wne-c88BtPJDhROe"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen
                      ></iframe>
                    ) : (
                      ""
                    )}
                    {details.category.name === vidtwo.category ? (
                      <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/sqtubYn07Nk?si=m0PKT4bHNHgdKXSM"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen
                      ></iframe>
                    ) : (
                      ""
                    )}
                    {details.category.name === vidthree.category ? (
                      <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/BI-Z-XwFrTw?si=LsLi6GAB7znppXXg"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen
                      ></iframe>
                    ) : (
                      ""
                    )}
                    {details.category.name === vidfour.category ? (
                      <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/rV2_6ZjYtZM?si=jirp6KsF4cvRk6Dt"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen
                      ></iframe>
                    ) : (
                      ""
                    )}
                    {details.category.name === vidfive.category ? (
                      <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/Bvgl4cTAD6A?si=pZxd_055d-un7qEn"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen
                      ></iframe>
                    ) : (
                      ""
                    )}
                  </div>

                  {/* Thumbnail strip — only shown when more than 1 image */}
                  {allImages.length > 1 && (
                    <div className={styles.thumbnailStrip}>
                      {allImages.map((img, idx) => (
                        <button
                          key={idx}
                          className={`${styles.thumbBtn} ${idx === activeImage ? styles.thumbActive : ""}`}
                          onClick={() => setActiveImage(idx)}
                          aria-label={`View image ${idx + 1}`}
                        >
                          <img
                            src={img}
                            alt={`${details.name} view ${idx + 1}`}
                            className={styles.thumbImg}
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/80x80?text=img";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Info Section ────────────────────────────────────── */}
              <div className="col-md-6">
                <div className={styles.infoSection}>
                  {/* Category + Brand row */}
                  <div className={styles.metaTopRow}>
                    {details.category?.name && (
                      <span className={styles.categoryLabel}>
                        {details.category.name}
                      </span>
                    )}
                    {details.brand && (
                      <div className={styles.brandDisplay}>
                        {details.brand.logoUrl ? (
                          <img
                            src={getImageUrl(details.brand.logoUrl)}
                            alt={details.brand.name}
                            className={styles.brandLogoLg}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className={styles.brandNameLg}>
                            {details.brand.name}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <h1 className={styles.title}>{details.name}</h1>

                  <div className={styles.priceWrap}>
                    <span className={styles.price}>
                      {Number(details.price).toLocaleString()} EGP
                    </span>
                  </div>

                  {/* Stock + Shipping meta */}
                  <div className={styles.metaWrap}>
                    <div className={styles.metaItem}>
                      <div className={styles.metaIcon}>
                        <i className="fa-solid fa-boxes-stacked"></i>
                      </div>
                      <div className={styles.metaText}>
                        <span className={styles.metaLabel}>Availability</span>
                        <span
                          className={styles.metaValue}
                          style={{
                            color:
                              details.stock > 0
                                ? "var(--secondary)"
                                : "#ef4444",
                          }}
                        >
                          {details.stock > 0
                            ? `${details.stock} in stock`
                            : "Out of stock"}
                        </span>
                      </div>
                    </div>
                    <div className={styles.metaItem}>
                      <div className={styles.metaIcon}>
                        <i className="fa-solid fa-truck-fast"></i>
                      </div>
                      <div className={styles.metaText}>
                        <span className={styles.metaLabel}>Shipping</span>
                        <span className={styles.metaValue}>Free Delivery</span>
                      </div>
                    </div>
                  </div>

                  {/* Add to cart */}
                  <div className={styles.actionArea}>
                    <button
                      onClick={addCart}
                      className={`btn-premium ${styles.btnLarge}`}
                      disabled={details.stock === 0}
                    >
                      <i className="fa-solid fa-cart-plus"></i>
                      {details.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>

                  {/* Specs table */}
                  {specs.length > 0 && (
                    <div className={styles.specsSection}>
                      <h2 className={styles.specsTitle}>Specifications</h2>
                      <div className={styles.specsTable}>
                        {specs.map(({ key, val }, i) => (
                          <div
                            key={i}
                            className={`${styles.specRow} ${i % 2 === 0 ? styles.specRowEven : ""}`}
                          >
                            <span className={styles.specKey}>{key}</span>
                            <span className={styles.specVal}>{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Plain-text notes */}
                  {notes.length > 0 && (
                    <div className={styles.notesSection}>
                      {notes.map((note, i) => (
                        <p key={i} className={styles.noteText}>
                          {note}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Details;
