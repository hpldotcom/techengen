import React, { useContext } from 'react';
import { BallTriangle } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CartContent } from '../../Context/cartContent';
import toast from 'react-hot-toast';
import API, { getImageUrl } from '../../api/api';
import styles from '../Products/Products.module.css';
import CategoriesSlider from '../CategoriesSlider/CategoriesSlider';

function FeatureProducts({ selectedCategoryId = null, setSelectedCategoryId }) {
  let { addToCart } = useContext(CartContent);

  function getProducts() {
    return API.get("/products");
  }

  let { isLoading, isError, error, data } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: getProducts
  });

  async function addCart(e, product) {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  }

  // Filter products if a category is selected
  const displayedProducts = data?.data?.filter((product) => {
    if (selectedCategoryId === null) return true;
    return product.categoryId === selectedCategoryId;
  });

  /** Get the primary image for a product (from images[] array or fallback to imageUrl) */
  function getPrimaryImage(product) {
    if (product.images && product.images.length > 0) {
      return getImageUrl(product.images[0].imageUrl) || 'https://placehold.co/200x200?text=No+Image';
    }
    return getImageUrl(product.imageUrl) || 'https://placehold.co/200x200?text=No+Image';
  }

  return (
    <div className="container py-5">
      <h2 className={styles.sectionTitle}>Featured Products</h2>

      <div className="mb-5">
        <CategoriesSlider
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
        />
      </div>

      {isLoading ? (
        <div className="py-5 text-center d-flex justify-content-center">
          <BallTriangle height={80} width={80} radius={5} color="var(--primary)" ariaLabel="loading" visible={true} />
        </div>
      ) : isError ? (
        <div className="col-12 text-center py-5">
          <div style={{ background: 'var(--surface)', padding: 40, borderRadius: 'var(--radius-lg)' }}>
            <i className="fa-solid fa-triangle-exclamation mb-3" style={{ fontSize: 60, color: 'var(--border)' }}></i>
            <h3>Failed to load products</h3>
            <p className="text-muted">{error?.message || 'Please check the backend API and reload.'}</p>
          </div>
        </div>
      ) : (
        <div className="row g-4 justify-content-center">
          {displayedProducts?.length > 0 ? (
            displayedProducts.map((ele) => (
              <div key={ele.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <Link to={`/details/${ele.id}`} className="text-decoration-none">
                  <div className={styles.productCard}>
                    <div className={styles.imageWrap}>
                      <img
                        src={getPrimaryImage(ele)}
                        className={styles.productImage}
                        alt={ele.name}
                        onError={e => { e.target.src = 'https://placehold.co/200x200?text=No+Image'; }}
                      />
                      {ele.category?.name && (
                        <span className={styles.categoryPill}>{ele.category.name}</span>
                      )}
                      {ele.images?.length > 1 && (
                        <span className={styles.imageCountBadge}>
                          <i className="fa-solid fa-images"></i> {ele.images.length}
                        </span>
                      )}
                    </div>

                    {/* Brand badge */}
                    {ele.brand && (
                      <div className={styles.brandBadge}>
                        {ele.brand.logoUrl ? (
                          <img
                            src={getImageUrl(ele.brand.logoUrl)}
                            alt={ele.brand.name}
                            className={styles.brandLogo}
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <span className={styles.brandName}>{ele.brand.name}</span>
                        )}
                      </div>
                    )}

                    <h3 className={styles.productTitle}>{ele.name}</h3>
                    <div className={styles.productPrice}>{Number(ele.price).toLocaleString()} EGP</div>

                    <button onClick={(e) => addCart(e, ele)} className={styles.btnAdd}>
                      <i className="fa-solid fa-cart-plus"></i> Add to Cart
                    </button>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div style={{ background: 'var(--surface)', padding: 40, borderRadius: 'var(--radius-lg)' }}>
                <i className="fa-solid fa-box-open mb-3" style={{ fontSize: 60, color: 'var(--border)' }}></i>
                <h3>No Products Found</h3>
                <p className="text-muted">There are no products available in this category yet.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FeatureProducts;
