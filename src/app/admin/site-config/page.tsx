'use client';

import * as React from 'react';
import { 
    Save, 
    AlertCircle, 
    CheckCircle2, 
    Upload, 
    Trash2, 
    Image as ImageIcon, 
    Globe, 
    MapPin, 
    Building, 
    ShieldCheck, 
    KeyRound, 
    Eye, 
    EyeOff, 
    User, 
    Lock,
    RefreshCw
} from 'lucide-react';
import { compressImageFile } from '@/utils/imageCompressor';
import { useRouter } from 'next/navigation';
import { MediaSelectorModal } from '@/components/admin/MediaSelectorModal';

interface SiteConfig {
    companyName: string;
    legalName: string;
    contactEmail: string;
    contactPhone: string;
    whatsappNumber: string;
    addressText: string;
    businessHours: string;
    footerDescription: string;
    seoDefaultTitle: string;
    seoDefaultDescription: string;
    logoUrl: string | null;
    uploadedLogoUrl: string | null;
    googleMapsIframeUrl: string | null;
    urlLinkedin: string | null;
    urlYoutube: string | null;
    urlInstagram: string | null;
}

interface AdminProfile {
    id: string;
    username: string;
    email: string;
    fullName: string;
    lastLoginAt: string | null;
}

export default function SiteConfigPage() {
    const router = useRouter();
    const [config, setConfig] = React.useState<SiteConfig | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);
    const [isUploadingLogo, setIsUploadingLogo] = React.useState(false);
    const [isMediaSelectorOpen, setIsMediaSelectorOpen] = React.useState(false);

    // Site Config Status states
    const [errorMsg, setErrorMsg] = React.useState('');
    const [successMsg, setSuccessMsg] = React.useState('');
    const [isUninitialized, setIsUninitialized] = React.useState(false);

    // Admin Credentials State
    const [adminProfile, setAdminProfile] = React.useState<AdminProfile | null>(null);
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newUsername, setNewUsername] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    // Password Visibility Toggles
    const [showCurrentPass, setShowCurrentPass] = React.useState(false);
    const [showNewPass, setShowNewPass] = React.useState(false);
    const [showConfirmPass, setShowConfirmPass] = React.useState(false);

    // Credential Submission State
    const [isUpdatingCreds, setIsUpdatingCreds] = React.useState(false);
    const [credsErrorMsg, setCredsErrorMsg] = React.useState('');
    const [credsSuccessMsg, setCredsSuccessMsg] = React.useState('');

    // Initial Fetch
    React.useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                // 1. Fetch Site Config
                const configPromise = fetch('/api/admin/site-config');
                // 2. Fetch Admin Profile
                const profilePromise = fetch('/api/admin/auth/credentials');

                const [configRes, profileRes] = await Promise.all([configPromise, profilePromise]);

                if (configRes.status === 401 || configRes.status === 403 || profileRes.status === 401 || profileRes.status === 403) {
                    if (isMounted) {
                        setErrorMsg('Your admin session has expired. Please sign in again.');
                        setIsLoading(false);
                    }
                    return;
                }

                if (configRes.status === 404) {
                    if (isMounted) {
                        setIsUninitialized(true);
                        setIsLoading(false);
                    }
                    return;
                }

                const configData = await configRes.json();
                if (configRes.ok && configData.success) {
                    if (isMounted) {
                        setConfig({
                            companyName: configData.data.companyName || '',
                            legalName: configData.data.legalName || '',
                            contactEmail: configData.data.contactEmail || '',
                            contactPhone: configData.data.contactPhone || '',
                            whatsappNumber: configData.data.whatsappNumber || '',
                            addressText: configData.data.addressText || '',
                            businessHours: configData.data.businessHours || '',
                            footerDescription: configData.data.footerDescription || '',
                            seoDefaultTitle: configData.data.seoDefaultTitle || '',
                            seoDefaultDescription: configData.data.seoDefaultDescription || '',
                            logoUrl: configData.data.logoUrl || '',
                            uploadedLogoUrl: configData.data.uploadedLogoUrl || '',
                            googleMapsIframeUrl: configData.data.googleMapsIframeUrl || '',
                            urlLinkedin: configData.data.urlLinkedin || '',
                            urlYoutube: configData.data.urlYoutube || '',
                            urlInstagram: configData.data.urlInstagram || '',
                        });
                    }
                } else if (isMounted) {
                    setErrorMsg(configData.error || 'Failed to load configuration.');
                }

                // Handle Admin Profile Data
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    if (profileData.success && profileData.data && isMounted) {
                        setAdminProfile(profileData.data);
                        setNewUsername(profileData.data.username || '');
                    }
                }

                if (isMounted) {
                    setIsLoading(false);
                }
            } catch {
                if (isMounted) {
                    setErrorMsg('Network error while loading configuration.');
                    setIsLoading(false);
                }
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!config) return;
        const { name, value } = e.target;
        setConfig(prev => prev ? { ...prev, [name]: value } : prev);

        if (errorMsg) setErrorMsg('');
        if (successMsg) setSuccessMsg('');
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const rawFile = e.target.files[0];
        const isImage = rawFile.type.startsWith('image/') || Boolean(rawFile.name.toLowerCase().match(/\.(jpe?g|png|webp|svg|avif)$/));
        if (!isImage) {
            setErrorMsg('Please upload a valid image file.');
            return;
        }

        setIsUploadingLogo(true);
        setErrorMsg('');

        try {
            const file = await compressImageFile(rawFile, { maxWidth: 1200, maxHeight: 1200 });
            const formData = new FormData();
            formData.append('logo', file);

            const res = await fetch('/api/admin/site-config/upload-logo', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setConfig(prev => prev ? { ...prev, uploadedLogoUrl: data.url } : prev);
                setSuccessMsg('Logo uploaded successfully. Click Save Changes to apply globally.');
            } else {
                setErrorMsg(data.error || 'Failed to upload logo.');
            }
        } catch {
            setErrorMsg('An error occurred during upload.');
        } finally {
            setIsUploadingLogo(false);
            if (e.target) e.target.value = '';
        }
    };

    const handleRemoveUploadedLogo = () => {
        setConfig(prev => prev ? { ...prev, uploadedLogoUrl: '' } : prev);
    };

    // Save Global Site Configuration
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!config) return;

        const requiredFields = [
            'companyName', 'legalName', 'contactEmail', 'contactPhone',
            'whatsappNumber', 'addressText', 'businessHours', 'footerDescription',
            'seoDefaultTitle', 'seoDefaultDescription'
        ];

        for (const field of requiredFields) {
            const val = config[field as keyof SiteConfig];
            if (!val || typeof val !== 'string' || val.trim() === '') {
                setErrorMsg('Please fill in all required fields.');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(config.contactEmail)) {
            setErrorMsg('Please enter a valid email address.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSaving(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await fetch('/api/admin/site-config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setSuccessMsg('Changes saved successfully.');
                setConfig({
                    companyName: data.data.companyName || '',
                    legalName: data.data.legalName || '',
                    contactEmail: data.data.contactEmail || '',
                    contactPhone: data.data.contactPhone || '',
                    whatsappNumber: data.data.whatsappNumber || '',
                    addressText: data.data.addressText || '',
                    businessHours: data.data.businessHours || '',
                    footerDescription: data.data.footerDescription || '',
                    seoDefaultTitle: data.data.seoDefaultTitle || '',
                    seoDefaultDescription: data.data.seoDefaultDescription || '',
                    logoUrl: data.data.logoUrl || '',
                    uploadedLogoUrl: data.data.uploadedLogoUrl || '',
                    googleMapsIframeUrl: data.data.googleMapsIframeUrl || '',
                    urlLinkedin: data.data.urlLinkedin || '',
                    urlYoutube: data.data.urlYoutube || '',
                    urlInstagram: data.data.urlInstagram || '',
                });
                router.refresh();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                if (res.status === 401 || res.status === 403) {
                    setErrorMsg('Your admin session has expired. Please sign in again.');
                } else {
                    setErrorMsg(data.error || 'Unable to save changes. Please try again.');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch {
            setErrorMsg('Unable to save changes. Please try again.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSaving(false);
        }
    };

    // Update Admin Username and Password
    const handleUpdateCredentials = async (e: React.FormEvent) => {
        e.preventDefault();

        setCredsErrorMsg('');
        setCredsSuccessMsg('');

        if (!currentPassword || currentPassword.trim() === '') {
            setCredsErrorMsg('Current password is required to authorize changes.');
            return;
        }

        const isUsernameChanged = newUsername.trim() !== (adminProfile?.username || '');
        const isPasswordChanged = Boolean(newPassword && newPassword.trim().length > 0);

        if (!isUsernameChanged && !isPasswordChanged) {
            setCredsErrorMsg('No changes detected. Please enter a new username or new password.');
            return;
        }

        if (isUsernameChanged && newUsername.trim().length === 0) {
            setCredsErrorMsg('Username cannot be empty.');
            return;
        }

        if (isPasswordChanged) {
            if (newPassword.length < 8) {
                setCredsErrorMsg('New password must be at least 8 characters long.');
                return;
            }
            if (newPassword !== confirmPassword) {
                setCredsErrorMsg('New password and confirmation password do not match.');
                return;
            }
        }

        setIsUpdatingCreds(true);

        try {
            const res = await fetch('/api/admin/auth/credentials', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword,
                    newUsername: isUsernameChanged ? newUsername.trim() : undefined,
                    newPassword: isPasswordChanged ? newPassword : undefined,
                    confirmPassword: isPasswordChanged ? confirmPassword : undefined,
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setCredsSuccessMsg('Admin credentials updated successfully.');
                if (data.data) {
                    setAdminProfile(prev => prev ? { ...prev, username: data.data.username } : null);
                    setNewUsername(data.data.username);
                }
                // Clear sensitive password inputs
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setCredsErrorMsg(data.error || 'Failed to update credentials. Please check your current password.');
            }
        } catch {
            setCredsErrorMsg('Network error while updating credentials.');
        } finally {
            setIsUpdatingCreds(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0F766E]"></div>
            </div>
        );
    }

    if (isUninitialized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center border border-dashed border-[#CBD5E1] rounded-2xl p-8 bg-white">
                <AlertCircle className="w-12 h-12 text-[#94A3B8] mb-4" />
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">Not Initialized</h3>
                <p className="text-[#64748B]">Global configuration has not been initialized yet. Please contact support or run the database seeder.</p>
            </div>
        );
    }

    if (!config) {
        return (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm mt-4">
                {errorMsg || 'Failed to load configuration.'}
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-12 px-2 sm:px-0">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">Site &amp; Admin Configuration</h1>
                    <p className="text-xs sm:text-sm text-[#475569] mt-0.5">Manage global company metadata, contact credentials, branding, SEO, and admin security.</p>
                </div>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="admin-button-primary w-full sm:w-auto"
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving Changes...' : 'Save Site Configuration'}
                </button>
            </div>

            {/* Status Feedback for Site Config */}
            {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-start gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
                    <div>{errorMsg}</div>
                </div>
            )}

            {successMsg && (
                <div className="bg-[#EDF5F2] border border-[#2DD4BF]/40 text-[#0F766E] px-4 py-3 rounded-xl flex items-start gap-3 text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#0F766E]" />
                    <div>{successMsg}</div>
                </div>
            )}

            {/* ======================================================================= */}
            {/* SECTION 1: ADMIN SECURITY & LOGIN CREDENTIALS                           */}
            {/* ======================================================================= */}
            <div className="admin-card p-4 sm:p-6 space-y-6 border-l-4 border-l-[#0F766E]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#EDF5F2] flex items-center justify-center text-[#0F766E] flex-shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">Admin Account &amp; Security Credentials</h2>
                            <p className="text-xs text-[#64748B]">Update your administrative login username and secure password</p>
                        </div>
                    </div>
                    {adminProfile && (
                        <div className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium self-start sm:self-auto max-w-full truncate">
                            <span className="truncate">Active Account: <strong className="text-slate-900">{adminProfile.username}</strong></span>
                        </div>
                    )}
                </div>

                {/* Credential Update Feedback Alerts */}
                {credsErrorMsg && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-start gap-3 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
                        <div>{credsErrorMsg}</div>
                    </div>
                )}

                {credsSuccessMsg && (
                    <div className="bg-[#EDF5F2] border border-[#2DD4BF]/40 text-[#0F766E] px-4 py-3 rounded-xl flex items-start gap-3 text-sm font-medium">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#0F766E]" />
                        <div>{credsSuccessMsg}</div>
                    </div>
                )}

                <form onSubmit={handleUpdateCredentials} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        {/* Current Account Details */}
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">
                                Current Account Email / Name
                            </label>
                            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-600">
                                <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span className="font-semibold text-slate-800 truncate">{adminProfile?.fullName || 'System Administrator'}</span>
                                <span className="text-slate-400 truncate">({adminProfile?.email || 'N/A'})</span>
                            </div>
                        </div>

                        {/* New Admin Username */}
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">
                                Admin Username (Login ID) *
                            </label>
                            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-[#0F766E]/15 transition-all">
                                <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => {
                                        setNewUsername(e.target.value);
                                        if (credsErrorMsg) setCredsErrorMsg('');
                                    }}
                                    required
                                    placeholder="Enter the new admin username"
                                    className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] p-0"
                                />
                            </div>
                            <p className="text-[11px] text-[#64748B] mt-1">Used to log in at /login or /siva.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-2 border-t border-slate-100">
                        {/* New Password */}
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">
                                New Password (leave blank to keep current)
                            </label>
                            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-[#0F766E]/15 transition-all">
                                <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <input
                                    type={showNewPass ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        if (credsErrorMsg) setCredsErrorMsg('');
                                    }}
                                    placeholder="Enter the new password"
                                    minLength={8}
                                    className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] p-0"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPass(!showNewPass)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors p-1 flex-shrink-0"
                                    tabIndex={-1}
                                    aria-label="Toggle password visibility"
                                >
                                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-[11px] text-[#64748B] mt-1">Minimum 8 characters with letters &amp; numbers recommended.</p>
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">
                                Confirm New Password
                            </label>
                            <div className={`flex items-center gap-2.5 px-3.5 py-2.5 border rounded-xl transition-all ${
                                !newPassword 
                                    ? 'bg-slate-50 border-slate-200 opacity-70' 
                                    : 'bg-white border-[#CBD5E1] focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-[#0F766E]/15'
                            }`}>
                                <KeyRound className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <input
                                    type={showConfirmPass ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (credsErrorMsg) setCredsErrorMsg('');
                                    }}
                                    placeholder="Enter the confirmation password"
                                    disabled={!newPassword}
                                    className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] p-0 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                    disabled={!newPassword}
                                    className="text-slate-400 hover:text-slate-600 transition-colors p-1 flex-shrink-0 disabled:opacity-30"
                                    tabIndex={-1}
                                    aria-label="Toggle confirm password visibility"
                                >
                                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Authorization: Current Password Confirmation */}
                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2 text-amber-900 text-xs sm:text-sm font-bold">
                            <Lock className="w-4 h-4 text-amber-700 flex-shrink-0" />
                            <span>Security Authorization Required</span>
                        </div>
                        <p className="text-xs text-amber-800 leading-relaxed">
                            To prevent unauthorized modifications, please enter your <strong>current password</strong> to authorize updating your username or password.
                        </p>
                        <div className="max-w-md">
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">
                                Current Password *
                            </label>
                            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-[#0F766E]/15 transition-all">
                                <KeyRound className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <input
                                    type={showCurrentPass ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => {
                                        setCurrentPassword(e.target.value);
                                        if (credsErrorMsg) setCredsErrorMsg('');
                                    }}
                                    required
                                    placeholder="Enter the current password"
                                    className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] p-0"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors p-1 flex-shrink-0"
                                    tabIndex={-1}
                                    aria-label="Toggle current password visibility"
                                >
                                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-1">
                        <button
                            type="submit"
                            disabled={isUpdatingCreds || !currentPassword}
                            className={`admin-button-primary w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-sm ${
                                isUpdatingCreds || !currentPassword ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                        >
                            {isUpdatingCreds ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>Verifying &amp; Updating...</span>
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Update Admin Credentials</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* ======================================================================= */}
            {/* SECTION 2: GLOBAL SITE CONFIGURATION FORM                               */}
            {/* ======================================================================= */}
            <form onSubmit={handleSave} className="space-y-6">
                {/* A. Company Information */}
                <div className="admin-card p-4 sm:p-6 space-y-5">
                    <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
                        <Building className="w-4 h-4 text-[#0F766E]" />
                        <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">Company Identity &amp; Contact</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">Company Display Name *</label>
                            <input
                                type="text"
                                name="companyName"
                                value={config.companyName}
                                onChange={handleChange}
                                placeholder="Enter the company display name"
                                required
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">Legal Entity Name *</label>
                            <input
                                type="text"
                                name="legalName"
                                value={config.legalName}
                                onChange={handleChange}
                                placeholder="Enter the legal entity name"
                                required
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">Official Support Email *</label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={config.contactEmail}
                                onChange={handleChange}
                                placeholder="Enter the official support email"
                                required
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">Contact Phone *</label>
                            <input
                                type="text"
                                name="contactPhone"
                                value={config.contactPhone}
                                onChange={handleChange}
                                placeholder="Enter the contact phone number"
                                required
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">WhatsApp Number *</label>
                            <input
                                type="text"
                                name="whatsappNumber"
                                value={config.whatsappNumber}
                                onChange={handleChange}
                                placeholder="Enter the WhatsApp contact number"
                                required
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">Business Hours *</label>
                            <input
                                type="text"
                                name="businessHours"
                                value={config.businessHours}
                                onChange={handleChange}
                                placeholder="Enter the business operating hours"
                                required
                                className="admin-input"
                            />
                        </div>
                    </div>
                </div>

                {/* B. Branding & Content */}
                <div className="admin-card p-4 sm:p-6 space-y-5">
                    <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
                        <ImageIcon className="w-4 h-4 text-[#0F766E]" />
                        <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">Branding Assets &amp; Footer</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">Global Brand Logo</label>
                            {config.uploadedLogoUrl ? (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50 border border-[#E2E8F0] rounded-xl p-4">
                                    <img src={config.uploadedLogoUrl} alt="Uploaded Logo" className="h-12 w-auto object-contain bg-white rounded-lg p-1 border border-[#E2E8F0]" />
                                    <div className="flex-1 text-xs text-[#64748B]">
                                        Custom uploaded logo active. Takes highest priority across all pages.
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveUploadedLogo}
                                        className="text-rose-600 hover:text-rose-700 p-2 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors self-end sm:self-center"
                                        title="Remove uploaded logo"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="border border-dashed border-[#CBD5E1] rounded-xl p-6 bg-slate-50/70 flex flex-col items-center justify-center text-center">
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                                className="hidden"
                                                id="logo-upload-input"
                                            />
                                            <label
                                                htmlFor="logo-upload-input"
                                                className={`cursor-pointer admin-button-primary text-xs ${isUploadingLogo ? 'opacity-50 pointer-events-none' : ''}`}
                                            >
                                                <Upload className="w-3.5 h-3.5" />
                                                {isUploadingLogo ? 'Uploading...' : 'Upload Logo File'}
                                            </label>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsMediaSelectorOpen(true)}
                                            className="admin-button-secondary text-xs"
                                        >
                                            <ImageIcon className="w-3.5 h-3.5 text-[#0F766E]" /> Select from Media
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-[#94A3B8] mt-2">Recommended: transparent PNG or SVG logo file.</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">External Logo Fallback URL</label>
                            <input
                                type="url"
                                name="logoUrl"
                                value={config.logoUrl || ''}
                                onChange={handleChange}
                                placeholder="Enter the external logo fallback URL"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">Global Footer Description *</label>
                            <textarea
                                name="footerDescription"
                                value={config.footerDescription}
                                onChange={handleChange}
                                placeholder="Enter the global footer description"
                                required
                                rows={3}
                                className="admin-input resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* C. Social Links */}
                <div className="admin-card p-4 sm:p-6 space-y-5">
                    <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
                        <Globe className="w-4 h-4 text-[#0F766E]" />
                        <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">Social &amp; Community Channels</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">LinkedIn Profile URL</label>
                            <input
                                type="url"
                                name="urlLinkedin"
                                value={config.urlLinkedin || ''}
                                onChange={handleChange}
                                placeholder="Enter the LinkedIn profile URL"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">YouTube Channel URL</label>
                            <input
                                type="url"
                                name="urlYoutube"
                                value={config.urlYoutube || ''}
                                onChange={handleChange}
                                placeholder="Enter the YouTube channel URL"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">Instagram Profile URL</label>
                            <input
                                type="url"
                                name="urlInstagram"
                                value={config.urlInstagram || ''}
                                onChange={handleChange}
                                placeholder="Enter the Instagram profile URL"
                                className="admin-input"
                            />
                        </div>
                    </div>
                </div>

                {/* D. Location / Contact */}
                <div className="admin-card p-4 sm:p-6 space-y-5">
                    <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
                        <MapPin className="w-4 h-4 text-[#0F766E]" />
                        <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">HQ Location &amp; Map Coordinates</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">Physical HQ Address *</label>
                            <textarea
                                name="addressText"
                                value={config.addressText}
                                onChange={handleChange}
                                placeholder="Enter the physical HQ address"
                                required
                                rows={2}
                                className="admin-input resize-none"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">Google Maps Embed URL</label>
                            <input
                                type="url"
                                name="googleMapsIframeUrl"
                                value={config.googleMapsIframeUrl || ''}
                                onChange={handleChange}
                                placeholder="Enter the Google Maps embed URL"
                                className="admin-input"
                            />
                            <p className="mt-1 text-[11px] text-[#94A3B8]">Enter the src URL from Google Maps Embed iframe.</p>
                        </div>
                    </div>
                </div>

                {/* E. SEO */}
                <div className="admin-card p-4 sm:p-6 space-y-5">
                    <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
                        <Globe className="w-4 h-4 text-[#0F766E]" />
                        <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">Default Search Engine Optimization (SEO)</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">Default Meta Title *</label>
                            <input
                                type="text"
                                name="seoDefaultTitle"
                                value={config.seoDefaultTitle}
                                onChange={handleChange}
                                placeholder="Enter the default meta title"
                                required
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#334151] mb-1.5">Default Meta Description *</label>
                            <textarea
                                name="seoDefaultDescription"
                                value={config.seoDefaultDescription}
                                onChange={handleChange}
                                placeholder="Enter the default meta description"
                                required
                                rows={3}
                                className="admin-input resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="admin-button-primary w-full sm:w-auto px-8 py-2.5 text-sm"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving Changes...' : 'Save All Changes'}
                    </button>
                </div>
            </form>

            {isMediaSelectorOpen && (
                <MediaSelectorModal
                    onClose={() => setIsMediaSelectorOpen(false)}
                    onSelect={(url) => {
                        setConfig((prev) => prev ? { ...prev, uploadedLogoUrl: url } : null);
                        setIsMediaSelectorOpen(false);
                    }}
                />
            )}
        </div>
    );
}
