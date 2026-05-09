import React, { useEffect, useState } from 'react';
import API from '../../api/api';

const emptyForm = { name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null); // null = create mode
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  async function fetchData() {
    try {
      const [p, c] = await Promise.all([API.get('/products'), API.get('/categories')]);
      setProducts(p.data);
      setCategories(c.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchData(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModal(true);
  }

  function openEdit(product) {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl || '',
    });
    setModal(true);
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.categoryId) {
      setAlert({ type: 'error', msg: 'Name, price and category are required.' });
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), categoryId: Number(form.categoryId) };
      if (editing) {
        await API.put(`/admin/products/${editing.id}`, payload);
      } else {
        await API.post('/admin/products', payload);
      }
      setModal(false);
      setAlert({ type: 'success', msg: editing ? 'Product updated!' : 'Product created!' });
      fetchData();
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.message || 'Failed to save product' });
    } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/admin/products/${id}`);
      setAlert({ type: 'success', msg: 'Product deleted.' });
      fetchData();
    } catch (err) {
      setAlert({ type: 'error', msg: 'Failed to delete product.' });
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="admin-loading"><i className="fa fa-spinner fa-spin"></i></div>;

  return (
    <>
      {alert && (
        <div className={`admin-alert ${alert.type}`}>
          <i className={`fa-solid ${alert.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
          {alert.msg}
        </div>
      )}

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Products <span style={{ color: '#6366f1', fontSize: 14 }}>({filtered.length})</span></h3>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div className="admin-search-wrap">
              <i className="fa-solid fa-search"></i>
              <input
                className="admin-search"
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="btn-admin-primary" onClick={openCreate}>
              <i className="fa-solid fa-plus"></i> Add Product
            </button>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}>
                  <div className="admin-empty">
                    <i className="fa-solid fa-boxes-stacked"></i>
                    <p>No products found. Create one!</p>
                  </div>
                </td></tr>
              ) : filtered.map(product => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.imageUrl ? `http://localhost:5000${product.imageUrl}` : 'https://via.placeholder.com/44'}
                      alt={product.name}
                      style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/44'; }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{product.name}</div>
                    <div style={{ fontSize: 12, color: '#4a5568', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {product.description}
                    </div>
                  </td>
                  <td>
                    <span className="status-badge customer">{product.category?.name || '—'}</span>
                  </td>
                  <td style={{ fontWeight: 700, color: '#34d399' }}>{Number(product.price).toFixed(2)} EGP</td>
                  <td>
                    <span style={{ color: product.stock < 5 ? '#fbbf24' : '#94a3b8', fontWeight: 600 }}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-admin-edit" onClick={() => openEdit(product)}>
                        <i className="fa-solid fa-pen"></i> Edit
                      </button>
                      <button className="btn-admin-danger" onClick={() => handleDelete(product.id)}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="admin-modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Product Name *</label>
                  <input
                    placeholder="e.g. Running Shoes"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Category *</label>
                  <select
                    value={form.categoryId}
                    onChange={e => setForm({ ...form, categoryId: e.target.value })}
                  >
                    <option value="">Select category…</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Price (EGP) *</label>
                  <input
                    type="number" min="0" step="0.01"
                    placeholder="0.00"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number" min="0"
                    placeholder="0"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
                <div className="admin-form-group full">
                  <label>Image URL</label>
                  <input
                    placeholder="https://example.com/image.jpg"
                    value={form.imageUrl}
                    onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                  />
                </div>
                <div className="admin-form-group full">
                  <label>Description</label>
                  <textarea
                    placeholder="Product description…"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn-admin-cancel" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn-admin-primary" onClick={handleSave} disabled={saving}>
                {saving ? <><i className="fa fa-spinner fa-spin"></i> Saving…</> : (editing ? 'Update Product' : 'Create Product')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
