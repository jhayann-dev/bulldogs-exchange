import { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext.jsx';
import { getAllUsersAdmin, setUserActive, updateUserAdmin } from '../../config/api';

const inputClasses =
  'mt-2 w-full rounded-xl border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400';

const roleColors = {
  admin: 'bg-yellow-100 text-yellow-800',
  seller: 'bg-blue-100 text-blue-800',
  buyer: 'bg-zinc-200 text-zinc-700',
};

const AdminUsersPage = () => {
  const { user: currentUser, token } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'buyer',
    contactNumber: '',
    address: '',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    getAllUsersAdmin(token)
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openEditForm = (u) => {
    setEditingId(u._id);
    setForm({
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      email: u.email || '',
      role: u.role,
      contactNumber: u.contactNumber || '',
      address: u.address || '',
    });
    setFormError('');
  };

  const closeEditForm = () => {
    setEditingId(null);
    setFormError('');
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    try {
      await updateUserAdmin(editingId, form, token);
      closeEditForm();
      loadUsers();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (u) => {
    setUpdatingId(u._id);
    setError('');
    try {
      const updated = await setUserActive(u._id, !u.isActive, token);
      setUsers((prev) => prev.map((usr) => (usr._id === u._id ? updated : usr)));
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="border-y-2 border-zinc-900 bg-zinc-900 px-4 py-10 sm:px-6 lg:px-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-500">
          Admin Panel
        </p>
        <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">
          Manage Users
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
          View accounts, edit user details, and set accounts active or inactive.
        </p>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-zinc-600">{users.length} user(s)</p>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading && <p className="text-sm text-zinc-600">Loading users...</p>}

        {!loading && users.length === 0 && (
          <p className="text-sm text-zinc-600">No users found.</p>
        )}

        {!loading && users.length > 0 && (
          <div className="space-y-4">
            {users.map((u) => (
              <div
                key={u._id}
                className="rounded-3xl border-2 border-zinc-900 bg-zinc-50 p-5"
              >
                {editingId === u._id ? (
                  <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                    {formError && (
                      <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 sm:col-span-2">
                        {formError}
                      </p>
                    )}

                    <div>
                      <label className="text-xs font-medium text-zinc-700">First Name</label>
                      <input
                        value={form.firstName}
                        onChange={handleChange('firstName')}
                        required
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-zinc-700">Last Name</label>
                      <input
                        value={form.lastName}
                        onChange={handleChange('lastName')}
                        required
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-zinc-700">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={handleChange('email')}
                        required
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-zinc-700">Role</label>
                      <select
                        value={form.role}
                        onChange={handleChange('role')}
                        disabled={u._id === currentUser?.id}
                        className={inputClasses}
                      >
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-zinc-700">Contact Number</label>
                      <input
                        value={form.contactNumber}
                        onChange={handleChange('contactNumber')}
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-zinc-700">Address</label>
                      <input
                        value={form.address}
                        onChange={handleChange('address')}
                        className={inputClasses}
                      />
                    </div>

                    <div className="flex gap-3 sm:col-span-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 rounded-xl bg-zinc-900 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-50 disabled:opacity-60"
                      >
                        {saving ? 'Saving...' : 'Update User'}
                      </button>
                      <button
                        type="button"
                        onClick={closeEditForm}
                        className="flex-1 rounded-xl border-2 border-zinc-900 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-900"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="mt-1 text-xs text-zinc-600">{u.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${roleColors[u.role]}`}
                        >
                          {u.role}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                            u.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-1 text-xs text-zinc-600 sm:grid-cols-2">
                      {u.contactNumber && <p><span className="font-semibold">Contact:</span> {u.contactNumber}</p>}
                      {u.address && <p><span className="font-semibold">Address:</span> {u.address}</p>}
                      <p><span className="font-semibold">Joined:</span> {new Date(u.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => openEditForm(u)}
                        className="rounded-xl border-2 border-zinc-900 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-900"
                      >
                        Edit
                      </button>
                      <button
                        disabled={updatingId === u._id || u._id === currentUser?.id}
                        onClick={() => handleToggleActive(u)}
                        className={`rounded-xl border-2 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] disabled:cursor-not-allowed disabled:opacity-40 ${
                          u.isActive
                            ? 'border-red-600 text-red-600'
                            : 'border-green-600 text-green-700'
                        }`}
                      >
                        {u.isActive ? 'Set Inactive' : 'Set Active'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminUsersPage;