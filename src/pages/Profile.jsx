import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import toast from 'react-hot-toast';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { auth } from '../firebase/firebase.init.js';
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
  FiCheck,
  FiInfo,
  FiList
} from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = `${API_URL}/users/profile`;

function Profile() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

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
  const [showGoogleBanner, setShowGoogleBanner] = useState(false);
  const [bannerPulse, setBannerPulse] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [showEarnings, setShowEarnings] = useState(false);
  const [showSpent, setShowSpent] = useState(false);

  const isGoogleProvider = user?.providerData?.some(
    (provider) => provider.providerId === 'google.com'
  );

  useEffect(() => {
    let timer;
    if (showGoogleBanner) {
      timer = setTimeout(() => setShowGoogleBanner(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [showGoogleBanner, bannerPulse]);

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
    if (isGoogleProvider) {
      if (showGoogleBanner) {
        setBannerPulse(true);
        setTimeout(() => setBannerPulse(false), 200);
      } else {
        setShowGoogleBanner(true);
      }
      return;
    }

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
      const promises = [];
      const { displayName, email, photoURL, password } = editFormData;

      if (displayName !== user.displayName || photoURL !== user.photoURL) {
        promises.push(updateProfile(auth.currentUser, { displayName, photoURL }));
      }
      if (email !== user.email && email) {
        promises.push(updateEmail(auth.currentUser, email));
      }
      if (password) {
        promises.push(updatePassword(auth.currentUser, password));
      }

      await Promise.all(promises);

      const token = await user.getIdToken();
      const payload = { displayName, email, photoURL };
      const response = await fetch(API_BASE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to update backend');

      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
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

  const formatCompactNumber = (number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 2
    }).format(number || 0);
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
            {isEditingProfile && !isGoogleProvider ? (
              <>
                <button onClick={handleSaveProfile} disabled={savingField} className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors shadow-sm">
                  {savingField ? <FiLoader className="animate-spin" /> : <FiCheck size={20} />}
                </button>
                <button onClick={handleCancelProfileEdit} disabled={savingField} className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors shadow-sm">
                  <FiX size={20} />
                </button>
              </>
            ) : (
              <button onClick={handleEditProfile} className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors shadow-sm ${showGoogleBanner && isGoogleProvider ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                <FiEdit2 size={18} />
              </button>
            )}
          </div>
        </div>

        {isGoogleProvider && showGoogleBanner && (
          <div className={`bg-blue-50/50 border-b border-blue-100 px-6 py-4 sm:px-8 flex items-start gap-3 transition-all duration-200 ${bannerPulse ? 'opacity-40 scale-[0.99]' : 'opacity-100 scale-100'}`}>
            <FiInfo className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 font-medium">
              Connected with Google — manage your name, photo, email, and password from your Google Account.
            </p>
          </div>
        )}

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
                {isEditingProfile && !isGoogleProvider ? (
                  <input
                    type="text"
                    name="displayName"
                    value={editFormData.displayName}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200"
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
                {isEditingProfile && !isGoogleProvider ? (
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200"
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
                {isEditingProfile && !isGoogleProvider ? (
                  <input
                    type="text"
                    name="photoURL"
                    value={editFormData.photoURL}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200"
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
                {isEditingProfile && !isGoogleProvider ? (
                  <input
                    type="password"
                    name="password"
                    value={editFormData.password}
                    onChange={handleEditChange}
                    placeholder="New password (blank to keep)"
                    className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200"
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
              <div className="rounded-full bg-blue-50 p-2 text-blue-600"><FaCar size={20} /></div>
            </div>
            <p className="mt-4 text-3xl font-bold text-blue-600">{stats.totalCars}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total Bookings</p>
              <div className="rounded-full bg-indigo-50 p-2 text-indigo-600"><FiList size={20} /></div>
            </div>
            <p className="mt-4 text-3xl font-bold text-indigo-600">{stats.totalBookings}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total Earnings</p>
              <div className="rounded-full bg-emerald-50 p-2 text-emerald-600"><FiDollarSign size={20} /></div>
            </div>
            <div className="mt-4 flex items-baseline">
              <span className="text-xl font-normal text-emerald-600 mr-1 cursor-default">৳</span>
              <div 
                className="relative group w-max"
                onClick={() => setShowEarnings(!showEarnings)}
              >
                <p className="text-3xl font-bold text-emerald-600 truncate cursor-pointer sm:cursor-default">
                  {formatCompactNumber(stats.totalEarnings)}
                </p>
                <div className={`absolute bottom-full left-0 mb-2 ${showEarnings ? 'block' : 'hidden'} sm:group-hover:block whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-lg z-10`}>
                  ৳ {stats.totalEarnings.toLocaleString()}
                  <div className="absolute left-4 top-full -mt-1 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total Spent</p>
              <div className="rounded-full bg-rose-50 p-2 text-rose-600"><FiCreditCard size={20} /></div>
            </div>
            <div className="mt-4 flex items-baseline">
              <span className="text-xl font-normal text-rose-600 mr-1 cursor-default">৳</span>
              <div 
                className="relative group w-max"
                onClick={() => setShowSpent(!showSpent)}
              >
                <p className="text-3xl font-bold text-rose-600 truncate cursor-pointer sm:cursor-default">
                  {formatCompactNumber(stats.totalSpent)}
                </p>
                <div className={`absolute bottom-full left-0 mb-2 ${showSpent ? 'block' : 'hidden'} sm:group-hover:block whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-lg z-10`}>
                  ৳ {stats.totalSpent.toLocaleString()}
                  <div className="absolute left-4 top-full -mt-1 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                </div>
              </div>
            </div>
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
              {activities.slice(0, 5).map((activity, index, arr) => (
                <div key={activity._id || index} className="flex gap-4 group">
                  <div className="relative flex flex-col items-center">
                    {getActivityIcon(activity.type)}
                    {index !== arr.length - 1 && (
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

              {activities.length > 5 && (
                <div className="pt-4 border-t border-slate-100 flex justify-center">
                  <button
                    onClick={() => setShowAllActivity(true)}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    View All
                  </button>
                </div>
              )}
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

      {/* ── All Activity Modal ────────────────────────────────────────────── */}
      {showAllActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <h3 className="text-xl font-bold text-slate-900">All Activity History</h3>
              <button
                onClick={() => setShowAllActivity(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
