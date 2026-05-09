import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { BallTriangle } from 'react-loader-spinner';
import { Link, useLocation } from 'react-router-dom';
import API from '../../api/api';
import styles from './Allorders.module.css';

export default function Allorders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Checking if we just came from checkout
  const location = useLocation();
  const isFromCheckout = true; // We can assume success if they land here, or refine logic

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) return;
        
        let { data } = await API.get(`/orders/my-orders`);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    switch(status?.toUpperCase()) {
      case 'PENDING':   return styles.pending;
      case 'SHIPPED':   return styles.shipped;
      case 'DELIVERED': return styles.delivered;
      default:          return styles.pending;
    }
  };

  return (
    <>
      <Helmet>
        <title>My Orders | Shop</title>
      </Helmet>
      
      <div className={`container ${styles.pageContainer}`}>
        {isFromCheckout && (
          <div className={styles.successBanner}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: 48, marginBottom: 16 }}></i>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for shopping with us. Your order is being processed.</p>
            <Link to="/home" className={styles.btnReturn}>Continue Shopping</Link>
          </div>
        )}

        <h3 className={styles.sectionTitle}>Order History</h3>
        
        {isLoading ? (
          <div className="py-5 d-flex justify-content-center">
            <BallTriangle height={80} width={80} radius={5} color="var(--primary)" ariaLabel="loading" visible={true} />
          </div>
        ) : (
          <div className="row g-4">
            {orders.length > 0 ? orders.map((order) => (
              <div key={order.id} className="col-md-6 col-lg-4">
                <div className={`${styles.orderCard} ${getStatusClass(order.status)}`}>
                  <div className={styles.orderHeader}>
                    <span className={styles.orderId}>Order #{order.id}</span>
                    <span className={styles.orderTotal}>{Number(order.totalPrice).toFixed(2)} EGP</span>
                  </div>
                  
                  <div className={styles.statusWrap}>
                    <span className={styles.statusLabel}>Status:</span>
                    <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className={styles.statusWrap}>
                    <span className={styles.statusLabel}>Date:</span>
                    <span style={{ fontSize: 13, color: 'var(--text-dark)', fontWeight: 600 }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <hr style={{ borderColor: 'var(--border-light)', margin: '16px 0' }} />
                  
                  <span className={styles.statusLabel} style={{ display: 'block', marginBottom: 12 }}>Items ({order.orderItems?.length || 0}):</span>
                  <div className={styles.itemsGrid}>
                    {order.orderItems?.map((item) => (
                      <div key={item.id} className={styles.itemThumb} title={item.product?.name}>
                        <img 
                            src={item.product.imageUrl ? `http://localhost:5000${item.product.imageUrl}` : 'https://via.placeholder.com/60'} 
                            alt={item.product.name}
                            style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                          />
                        <span className={styles.itemQty}>{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-12 text-center py-5">
                <div style={{ background: 'var(--surface)', padding: 40, borderRadius: 'var(--radius-lg)' }}>
                  <i className="fa-solid fa-box-open mb-3" style={{ fontSize: 60, color: 'var(--border)' }}></i>
                  <h3>No Orders Found</h3>
                  <p className="text-muted">You haven't placed any orders yet.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

