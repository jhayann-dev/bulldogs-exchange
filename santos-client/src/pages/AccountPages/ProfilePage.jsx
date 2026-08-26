import { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext.jsx';
import { getUserProfile, updateProfile, changePassword } from '../../config/api';

const inputClasses =
  'mt-2 w-full rounded-xl border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400';

const ProfilePage = () => {
  const { user, token } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [infoError, setInfoError] = useState('');
  const [infoSuccess, setInfoSuccess] = useState('');
  const [savingInfo, setSavingInfo] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    getUserProfile(user.id, token)
      .then((data) => {
        setProfile(data);
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setContactNumber(data.contactNumber || '');
        setAddress(data.address || '');
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [user.id, token]);

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setInfoError('');
    setInfoSuccess('');
    setSavingInfo(true);

    try {
      const updated = await updateProfile(
        user.id,
        { firstName, lastName, contactNumber, address },
        token
      );
      setProfile(updated);
      setInfoSuccess('Profile updated successfully.');
    } catch (err) {
      setInfoError(err.message);
    } finally {
      setSavingInfo(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(user.id, { currentPassword, newPassword }, token);
      setPasswordSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <p className="px-6 py-10 text-sm text-zinc-600">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="px-6 py-10 text-sm text-red-600">Failed to load profile.</p>;
  }

  return (
    <div className="flex w-full flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <section>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
          My Account
        </p>
        <h1 className="mt-2 text-3xl font-bold text-zinc-900">Profile</h1>
      </section>

      <section className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Account Overview</h2>
        <div className="grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
          <p><span className="font-semibold">Email:</span> {profile.email}</p>
          <p><span className="font-semibold">Role:</span> {profile.role}</p>
        </div>
      </section>

      <section className="rounded-3xl border-2 border-zinc-900 bg-zinc-50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Edit Information</h2>

        {infoError && (
          <p className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
            {infoError}
          </p>
        )}
        {infoSuccess && (
          <p className="mb-4 rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-700">
            {infoSuccess}
          </p>
        )}

        <form onSubmit={handleInfoSubmit} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-zinc-700">First Name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className={inputClasses}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-700">Last Name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className={inputClasses}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-700">Contact Number</label>
            <input
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="e.g. 09171234567"
              className={inputClasses}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-700">Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Pickup / delivery address"
              className={inputClasses}
            />
          </div>

          <button
            type="submit"
            disabled={savingInfo}
            className="sm:col-span-2 mt-2 rounded-xl bg-zinc-900 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-50 disabled:opacity-60"
          >
            {savingInfo ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </section>

      <section className="rounded-3xl border-2 border-zinc-900 bg-zinc-50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Change Password</h2>

        {passwordError && (
          <p className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
            {passwordError}
          </p>
        )}
        {passwordSuccess && (
          <p className="mb-4 rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-700">
            {passwordSuccess}
          </p>
        )}

        <form onSubmit={handlePasswordSubmit} className="grid gap-4">
          <div>
            <label className="text-xs font-medium text-zinc-700">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className={inputClasses}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-700">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className={inputClasses}
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="mt-2 rounded-xl bg-zinc-900 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-50 disabled:opacity-60"
          >
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ProfilePage;