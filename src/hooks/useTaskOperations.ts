
import { useState } from 'react';
import { walletDB } from '@/utils/database';
import { toast } from 'sonner';
import { WalletWithBalances } from '@/types/wallet';

export const useTaskOperations = (
  wallets: WalletWithBalances[], 
  setWallets: React.Dispatch<React.SetStateAction<WalletWithBalances[]>>,
  refreshWalletBalances: (walletIds?: number[]) => void,
  refreshWalletStats: (walletIds?: number[]) => void,
  loadActivities: () => void
) => {
  const [isRunning, setIsRunning] = useState(false);

  const executeWalletTasks = async (walletIds: number[]) => {
    try {
      const walletsToRun = wallets.filter(w => walletIds.includes(w.id));
      
      if (walletsToRun.length === 0) return;
      
      // In a real implementation, this would execute actual tasks
      for (const wallet of walletsToRun) {
        console.log(`Executing tasks for wallet ${wallet.address}`);
        
        // Simulate some task execution
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update activity log
        const existingActivities = JSON.parse(localStorage.getItem('activities') || '[]');
        existingActivities.unshift({
          type: 'task_execution',
          timestamp: new Date().toISOString(),
          address: wallet.address,
          details: {
            status: 'success',
            tasks: ['swap', 'claim', 'mint']
          }
        });
        localStorage.setItem('activities', JSON.stringify(existingActivities.slice(0, 100)));
      }
      
      // Refresh balances and stats after tasks
      await refreshWalletBalances(walletIds);
      await refreshWalletStats(walletIds);
      
      // Reload activities
      loadActivities();
      
    } catch (error) {
      console.error('Failed to execute wallet tasks:', error);
      toast.error(`Task execution error: ${error.message}`);
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
        executeWalletTasks([id]);
      } else {
        toast.info(`Stopped bot for wallet`);
      }
    } catch (error) {
      console.error('Failed to set wallet active status:', error);
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
      
      // Execute tasks immediately
      executeWalletTasks(selectedIds);
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

  return {
    isRunning,
    executeWalletTasks,
    setWalletActive,
    startAllTasks,
    stopAllTasks
  };
};
