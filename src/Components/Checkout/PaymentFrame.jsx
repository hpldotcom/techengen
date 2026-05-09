import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../api/api';
import styles from './Checkout.module.css';
import { CartContent } from '../../Context/cartContent';

export default function PaymentFrame() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContent);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const validationErrors = {};
    const digitsOnlyCard = cardNumber.replace(/\D/g, '');
    const expiryValue = expiry.trim();

    if (!cardNumber.trim()) {
      validationErrors.cardNumber = 'Card number is required.';
    } else if (!/^\d{16}$/.test(digitsOnlyCard)) {
      validationErrors.cardNumber = 'Card number must contain 16 digits.';
    }

    if (!cardName.trim()) {
      validationErrors.cardName = 'Card holder name is required.';
    } else if (cardName.trim().length < 3) {
      validationErrors.cardName = 'Enter the full name as shown on the card.';
    }

    if (!expiryValue) {
      validationErrors.expiry = 'Expiry date is required.';
    } else {
      const expiryMatch = expiryValue.match(/^(\d{2})\/(\d{2})$/);
      if (!expiryMatch) {
        validationErrors.expiry = 'Expiry must be MM/YY.';
      } else {
        const month = Number(expiryMatch[1]);
        const year = Number(expiryMatch[2]);
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        if (month < 1 || month > 12) {
          validationErrors.expiry = 'Expiry month must be between 01 and 12.';
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
          validationErrors.expiry = 'Card expiry date must be in the future.';
        }
      }
    }

    if (!cvv.trim()) {
      validationErrors.cvv = 'CVV is required.';
    } else if (!/^\d{3,4}$/.test(cvv.trim())) {
      validationErrors.cvv = 'CVV must be 3 or 4 digits.';
    }

    setErrors(validationErrors);
    return validationErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await API.post(`/payment/${orderId}`);
      setPaymentCompleted(true);
      clearCart();
      toast.success(response.data.message || 'Payment completed successfully');
      setTimeout(() => navigate('/allorders'), 800);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.paymentCard} style={{ maxWidth: 680, margin: '40px auto' }}>
      <h2 style={{ marginBottom: 20 }}>Visa Secure Payment</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
        Use the fake Visa form below to complete your order.
      </p>

      <div style={{ display: 'grid', gap: 24 }}>
        <div
          style={{
            padding: 24,
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            color: '#fff',
            minHeight: 180,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <span style={{ fontSize: 14, opacity: 0.8 }}>VISA</span>
            <span style={{ fontSize: 16, fontWeight: 700 }}>Secure</span>
          </div>
          <div style={{ fontSize: 24, letterSpacing: 3, marginBottom: 18 }}>{cardNumber}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>CARD HOLDER</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{cardName}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>EXPIRES</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{expiry}</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <label className={styles.label} htmlFor="cardNumber">Card Number</label>
          <input
            id="cardNumber"
            name="cardNumber"
            value={cardNumber}
            onChange={(e) => {
              setCardNumber(e.target.value);
              setErrors((prev) => ({ ...prev, cardNumber: undefined }));
            }}
            className="modern-input"
            placeholder="0123 4567 8901 2345"
          />
          {errors.cardNumber && (
            <div className={styles.errorMsg}>{errors.cardNumber}</div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className={styles.label} htmlFor="expiry">Expiry</label>
              <input
                id="expiry"
                name="expiry"
                value={expiry}
                onChange={(e) => {
                  setExpiry(e.target.value);
                  setErrors((prev) => ({ ...prev, expiry: undefined }));
                }}
                className="modern-input"
                placeholder="MM/YY"
              />
              {errors.expiry && (
                <div className={styles.errorMsg}>{errors.expiry}</div>
              )}
            </div>
            <div>
              <label className={styles.label} htmlFor="cvv">CVV</label>
              <input
                id="cvv"
                name="cvv"
                value={cvv}
                onChange={(e) => {
                  setCvv(e.target.value);
                  setErrors((prev) => ({ ...prev, cvv: undefined }));
                }}
                className="modern-input"
                placeholder="123"
              />
              {errors.cvv && (
                <div className={styles.errorMsg}>{errors.cvv}</div>
              )}
            </div>
          </div>

          <label className={styles.label} htmlFor="cardName">Card Holder</label>
          <input
            id="cardName"
            name="cardName"
            value={cardName}
            onChange={(e) => {
              setCardName(e.target.value);
              setErrors((prev) => ({ ...prev, cardName: undefined }));
            }}
            className="modern-input"
            placeholder="JOHN DOE"
          />
          {errors.cardName && (
            <div className={styles.errorMsg}>{errors.cardName}</div>
          )}

          <button type="submit" className="btn-premium w-100" disabled={isSubmitting || paymentCompleted}>
            {paymentCompleted ? 'Paid' : isSubmitting ? 'Submitting...' : 'Pay with Visa'}
          </button>
        </form>

        {paymentCompleted && (
          <div style={{ padding: 20, borderRadius: '16px', background: '#ecfdf5', color: '#166534' }}>
            <strong>Payment approved.</strong> Redirecting to orders...
          </div>
        )}
      </div>
    </div>
  );
}
