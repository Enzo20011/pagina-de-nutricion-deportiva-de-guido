import AdminNavbar from '@/components/AdminNavbar';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNavbar />
      <main className="pt-16 md:pt-20 min-h-screen bg-darkNavy text-bone">
        {children}
      </main>
    </>
  );
}
