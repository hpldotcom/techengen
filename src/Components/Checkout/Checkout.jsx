import { useFormik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { CartContent } from '../../Context/cartContent';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../api/api';
import styles from './Checkout.module.css';

export default function Checkout() {
  const { cartItems } = useContext(CartContent);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const validationSchema = Yup.object().shape({
    details: Yup.string().required('Details are required').min(3, 'Details are too short'),
    phone: Yup.string().matches(/^01[0125][0-9]{8}$/, 'Phone must be a valid Egyptian number').required('Phone is required'),
    city: Yup.string().required('City is required'),
  });

  const formik = useFormik({
    initialValues: { details: '', phone: '', city: '' },
    validationSchema,
    onSubmit: async (values) => {
      if (!cartItems || cartItems.length === 0) {
        toast.error('Your cart is empty');
        return;
      }

      setIsSubmitting(true);

      try {
        const items = cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.count,
        }));

        const response = await API.post('/orders', {
          items,
          shippingDetails: values.details,
          phone: values.phone,
          city: values.city,
        });

        setOrderId(response.data.id);
        navigate(`/payment-frame/${response.data.id}`);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to create order');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Checkout | Shop</title>
        </Helmet>
        <div className="container py-5 text-center">
          <h2>No items in cart</h2>
          <p>Please add products to your cart before checking out.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Shop</title>
      </Helmet>

      <div className={`container page-enter ${styles.pageWrap}`}>
        <div className={styles.checkoutGrid}>
          {/* Form Card */}
          <div className={`glass-panel ${styles.formCard}`}>
            <div className={styles.formHeader}>
              <i className="fa-solid fa-location-dot"></i>
              <div>
                <h2 className={styles.formTitle}>Shipping Address</h2>
                <p className={styles.formSubtitle}>Where should we deliver your order?</p>
              </div>
            </div>

            <form onSubmit={formik.handleSubmit}>
              {[
                { name: 'details', label: 'Delivery Details', placeholder: 'e.g. Floor 3, Apt 12, near X landmark', icon: 'fa-house' },
                { name: 'phone', label: 'Phone Number', placeholder: '01XXXXXXXXX', icon: 'fa-phone' },
                { name: 'city', label: 'City', placeholder: 'e.g. Cairo, Alexandria…', icon: 'fa-city' },
              ].map(({ name, label, placeholder, icon }) => (
                <div key={name} className={styles.fieldGroup}>
                  <label htmlFor={name} className={styles.label}>
                    <i className={`fa-solid ${icon}`}></i> {label}
                  </label>
                  <input
                    type="text"
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    className={`modern-input ${formik.errors[name] && formik.touched[name] ? styles.inputError : ''}`}
                    value={formik.values[name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors[name] && formik.touched[name] && (
                    <div className={styles.errorMsg}>
                      <i className="fa-solid fa-circle-exclamation"></i> {formik.errors[name]}
                    </div>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={!(formik.isValid && formik.dirty)}
                className={`btn-premium w-100 ${styles.submitBtn}`}
              >
                <i className="fa-solid fa-shield-halved"></i>
                {isSubmitting ? 'Processing...' : 'Confirm & Pay'}
              </button>
            </form>
          </div>

          {/* Trust Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.trustCard}>
              <h4 className={styles.trustTitle}>Why Shop With Us?</h4>
              {[
                { icon: 'fa-truck-fast', title: 'Free Delivery', sub: 'On all orders, no minimum.' },
                { icon: 'fa-rotate-left', title: 'Easy Returns', sub: '30-day hassle-free returns.' },
                { icon: 'fa-lock', title: 'Secure Payment', sub: 'Your data is fully encrypted.' },
                { icon: 'fa-headset', title: '24/7 Support', sub: 'We\'re always here to help.' },
              ].map(({ icon, title, sub }) => (
                <div key={title} className={styles.trustItem}>
                  <div className={styles.trustIcon}><i className={`fa-solid ${icon}`}></i></div>
                  <div>
                    <div className={styles.trustItemTitle}>{title}</div>
                    <div className={styles.trustItemSub}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}