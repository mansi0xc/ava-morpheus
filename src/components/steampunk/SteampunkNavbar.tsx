import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, ChevronDown, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OrnateButton } from '@/components/ui/ornate-button';
import { GearSpinner } from './GearSpinner';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAppDispatch } from '@/store/hooks';
import { setWalletAddress, setWalletStatus } from '@/store/walletSlice';


export const SteampunkNavbar: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const { status: connectStatus } = useConnect();
  const { status: disconnectStatus } = useDisconnect();
  const dispatch = useAppDispatch();

// whenever wagmi account state changes, update redux
useEffect(() => {
  if (isConnecting) {
    dispatch(setWalletStatus('connecting'));
        console.log('📤 Dispatched: setWalletStatus("connecting")');

  } else if (isConnected) {
    dispatch(setWalletStatus('connected'));
        console.log('📤 Dispatched: setWalletStatus("connected")');

  } else if (isDisconnected) {
    dispatch(setWalletStatus('disconnected'));
        console.log('📤 Dispatched: setWalletStatus("disconnected")');

  }

  if (isConnected && address) {
    dispatch(setWalletAddress(address));
        console.log('📤 Dispatched: setWalletAddress', address);

  } else if (isDisconnected) {
    dispatch(setWalletAddress(null));
        console.log('📤 Dispatched: setWalletAddress(null)');

  }
}, [address, isConnected, isConnecting, isDisconnected, dispatch]);


  // Debugging logs
  useEffect(() => {
    console.log('🔗 Wallet Connection Status:', {
      isConnected,
      isConnecting,
      isDisconnected,
      connectStatus,
      disconnectStatus,
      address: address || 'No address',
    });
  }, [isConnected, isConnecting, isDisconnected, connectStatus, disconnectStatus, address]);

  const navItems = [
    { name: 'About', path: '/about' },
    { name: 'Mystery', path: '/mystery' },
    { name: 'Case Clues', path: '/clues' },
    { name: 'Marketplace', path: '/marketplace' },
  ];

  const profileItems = [
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'NFT Collection', icon: Package, path: '/nft-collection' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface border-b-2 border-primary shadow-glow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <GearSpinner size="md" className="text-primary" />
            <span className="font-steampunk text-xl font-bold text-foreground glow-text">
              AVALANCHE
            </span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'px-3 py-2 text-sm font-ornate transition-all duration-200 border-b-2 border-transparent',
                  isActive(item.path)
                    ? 'text-primary border-primary glow-text'
                    : 'text-muted-foreground hover:text-foreground hover:border-primary/50'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Wallet / Profile */}
          <div className="relative">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus || authenticationStatus === 'authenticated');

                // ✅ Safe props object
                const containerProps = !ready
                  ? {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      } as React.CSSProperties,
                    }
                  : {};

                return (
                  <div {...containerProps}>
                    {!connected ? (
                      <OrnateButton
                        variant="default"
                        size="sm"
                        onClick={() => {
                          console.log('🚀 Opening wallet connect modal...');
                          openConnectModal();
                        }}
                        disabled={isConnecting}
                      >
                        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                      </OrnateButton>
                    ) : (
                      <>
                        <OrnateButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsProfileOpen(!isProfileOpen)}
                          className="flex items-center space-x-2"
                        >
                          <User className="w-4 h-4" />
                          <ChevronDown
                            className={cn(
                              'w-4 h-4 transition-transform',
                              isProfileOpen && 'rotate-180'
                            )}
                          />
                        </OrnateButton>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                          <div className="absolute right-0 mt-2 w-48 bg-surface-elevated border-2 border-primary rounded-ornate shadow-glow">
                            <div className="py-2">
                              {/* Account Info */}
                              <div className="px-4 py-2 border-b border-primary/20">
                                <div className="text-xs text-muted-foreground">Connected to</div>
                                <div className="text-sm font-medium text-foreground">
                                  {account.displayName}
                                </div>
                                {account.displayBalance && (
                                  <div className="text-xs text-muted-foreground">
                                    {account.displayBalance}
                                  </div>
                                )}
                              </div>

                              {/* Profile Links */}
                              {profileItems.map((item) => (
                                <Link
                                  key={item.name}
                                  to={item.path}
                                  className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-primary/20 flex items-center space-x-2 transition-colors"
                                  onClick={() => setIsProfileOpen(false)}
                                >
                                  <item.icon className="w-4 h-4" />
                                  <span>{item.name}</span>
                                </Link>
                              ))}

                              {/* Account Actions */}
                              <div className="border-t border-primary/20 pt-2">
                                <button
                                  onClick={() => {
                                    openAccountModal();
                                    setIsProfileOpen(false);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-primary/20 transition-colors"
                                >
                                  Account Details
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SteampunkNavbar;
