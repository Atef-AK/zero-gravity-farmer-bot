
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { Wallet } from '@/utils/database';
import { WalletWithBalances, AppContextType } from '@/types/wallet';
import { useWalletOperations } from '@/hooks/useWalletOperations';
import { useActivities } from '@/hooks/useActivities';
import { useTaskOperations } from '@/hooks/useTaskOperations';

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const {
    wallets,
    setWallets,
    isLoadingWallets,
    loadWallets,
    addWallet,
    importWallets,
    updateWallet,
    deleteWallet,
    selectWallet,
    selectAllWallets,
    deselectAllWallets,
    refreshWalletBalances,
    refreshWalletStats
  } = useWalletOperations();

  const { activities, loadActivities } = useActivities();

  const {
    isRunning,
    setWalletActive,
    startAllTasks,
    stopAllTasks
  } = useTaskOperations(
    wallets,
    setWallets,
    refreshWalletBalances,
    refreshWalletStats,
    loadActivities
  );

  // Load initial data
  useEffect(() => {
    loadWallets();
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    refreshWalletStats,
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
