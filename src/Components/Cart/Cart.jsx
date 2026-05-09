import React, { useContext, useEffect, useState } from 'react';
import { CartContent } from '../../Context/cartContent';
import { BallTriangle } from 'react-loader-spinner';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';
import API from '../../api/api';
import { useNavigate } from 'react-router-dom';
import styles from './Cart.module.css';

export default function Cart() {
  const [cartDetails, setCartDetails] = useState(null);
  const navigate = useNavigate();

  let { getCart, deleteProductFromCart, updateProductQuantity, setNumOfCartItems, cartItems, clearCart } = useContext(CartContent);

  async function removeItem(id) {
    let { data } = await deleteProductFromCart(id);
    setNumOfCartItems(data?.numOfCartItems);
    setCartDetails(data);
  }

  async function updateCount(id, count) {
    let { data } = await updateProductQuantity(id, count);
    setCartDetails(data);
  }

  async function getCartDetails() {
    let { data } = await getCart();
    setNumOfCartItems(data?.numOfCartItems);
    setCartDetails(data);
  }

  async function placeOrder() {
    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    navigate('/checkout');
  }

  useEffect(() => {
    getCartDetails();
  }, []);

  return (
    <>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      
      {!cartDetails ? (
        <div className="py-5 d-flex justify-content-center">
          <BallTriangle height={100} width={100} radius={5} color="var(--primary)" ariaLabel="loading" visible={true} />
        </div>
      ) : (
        <div className={`container ${styles.cartContainer}`}>
          <div className={styles.cartHeader}>
            <h1 className={styles.cartTitle}>Your Cart</h1>
            <span className={styles.itemCount}>{cartDetails.numOfCartItems} Items</span>
          </div>

          {cartDetails.data.products.length === 0 ? (
            <div className="text-center py-5" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)' }}>
              <i className="fa-solid fa-cart-shopping mb-3" style={{ fontSize: 60, color: 'var(--border)' }}></i>
              <h3>Your cart is empty</h3>
              <p className="text-muted mb-4">Looks like you haven't added anything yet.</p>
              <button className="btn-premium" onClick={() => navigate('/products')}>Continue Shopping</button>
            </div>
          ) : (
            <div className={styles.cartRow}>
              {/* Items List */}
              <div className={styles.cartItemsList}>
                {cartDetails.data.products.map((ele) => (
                  <div key={ele.product.id} className={styles.cartItem}>
                    <div className={styles.itemImageWrap}>
                      {/* To this: */}
                        <img 
                          src={ele.product.imageUrl ? `http://localhost:5000${ele.product.imageUrl}` : 'https://via.placeholder.com/100'} 
                          className={styles.itemImage} 
                          alt={ele.product.name}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
                        />
                    </div>
                    <div className={styles.itemInfo}>
                      <h4 className={styles.itemName}>{ele.product.name}</h4>
                      <p className={styles.itemPrice}>{Number(ele.price).toFixed(2)} EGP</p>
                    </div>
                    <div className={styles.itemActions}>
                      <button onClick={() => updateCount(ele.product.id, ele.count - 1)} className={styles.btnQty}>-</button>
                      <span className={styles.itemTotal}>{ele.count}</span>
                      <button onClick={() => updateCount(ele.product.id, ele.count + 1)} className={styles.btnQty}>+</button>
                    </div>
                    <button onClick={() => removeItem(ele.product.id)} className={styles.btnRemove} title="Remove Item">
                      <i className='fa-solid fa-trash-can'></i>
                    </button>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className={styles.summaryCard}>
                <h3 className={styles.summaryTitle}>Order Summary</h3>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{Number(cartDetails.data.totalCartPrice).toFixed(2)} EGP</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>Free</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
                
                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>{Number(cartDetails.data.totalCartPrice).toFixed(2)} EGP</span>
                </div>

                <button onClick={placeOrder} className={`btn-premium ${styles.btnCheckout}`}>
                  Place Order <i className="fa-solid fa-arrow-right ms-2"></i>
                </button>
                
                <div className={styles.trustRow}>
                  {[
                    { icon: 'fa-lock', label: 'Secure' },
                    { icon: 'fa-truck-fast', label: 'Free Shipping' },
                    { icon: 'fa-rotate-left', label: 'Free Returns' },
                  ].map(({ icon, label }) => (
                    <div key={label} className={styles.trustItem}>
                      <i className={`fa-solid ${icon}`}></i>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}