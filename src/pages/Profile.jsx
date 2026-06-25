import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import toast from 'react-hot-toast';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiEdit2,
  FiSave,
  FiX,
  FiActivity,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiPlusCircle,
  FiEdit,
  FiTrash2,
  FiBox,
  FiCreditCard,
  FiDollarSign,
  FiLoader,
  FiCheck
} from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = `${API_URL}/users/profile`;

function Profile() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    mobileNumber: '',
    location: ''
  });
  const [stats, setStats] = useState({
    totalCars: 0,
    totalBookings: 0,
    totalEarnings: 0,
    totalSpent: 0
  });
  const [activities, setActivities] = useState([]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    displayName: '',
    email: '',
    photoURL: '',
    password: ''
  });
  const [savingField, setSavingField] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    const controller = new AbortController();

    async function fetchProfile() {
      try {
        setLoading(true);
        const token = await user.getIdToken();
        const response = await fetch(API_BASE, {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to load profile data');
        }

        const result = await response.json();
        if (result.success) {
          setProfileData({
            mobileNumber: result.data.profile.mobileNumber || '',
            location: result.data.profile.location || ''
          });
          setStats(result.data.stats || {
            totalCars: 0,
            totalBookings: 0,
            totalEarnings: 0,
            totalSpent: 0
          });
          setActivities(result.data.activities || []);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          toast.error(err.message || 'Could not load your profile.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
    return () => controller.abort();
  }, [user]);

  const handleEditProfile = () => {
    setEditFormData({
      displayName: user?.displayName || '',
      email: user?.email || '',
      photoURL: user?.photoURL || '',
      password: ''
    });
    setIsEditingProfile(true);
  };

  const handleCancelProfileEdit = () => {
    setIsEditingProfile(false);
  };

  const handleSaveProfile = async () => {
    setSavingField(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Profile updated successfully! (Simulation)');
      setIsEditingProfile(false);
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSavingField(false);
    }
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'BLUE':
        return <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600"><FiCalendar size={18} /></div>;
      case 'RED':
        return <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600"><FiXCircle size={18} /></div>;
      case 'GREEN':
        return <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><FiCheckCircle size={18} /></div>;
      case 'PURPLE':
        return <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600"><FiPlusCircle size={18} /></div>;
      case 'ORANGE':
        return <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600"><FiEdit size={18} /></div>;
      default:
        return <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600"><FiActivity size={18} /></div>;
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <FiLoader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 pb-20 sm:px-6 lg:px-8">
      {/* ── Personal Information ────────────────────────────────────────────── */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5 sm:px-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
            <p className="mt-1 text-sm text-slate-500">Manage your profile details and settings</p>
          </div>
          <div className="flex items-center gap-2">
            {isEditingProfile ? (
              <>
                <button onClick={handleSaveProfile} disabled={savingField} className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors shadow-sm">
                  {savingField ? <FiLoader className="animate-spin" /> : <FiCheck size={20} />}
                </button>
                <button onClick={handleCancelProfileEdit} disabled={savingField} className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors shadow-sm">
                  <FiX size={20} />
                </button>
              </>
            ) : (
              <button onClick={handleEditProfile} className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shadow-sm">
                <FiEdit2 size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center sm:flex-row sm:items-center gap-8">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-4xl font-semibold text-blue-600 shadow-inner">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span>
                  {(user?.displayName || 'U').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

              {/* Full Name */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <FiUser className="text-slate-400" /> Full Name
                </div>
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="displayName"
                    value={editFormData.displayName}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
                    disabled={savingField}
                  />
                ) : (
                  <div className="text-slate-900 font-medium bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                    {user?.displayName || 'Unknown User'}
                  </div>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <FiMail className="text-slate-400" /> Email Address
                </div>
                {isEditingProfile ? (
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
                    disabled={savingField}
                  />
                ) : (
                  <div className="text-slate-900 font-medium bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 truncate" title={user?.email}>
                    {user?.email || 'No email provided'}
                  </div>
                )}
              </div>

              {/* Photo URL */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <span className="text-slate-400 font-mono">🔗</span> Photo URL
                </div>
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="photoURL"
                    value={editFormData.photoURL}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
                    disabled={savingField}
                  />
                ) : (
                  <div className="text-slate-900 font-medium bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 truncate" title={user?.photoURL}>
                    {user?.photoURL || 'Not set yet'}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <FiLock className="text-slate-400" /> Password
                </div>
                {isEditingProfile ? (
                  <input
                    type="password"
                    name="password"
                    value={editFormData.password}
                    onChange={handleEditChange}
                    placeholder="New password (blank to keep)"
                    className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
                    disabled={savingField}
                  />
                ) : (
                  <div className="text-slate-900 font-mono tracking-[0.25em] text-lg bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 h-[46px] flex items-center">
                    ••••••••
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── User Statistics ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 px-2 text-lg font-bold text-slate-900">User Statistics</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total Cars Added</p>
              <div className="rounded-full bg-blue-50 p-2 text-blue-600"><FiBox size={20} /></div>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{stats.totalCars}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total Bookings</p>
              <div className="rounded-full bg-indigo-50 p-2 text-indigo-600"><FiCalendar size={20} /></div>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{stats.totalBookings}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total Earnings</p>
              <div className="rounded-full bg-emerald-50 p-2 text-emerald-600"><FiDollarSign size={20} /></div>
            </div>
            <p className="mt-4 text-3xl font-bold text-emerald-600">
              <span className="text-xl font-normal mr-1">৳</span>
              {stats.totalEarnings.toLocaleString()}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total Spent</p>
              <div className="rounded-full bg-rose-50 p-2 text-rose-600"><FiCreditCard size={20} /></div>
            </div>
            <p className="mt-4 text-3xl font-bold text-rose-600">
              <span className="text-xl font-normal mr-1">৳</span>
              {stats.totalSpent.toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* ── Recent Activity ─────────────────────────────────────────────────── */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5 sm:px-8">
          <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
          <p className="mt-1 text-sm text-slate-500">Your latest actions on DriveFleet</p>
        </div>

        <div className="p-6 sm:p-8">
          {activities.length > 0 ? (
            <div className="space-y-6">
              {activities.map((activity, index) => (
                <div key={activity._id || index} className="flex gap-4 group">
                  <div className="relative flex flex-col items-center">
                    {getActivityIcon(activity.type)}
                    {index !== activities.length - 1 && (
                      <div className="w-0.5 h-full bg-slate-100 mt-2 absolute top-10" />
                    )}
                  </div>
                  <div className="pb-6 pt-2">
                    <p className="text-base font-medium text-slate-800">
                      {activity.message}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-sm text-slate-500">
                      <time dateTime={activity.createdAt}>{formatDate(activity.createdAt)}</time>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-slate-100 flex justify-center">
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  View All Activity
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-slate-50 p-4 mb-4">
                <FiActivity size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No recent activity</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-sm">
                When you add cars or book trips, your history will appear right here.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Profile;
