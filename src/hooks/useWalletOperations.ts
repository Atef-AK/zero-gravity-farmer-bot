
import { useState } from 'react';
import { walletDB, Wallet } from '@/utils/database';
import { toast } from 'sonner';
import { WalletWithBalances } from '@/types/wallet';
import { getTokenBalance, getWalletStats, TOKEN_ADDRESSES } from '@/utils/web3';

export const useWalletOperations = () => {
  const [wallets, setWallets] = useState<WalletWithBalances[]>([]);
  const [isLoadingWallets, setIsLoadingWallets] = useState(true);

  const loadWallets = async () => {
    setIsLoadingWallets(true);
    try {
      const walletList = walletDB.getAllWallets();
      setWallets(walletList);
      
      // Load balances for all wallets
      refreshWalletBalances();
      
      // Load wallet stats
      refreshWalletStats();
    } catch (error) {
      console.error('Failed to load wallets:', error);
      toast.error('Failed to load wallet data');
    } finally {
      setIsLoadingWallets(false);
    }
  };

  const addWallet = (wallet: Wallet) => {
    try {
      const newWallet = walletDB.addWallet(wallet);
      setWallets(prev => [...prev, newWallet]);
      toast.success('Wallet added successfully');
      
      // Load balances for the new wallet
      refreshWalletBalances([newWallet.id]);
      
      // Load stats for the new wallet
      refreshWalletStats([newWallet.id]);
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
  
  const refreshWalletStats = async (walletIds?: number[]) => {
    try {
      // Get wallets to update
      const walletsToUpdate = walletIds
        ? wallets.filter(w => walletIds.includes(w.id))
        : wallets;
      
      // Update stats in parallel
      const updatedWallets = await Promise.all(
        walletsToUpdate.map(async wallet => {
          try {
            // Get on-chain stats
            const { txCount, nftCount } = await getWalletStats(wallet.address);
            
            return {
              ...wallet,
              stats: {
                txCount,
                nftCount
              }
            };
          } catch (error) {
            console.error(`Failed to get stats for wallet ${wallet.address}:`, error);
            return {
              ...wallet,
              stats: wallet.stats || { txCount: 0, nftCount: 0 }
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
      console.error('Failed to refresh wallet stats:', error);
    }
  };

  return {
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
  };
};
