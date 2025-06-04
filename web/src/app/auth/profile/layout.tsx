'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X } from 'lucide-react';
import ProfileSidebar from '@/components/layouts/aside-profile';
import { MenuItemProfile } from '@/lib/type/profile.interface';
import { ConfirmationModal } from '@/components/section/confirm-model';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: Props) {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<MenuItemProfile[]>([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/auth/profile/setup');
        const json = await res.json();
        const processedItems: MenuItemProfile[] = json.data.map((item: MenuItemProfile) => {
          if (item.label === 'Logout') {
            return {
              ...item,
              onClick: () => setIsModalOpen(true), // Open modal on logout click
            };
          }
          return item;
        });

        setItems(processedItems);
      } catch (err) {
        console.error('Failed to load:', err);
        setError('Failed to load profile menu.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleConfirmLogout = () => {
    signOut({ callbackUrl: '/' });
    setIsModalOpen(false);  // Close the modal after logout
  };

  const handleCancelLogout = () => {
    setIsModalOpen(false);  // Just close the modal without doing anything
  };

  if (!session || loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <div>{error}</div>
        <Button onSubmit={handleCancelLogout}>Log Out</Button>
      </div>
    )
  }

  return (
    <div className="flex h-screen relative">
      {/* Toggle Button for Mobile */}
      <div className={`lg:hidden absolute ${sidebarOpen ? '' : 'top-4 left-4 z-50'} `}>
        <Button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="p-2 rounded-md shadow"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full shadow-lg z-40 transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-2/4' : 'w-0'} overflow-hidden lg:relative lg:block lg:w-1/4 border-r`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full p-4">
          <ProfileSidebar menuItems={items} />
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 overflow-auto z-10 p-4 ${!sidebarOpen ? 'mx-20' : ''}`}
        onClick={() => {
          if (sidebarOpen) setSidebarOpen(false);
        }}
      >
        {children}
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        title="Are you sure you want to log out?"
        description="If you log out, you will be redirected to the home page."
        confirmLabel="Log out"
        cancelLabel="Cancel"
      />
    </div>
  );
}