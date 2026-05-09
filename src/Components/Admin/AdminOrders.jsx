import React, { useEffect, useState } from 'react';
import API from '../../api/api';

const STATUS_OPTIONS = ['PENDING', 'SHIPPED', 'DELIVERED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [alert, setAlert] = useState(null);

  async function fetchOrders() {
    try {
      const { data } = await API.get('/admin/orders');
      setOrders(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchOrders(); }, []);

  async function handleStatusChange(orderId, status) {
    try {
      await API.put(`/admin/orders/${orderId}`, { status });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      setAlert({ type: 'success', msg: `Order #${orderId} updated to ${status}` });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'error', msg: 'Failed to update order status.' });
    }
  }

  const statusColor = { PENDING: 'pending', SHIPPED: 'shipped', DELIVERED: 'delivered' };

  const filtered = orders.filter(o => {
    const matchSearch = String(o.id).includes(search) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return <div className="admin-loading"><i className="fa fa-spinner fa-spin"></i></div>;

  const totals = {
    ALL: orders.length,
    PENDING: orders.filter(o => o.status === 'PENDING').length,
    SHIPPED: orders.filter(o => o.status === 'SHIPPED').length,
    DELIVERED: orders.filter(o => o.status === 'DELIVERED').length,
  };

  return (
    <>
      {alert && (
        <div className={`admin-alert ${alert.type}`}>
          <i className={`fa-solid ${alert.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
          {alert.msg}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {['ALL', ...STATUS_OPTIONS].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              border: filterStatus === s ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.07)',
              background: filterStatus === s ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
              color: filterStatus === s ? '#a5b4fc' : '#64748b',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {s} <span style={{ opacity: 0.7 }}>({totals[s]})</span>
          </button>
        ))}
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Orders <span style={{ color: '#6366f1', fontSize: 14 }}>({filtered.length})</span></h3>
          <div className="admin-search-wrap">
            <i className="fa-solid fa-search"></i>
            <input
              className="admin-search"
              placeholder="Search by ID or customer…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}>
                  <div className="admin-empty">
                    <i className="fa-solid fa-receipt"></i>
                    <p>No orders found.</p>
                  </div>
                </td></tr>
              ) : filtered.map(order => (
                <tr key={order.id}>
                  <td><span style={{ color: '#a5b4fc', fontWeight: 700 }}>#{order.id}</span></td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{order.user?.name || '—'}</div>
                    <div style={{ fontSize: 11, color: '#4a5568' }}>{order.user?.email}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {order.orderItems?.slice(0, 3).map(item => (
                        <img
                          key={item.id}
                          src={item.product?.imageUrl ? `http://localhost:5000${item.product.imageUrl}` : 'https://via.placeholder.com/36'}
                          title={item.product?.name}
                          alt={item.product?.name || "Product Image"}
                          style={{ 
                            width: 36, 
                            height: 36, 
                            borderRadius: 6, 
                            objectFit: 'cover', 
                            border: '1px solid rgba(255,255,255,0.1)' 
                          }}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/36'; }}
                        />
                      ))}
                      {order.orderItems?.length > 3 && (
                        <div style={{
                          width: 36, height: 36, borderRadius: 6,
                          background: 'rgba(99,102,241,0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, color: '#a5b4fc', fontWeight: 700
                        }}>+{order.orderItems.length - 3}</div>
                      )}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#34d399' }}>{Number(order.totalPrice).toFixed(2)} EGP</td>
                  <td>
                    <span className={`status-badge ${statusColor[order.status] || 'pending'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="admin-status-select"
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ color: '#64748b', fontSize: 12 }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
