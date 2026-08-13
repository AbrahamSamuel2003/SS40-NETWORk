import { redirect } from 'next/navigation';
import { getCurrentSession, getCurrentAdmin } from '@/lib/auth';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getCurrentSession();

    if (!session) {
        redirect('/login');
    }

    if (session.role !== 'ADMIN') {
        redirect('/login');
    }

    const adminUser = await getCurrentAdmin();
    const adminName = adminUser?.fullName || adminUser?.username || 'Administrator';

    return (
        <AdminLayoutClient adminName={adminName}>
            {children}
        </AdminLayoutClient>
    );
}
