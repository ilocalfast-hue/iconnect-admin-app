import AdminNav from './components/AdminNav';
import Header from './components/Header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <div className="flex h-screen bg-gray-100">
          <div className="w-64 bg-white shadow-lg rounded-r-lg">
            <div className="p-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900">Admin</h2>
            </div>
            <AdminNav />
          </div>
          <div className="flex flex-col flex-1">
            <Header />
            <main className="flex-1 p-10">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
