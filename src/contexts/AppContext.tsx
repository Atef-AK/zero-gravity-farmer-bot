
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { walletDB, Wallet, Activity } from '@/utils/database';
import { toast } from '@/components/ui/sonner';
import { getTokenBalance } from '@/utils/web3';
import { TOKEN_ADDRESSES } from '@/utils/web3';

interface WalletWithBalances extends Wallet {
  balances?: {
    A0GI: string;
    USDT: string;
    BTC: string;
    ETH: string;
  };
  isLoading?: boolean;
}

interface AppContextType {
  wallets: WalletWithBalances[];
  selectedWallets: WalletWithBalances[];
  activities: Activity[];
  isLoadingWallets: boolean;
  isRunning: boolean;
  addWallet: (wallet: Wallet) => void;
  importWallets: (wallets: Wallet[]) => void;
  updateWallet: (wallet: Wallet) => void;
  deleteWallet: (id: number) => void;
  selectWallet: (id: number, selected: boolean) => void;
  selectAllWallets: () => void;
  deselectAllWallets: () => void;
  setWalletActive: (id: number, active: boolean) => void;
  refreshWalletBalances: (walletIds?: number[]) => void;
  startAllTasks: () => void;
  stopAllTasks: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<WalletWithBalances[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoadingWallets, setIsLoadingWallets] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  // Load initial data
  useEffect(() => {
    loadWallets();
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadWallets = async () => {
    setIsLoadingWallets(true);
    try {
      const walletList = walletDB.getAllWallets();
      setWallets(walletList);
      
      // Load balances for all wallets
      refreshWalletBalances();
    } catch (error) {
      console.error('Failed to load wallets:', error);
      toast.error('Failed to load wallet data');
    } finally {
      setIsLoadingWallets(false);
    }
  };

  const loadActivities = () => {
    try {
      const activityList = walletDB.getActivities(100);
      setActivities(activityList);
    } catch (error) {
      console.error('Failed to load activities:', error);
    }
  };

  const addWallet = (wallet: Wallet) => {
    try {
      const newWallet = walletDB.addWallet(wallet);
      setWallets(prev => [...prev, newWallet]);
      toast.success('Wallet added successfully');
      
      // Load balances for the new wallet
      refreshWalletBalances([newWallet.id]);
    } catch (error) {
      console.error('Failed to add wallet:', error);
      toast.error(`Failed to add wallet: ${error.message}`);
    }
  };

  const importWallets = (wallets: Wallet[]) => {
    try {
      const added = walletDB.importWallets(wallets);
      loadWallets(); // Reload all wallets
      toast.success(`Successfully imported ${added} wallets`);
    } catch (error) {
      console.error('Failed to import wallets:', error);
      toast.error(`Failed to import wallets: ${error.message}`);
    }
  };

  const updateWallet = (wallet: Wallet) => {
    try {
      const updatedWallet = walletDB.updateWallet(wallet);
      setWallets(prev => 
        prev.map(w => (w.id === updatedWallet.id ? updatedWallet : w))
      );
    } catch (error) {
      console.error('Failed to update wallet:', error);
      toast.error(`Failed to update wallet: ${error.message}`);
    }
  };

  const deleteWallet = (id: number) => {
    try {
      walletDB.deleteWallet(id);
      setWallets(prev => prev.filter(wallet => wallet.id !== id));
      toast.success('Wallet removed successfully');
    } catch (error) {
      console.error('Failed to delete wallet:', error);
      toast.error(`Failed to delete wallet: ${error.message}`);
    }
  };

  const selectWallet = (id: number, selected: boolean) => {
    try {
      setWallets(prev => 
        prev.map(wallet => 
          wallet.id === id ? { ...wallet, selected } : wallet
        )
      );
      
      // Update in database
      walletDB.selectWallets(
        selected 
          ? [...wallets.filter(w => w.selected).map(w => w.id), id].filter(Boolean)
          : wallets.filter(w => w.selected && w.id !== id).map(w => w.id).filter(Boolean)
      );
    } catch (error) {
      console.error('Failed to select/deselect wallet:', error);
    }
  };

  const selectAllWallets = () => {
    try {
      setWallets(prev => prev.map(wallet => ({ ...wallet, selected: true })));
      walletDB.selectAllWallets();
    } catch (error) {
      console.error('Failed to select all wallets:', error);
    }
  };

  const deselectAllWallets = () => {
    try {
      setWallets(prev => prev.map(wallet => ({ ...wallet, selected: false })));
      walletDB.deselectAllWallets();
    } catch (error) {
      console.error('Failed to deselect all wallets:', error);
    }
  };

  const setWalletActive = (id: number, active: boolean) => {
    try {
      setWallets(prev => 
        prev.map(wallet => 
          wallet.id === id ? { ...wallet, active } : wallet
        )
      );
      
      // Update in database
      walletDB.setWalletsActive([id], active);
      
      if (active) {
        toast.success(`Started bot for wallet`);
      } else {
        toast.info(`Stopped bot for wallet`);
      }
    } catch (error) {
      console.error('Failed to set wallet active status:', error);
    }
  };

  const refreshWalletBalances = async (walletIds?: number[]) => {
    try {
      // Mark wallets as loading
      setWallets(prev => 
        prev.map(wallet => ({
          ...wallet,
          isLoading: !walletIds || walletIds.includes(wallet.id) ? true : wallet.isLoading
        }))
      );
      
      // Get wallets to update
      const walletsToUpdate = walletIds
        ? wallets.filter(w => walletIds.includes(w.id))
        : wallets;
      
      // Update balances in parallel
      const updatedWallets = await Promise.all(
        walletsToUpdate.map(async wallet => {
          try {
            // Get balances for all tokens
            const a0giBalance = await getTokenBalance(TOKEN_ADDRESSES.A0GI, wallet.address);
            const usdtBalance = await getTokenBalance(TOKEN_ADDRESSES.USDT, wallet.address);
            const btcBalance = await getTokenBalance(TOKEN_ADDRESSES.BTC, wallet.address);
            const ethBalance = await getTokenBalance(TOKEN_ADDRESSES.ETH, wallet.address);
            
            return {
              ...wallet,
              balances: {
                A0GI: a0giBalance,
                USDT: usdtBalance,
                BTC: btcBalance,
                ETH: ethBalance
              },
              isLoading: false
            };
          } catch (error) {
            console.error(`Failed to get balances for wallet ${wallet.address}:`, error);
            return {
              ...wallet,
              balances: wallet.balances || { A0GI: '0', USDT: '0', BTC: '0', ETH: '0' },
              isLoading: false
            };
          }
        })
      );
      
      // Update state
      setWallets(prev => {
        const updated = [...prev];
        for (const wallet of updatedWallets) {
          const index = updated.findIndex(w => w.id === wallet.id);
          if (index >= 0) {
            updated[index] = wallet;
          }
        }
        return updated;
      });
    } catch (error) {
      console.error('Failed to refresh wallet balances:', error);
      
      // Reset loading state on error
      setWallets(prev => 
        prev.map(wallet => ({
          ...wallet,
          isLoading: false
        }))
      );
    }
  };

  const startAllTasks = () => {
    try {
      const selectedIds = wallets
        .filter(wallet => wallet.selected)
        .map(wallet => wallet.id)
        .filter(Boolean);
      
      if (selectedIds.length === 0) {
        toast.warning('No wallets selected');
        return;
      }
      
      walletDB.setWalletsActive(selectedIds, true);
      
      setWallets(prev => 
        prev.map(wallet => ({
          ...wallet,
          active: wallet.selected ? true : wallet.active
        }))
      );
      
      setIsRunning(true);
      toast.success(`Started tasks for ${selectedIds.length} wallets`);
    } catch (error) {
      console.error('Failed to start tasks:', error);
      toast.error(`Failed to start tasks: ${error.message}`);
    }
  };

  const stopAllTasks = () => {
    try {
      const selectedIds = wallets
        .filter(wallet => wallet.selected)
        .map(wallet => wallet.id)
        .filter(Boolean);
      
      if (selectedIds.length === 0) {
        toast.warning('No wallets selected');
        return;
      }
      
      walletDB.setWalletsActive(selectedIds, false);
      
      setWallets(prev => 
        prev.map(wallet => ({
          ...wallet,
          active: wallet.selected ? false : wallet.active
        }))
      );
      
      if (!wallets.some(wallet => wallet.active)) {
        setIsRunning(false);
      }
      
      toast.info(`Stopped tasks for ${selectedIds.length} wallets`);
    } catch (error) {
      console.error('Failed to stop tasks:', error);
      toast.error(`Failed to stop tasks: ${error.message}`);
    }
  };

  const selectedWallets = wallets.filter(wallet => wallet.selected);
  
  const value = {
    wallets,
    selectedWallets,
    activities,
    isLoadingWallets,
    isRunning,
    addWallet,
    importWallets,
    updateWallet,
    deleteWallet,
    selectWallet,
    selectAllWallets,
    deselectAllWallets,
    setWalletActive,
    refreshWalletBalances,
    startAllTasks,
    stopAllTasks
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
