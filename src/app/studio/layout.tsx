import HeaderBar from '@/components/HeaderBar';
import Sidebar from '@/components/Sidebar';

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderBar />
      <div className="flex h-screen flex-col pt-12 md:flex-row">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </>
  );
}
