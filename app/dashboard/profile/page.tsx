'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '@/utils/baseUrl';
import { motion } from 'framer-motion';

interface UserData {
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface PasswordUpdateForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordUpdateForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const router = useRouter();
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/get-user-data`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router, accessToken]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const response = await fetch(`${BASE_URL}/update-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update password');
      }

      setPasswordSuccess('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366F1]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Account Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#1A1A2E] rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-6 text-[#6366F1]">Account Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-[#6366F1] flex items-center justify-center">
                      <span className="text-lg font-medium">{userData?.user.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-lg">{userData?.user.username}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <div className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-lg">{userData?.user.email}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Security Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-[#1A1A2E] rounded-xl p-6 shadow-lg"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#6366F1]">Security</h2>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  {showPasswordForm ? 'Cancel' : 'Change Password'}
                </button>
              </div>

              {showPasswordForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handlePasswordUpdate}
                  className="space-y-4"
                >
                  {passwordError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                      {passwordError}
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
                      {passwordSuccess}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      className="w-full px-4 py-2 bg-[#2A2A3C] border border-[#3A3A4C] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-colors duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="w-full px-4 py-2 bg-[#2A2A3C] border border-[#3A3A4C] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-colors duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className="w-full px-4 py-2 bg-[#2A2A3C] border border-[#3A3A4C] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-colors duration-200"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="w-full px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingPassword ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        <span>Updating...</span>
                      </div>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </motion.form>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
