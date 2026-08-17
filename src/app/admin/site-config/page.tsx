'use client';

import * as React from 'react';
import { Save, AlertCircle, CheckCircle2, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
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

export default function SiteConfigPage() {
    const router = useRouter();
    const [config, setConfig] = React.useState<SiteConfig | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);
    const [isUploadingLogo, setIsUploadingLogo] = React.useState(false);
    const [isMediaSelectorOpen, setIsMediaSelectorOpen] = React.useState(false);

    // Status states
    const [errorMsg, setErrorMsg] = React.useState('');
    const [successMsg, setSuccessMsg] = React.useState('');
    const [isUninitialized, setIsUninitialized] = React.useState(false);

    // Initial Fetch
    React.useEffect(() => {
        let isMounted = true;
        const fetchConfig = async () => {
            try {
                const res = await fetch('/api/admin/site-config');
                if (res.status === 401 || res.status === 403) {
                    if (isMounted) {
                        setErrorMsg('Your admin session has expired. Please sign in again.');
                        setIsLoading(false);
                    }
                    return;
                }
                if (res.status === 404) {
                    if (isMounted) {
                        setIsUninitialized(true);
                        setIsLoading(false);
                    }
                    return;
                }

                const data = await res.json();
                if (res.ok && data.success) {
                    if (isMounted) {
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
                        setIsLoading(false);
                    }
                } else {
                    if (isMounted) {
                        setErrorMsg(data.error || 'Failed to load configuration.');
                        setIsLoading(false);
                    }
                }
            } catch {
                if (isMounted) {
                    setErrorMsg('Network error while loading configuration.');
                    setIsLoading(false);
                }
            }
        };

        fetchConfig();
        return () => { isMounted = false; };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!config) return;
        const { name, value } = e.target;
        setConfig(prev => prev ? { ...prev, [name]: value } : prev);

        // Clear status messages on new input edit
        if (errorMsg) setErrorMsg('');
        if (successMsg) setSuccessMsg('');
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        if (!file.type.startsWith('image/')) {
            setErrorMsg('Please upload a valid image file.');
            return;
        }

        setIsUploadingLogo(true);
        setErrorMsg('');

        try {
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
            if (e.target) e.target.value = ''; // Reset input to allow re-upload if needed
        }
    };

    const handleRemoveUploadedLogo = () => {
        setConfig(prev => prev ? { ...prev, uploadedLogoUrl: '' } : prev);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!config) return;

        // Basic frontend validation for required fields
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

        // Email validation
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
                router.refresh(); // Refresh router aggressively to update server components downstream if any
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-200"></div>
            </div>
        );
    }

    if (isUninitialized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center border border-dashed border-gray-200/20 rounded-xl p-8 bg-white">
                <AlertCircle className="w-12 h-12 text-[#9CA3AF] mb-4" />
                <h3 className="text-xl font-bold text-[#111827] mb-2">Not Initialized</h3>
                <p className="text-[#6B7280]">Global configuration has not been initialized yet. Please contact support or run the database seeder.</p>
            </div>
        );
    }

    if (!config) {
        return (
            <div className="bg-[#FEE2E2] border border-[#FCA5A5] text-[#B91C1C] p-4 rounded-xl text-sm mt-4">
                {errorMsg || 'Failed to load configuration.'}
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-[#111827] mb-2">Site Configuration</h2>
                <p className="text-[#6B7280]">Manage the global information and website settings used across the website.</p>
            </div>

            {/* Status Feedback */}
            {errorMsg && (
                <div className="mb-6 bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] px-4 py-3 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#B91C1C]" />
                    <div>{errorMsg}</div>
                </div>
            )}

            {successMsg && (
                <div className="mb-6 bg-[#6B9F91]/10 border border-[#6B9F91]/30 text-[#111827] px-4 py-3 rounded-lg flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#6B9F91]" />
                    <div>{successMsg}</div>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">

                {/* A. Company Information */}
                <div className="admin-card overflow-hidden p-6">
                    <h3 className="text-lg font-semibold text-[#111827] mb-4 border-b border-gray-200 pb-2">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Company Name *</label>
                            <input
                                type="text"
                                name="companyName"
                                value={config.companyName}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Legal Name *</label>
                            <input
                                type="text"
                                name="legalName"
                                value={config.legalName}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Contact Email *</label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={config.contactEmail}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Contact Phone *</label>
                            <input
                                type="text"
                                name="contactPhone"
                                value={config.contactPhone}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">WhatsApp Number *</label>
                            <input
                                type="text"
                                name="whatsappNumber"
                                value={config.whatsappNumber}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Business Hours *</label>
                            <input
                                type="text"
                                name="businessHours"
                                value={config.businessHours}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* B. Branding & Content */}
                <div className="admin-card overflow-hidden p-6">
                    <h3 className="text-lg font-semibold text-[#111827] mb-4 border-b border-gray-200 pb-2">Branding & Content</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Upload Company Logo</label>
                            {config.uploadedLogoUrl ? (
                                <div className="flex items-center gap-4 bg-[#EDF5F2]/70 border border-gray-200 rounded-lg p-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={config.uploadedLogoUrl} alt="Uploaded Logo" className="h-12 w-auto object-contain bg-[#EDF5F2] rounded" />
                                    <div className="flex-1 text-sm text-[#6B7280]">
                                        Using uploaded logo. (Takes priority over URL)
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveUploadedLogo}
                                        className="text-[#B91C1C] hover:text-[#991B1B] p-2 border border-[#FCA5A5] rounded-lg hover:bg-[#FEE2E2] transition-colors"
                                        title="Remove uploaded logo"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="border border-dashed border-gray-200/20 rounded-lg p-6 bg-[#EDF5F2]/70 flex flex-col items-center justify-center text-center">
                                    <div className="flex flex-wrap gap-4 justify-center">
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
                                                className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 ${isUploadingLogo ? 'bg-[#EDF5F2] text-[#6B7280]' : 'bg-[#6B9F91] text-[#111827] hover:bg-[#5C8C80]'} rounded-lg transition-colors font-medium text-sm`}
                                            >
                                                {isUploadingLogo ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-4 h-4" />
                                                        Upload Local File
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsMediaSelectorOpen(true)}
                                            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#EDF5F2] text-[#111827] hover:bg-[#E5F0EC] border border-[#6B9F91]/20 rounded-lg transition-colors font-medium text-sm"
                                        >
                                            <ImageIcon className="w-4 h-4 text-[#6B9F91]" /> Select from Media
                                        </button>
                                    </div>
                                    <p className="text-xs text-[#9CA3AF] mt-3">Upload your custom logo or select from media library. To fallback to an external URL, specify it below.</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">External Logo URL (Fallback)</label>
                            <input
                                type="url"
                                name="logoUrl"
                                value={config.logoUrl || ''}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 transition-all"
                                placeholder="https://example.com/logo.png"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Footer Description *</label>
                            <textarea
                                name="footerDescription"
                                value={config.footerDescription}
                                onChange={handleChange}
                                required
                                rows={3}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* C. Social / External Links */}
                <div className="admin-card overflow-hidden p-6">
                    <h3 className="text-lg font-semibold text-[#111827] mb-4 border-b border-gray-200 pb-2">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">LinkedIn URL</label>
                            <input
                                type="url"
                                name="urlLinkedin"
                                value={config.urlLinkedin || ''}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">YouTube URL</label>
                            <input
                                type="url"
                                name="urlYoutube"
                                value={config.urlYoutube || ''}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Instagram URL</label>
                            <input
                                type="url"
                                name="urlInstagram"
                                value={config.urlInstagram || ''}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* D. Location / Contact */}
                <div className="admin-card overflow-hidden p-6">
                    <h3 className="text-lg font-semibold text-[#111827] mb-4 border-b border-gray-200 pb-2">Location</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Address Text *</label>
                            <textarea
                                name="addressText"
                                value={config.addressText}
                                onChange={handleChange}
                                required
                                rows={2}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 transition-all resize-none"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Google Maps Iframe URL</label>
                            <input
                                type="url"
                                name="googleMapsIframeUrl"
                                value={config.googleMapsIframeUrl || ''}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 transition-all"
                                placeholder="https://www.google.com/maps/embed?pb=..."
                            />
                            <p className="mt-1 text-xs text-[#9CA3AF]">Enter the src URL from the Google Maps embed code.</p>
                        </div>
                    </div>
                </div>

                {/* E. SEO */}
                <div className="admin-card overflow-hidden p-6">
                    <h3 className="text-lg font-semibold text-[#111827] mb-4 border-b border-gray-200 pb-2">Search Engine Optimization</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Default SEO Title *</label>
                            <input
                                type="text"
                                name="seoDefaultTitle"
                                value={config.seoDefaultTitle}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Default SEO Description *</label>
                            <textarea
                                name="seoDefaultDescription"
                                value={config.seoDefaultDescription}
                                onChange={handleChange}
                                required
                                rows={3}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-[#6B9F91] text-[#111827] font-medium px-6 py-2.5 rounded-lg hover:bg-[#5C8C80] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-[#111827]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
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
