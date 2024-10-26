'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge, Bell, ChevronDown, Heart, Menu, Search, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { User, LogOut, Settings, CreditCard } from 'lucide-react';
import { ModalForm } from './Modal';
import Login from './Login';

// Type definitions
interface User {
  email: string;
  uid: string;
  [key: string]: any;
}

interface Profile {
  profilePic?: string;
}

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const handleLogout = () => {
    router.push('/');
    logout();
    setIsMobileMenuOpen(false);
  };

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
    if (!showTooltip) {
      setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user.email) return;
      try {
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'uid': user.uid,
          },
        });
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const NavLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => (
    <>
      {user && (
        <div className={`${isMobile ? 'flex flex-col space-y-4' : 'hidden lg:flex items-center space-x-6'}`}>
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center space-x-1 px-4 py-2 text-white rounded-md hover:bg-pink-400 transition">
                  <User className="h-5 w-5" />
                  <span className="font-medium">Me</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0 z-[100] bg-white shadow-lg" align="start">
                <div className="flex flex-col py-1">
                  <a href="/dashboard" className="px-4 py-2 hover:bg-pink-50">Dashboard</a>
                  <a href="/profile" className="px-4 py-2 hover:bg-pink-50">My Profile</a>
                  <a href="/photos" className="px-4 py-2 hover:bg-pink-50">My Photos</a>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center space-x-1 px-4 py-2 text-white rounded-md hover:bg-pink-400 transition">
                  <Heart className="h-5 w-5" />
                  <span className="font-medium">Matches</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0 z-[100] bg-white shadow-lg" align="start">
                <div className="flex flex-col py-1">
                  <a href="/connection-requests" className="px-4 py-2 hover:bg-pink-50">New Matches</a>
                  <a href="/connections" className="px-4 py-2 hover:bg-pink-50">My Matches and Chats</a>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center space-x-1 px-4 py-2 text-white rounded-md hover:bg-pink-400 transition">
                  <Search className="h-5 w-5" />
                  <span className="font-medium">Search</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0 z-[100] bg-white shadow-lg" align="start">
                <div className="flex flex-col py-1">
                  <a href="/basic-search" className="px-4 py-2 hover:bg-pink-50">Basic Search</a>
                  <a href="/advanced-search" className="px-4 py-2 hover:bg-pink-50">Advanced Search</a>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className={`sticky top-0 w-full ${user ? 'bg-primaryPink shadow-md' : 'bg-transparent'} z-50`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Mobile Menu Button - Only show for logged in users */}
          {user && (
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] bg-pink-500 z-[100]">
                  <div className="flex flex-col space-y-4 text-white">
                    <NavLinks isMobile={true} />
                    <Button 
                      variant="secondary" 
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900"
                      onClick={() => router.push('/plans')}
                    >
                      Upgrade Now
                    </Button>
                    <Button variant="ghost" onClick={handleLogout} className="w-full text-white">
                      Log out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}

          {/* Logo */}
          <div className="flex items-center">
            <Image 
              src="/images/Head_Logo.png" 
              alt="Logo" 
              width={160} 
              height={160} 
              className="h-12 w-auto lg:h-16"
              priority 
            />
          </div>

          {/* Desktop Navigation */}
          <NavLinks />

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {!user ? (
              // Non-logged in user interface
              <div className="flex items-center space-x-4 font-poppins font-semibold">
                <button
                  className="p-3 rounded-lg text-white hover:underline"
                  onClick={() => setLoginModalOpen(true)}
                >
                  Login
                </button>
                <button
                  className="p-3 rounded-lg text-white hover:underline relative"
                  onClick={toggleTooltip}
                >
                  Help
                  {showTooltip && (
                    <div className="absolute bg-gray-800 text-white text-start text-sm w-80 rounded-lg p-2 z-10 top-12 right-0">
                      <p className='text-center mb-2'>Need help?</p>
                      <p className=''>Contact : +91 8007360032</p>
                     <p> Address : UG- 14/15, Phoenix Market City, East Court, Viman Nagar, Pune</p>
                    </div>
                  )}
                </button>
              </div>
            ) : (
              // Logged in user interface
              <>
                <div className="hidden lg:block">
                  <Button 
                    variant="secondary" 
                    className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900"
                    onClick={() => router.push('/plans')}
                  >
                    Upgrade Now
                  </Button>
                </div>
                
                <Button variant="ghost" className="text-white">
                  <Bell className="h-6 w-6" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={profile?.profilePic || "https://avatar.vercel.sh/placeholder.png"} 
                          alt={user?.email || "Profile"} 
                        />
                        <AvatarFallback>{user?.email ? user.email[0].toUpperCase() : '?'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/billing')}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
      {showModal && <ModalForm onClose={() => setShowModal(false)} onSubmit={(values) => console.log('Modal submitted:', values)} />}
      {isLoginModalOpen && <Login onClose={() => setLoginModalOpen(false)} />}
    </div>
  );
};

export default Navbar;
