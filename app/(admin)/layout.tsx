import AdminNavbar from '@/components/AdminNavbar';
import AuthProvider from '@/components/SessionProvider';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNavbar />
      <main className="pt-20 min-h-screen bg-darkNavy text-bone">
        {children}
      </main>
    </>
  );
}
