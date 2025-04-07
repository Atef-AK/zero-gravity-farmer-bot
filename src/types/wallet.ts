
import { Wallet, Activity } from '@/utils/database';

export interface WalletWithBalances extends Wallet {
  balances?: {
    A0GI: string;
    USDT: string;
    BTC: string;
    ETH: string;
  };
  stats?: {
    txCount: number;
    nftCount: number;
  };
  isLoading?: boolean;
}

export interface AppContextType {
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
  refreshWalletStats: (walletIds?: number[]) => void;
  startAllTasks: () => void;
  stopAllTasks: () => void;
}
