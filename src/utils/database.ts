
import { toast } from '@/components/ui/sonner';

// Define wallet type
export interface Wallet {
  id?: number;
  address: string;
  privateKey: string;
  name?: string;
  selected?: boolean;
  active?: boolean;
}

// Define activity type
export interface Activity {
  id?: number;
  walletAddress: string;
  type: 'claim' | 'swap' | 'transfer' | 'mint' | 'register' | 'upload';
  status: 'pending' | 'success' | 'failed';
  details: string;
  timestamp: number;
  txHash?: string;
}

// Mock database for wallets (in a real app, this would use IndexedDB, LocalStorage, or SQLite)
class WalletDB {
  private wallets: Wallet[] = [];
  private activities: Activity[] = [];

  constructor() {
    // Initialize with some sample data for development
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    try {
      const savedWallets = localStorage.getItem('zeroGWallets');
      const savedActivities = localStorage.getItem('zeroGActivities');
      
      if (savedWallets) {
        this.wallets = JSON.parse(savedWallets);
      }
      
      if (savedActivities) {
        this.activities = JSON.parse(savedActivities);
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('zeroGWallets', JSON.stringify(this.wallets));
      localStorage.setItem('zeroGActivities', JSON.stringify(this.activities));
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
      toast.error('Failed to save data locally');
    }
  }

  public getAllWallets(): Wallet[] {
    return [...this.wallets];
  }

  public getWallet(address: string): Wallet | undefined {
    return this.wallets.find(wallet => wallet.address.toLowerCase() === address.toLowerCase());
  }

  public addWallet(wallet: Wallet): Wallet {
    // Check if wallet already exists
    const existingIndex = this.wallets.findIndex(w => 
      w.address.toLowerCase() === wallet.address.toLowerCase()
    );
    
    if (existingIndex >= 0) {
      throw new Error('Wallet with this address already exists');
    }
    
    // Add new wallet with id
    const newWallet = {
      ...wallet,
      id: Date.now(),
      name: wallet.name || `Wallet ${this.wallets.length + 1}`,
      active: false,
      selected: false
    };
    
    this.wallets.push(newWallet);
    this.saveToLocalStorage();
    return newWallet;
  }

  public updateWallet(wallet: Wallet): Wallet {
    const index = this.wallets.findIndex(w => w.id === wallet.id);
    
    if (index < 0) {
      throw new Error('Wallet not found');
    }
    
    this.wallets[index] = { ...this.wallets[index], ...wallet };
    this.saveToLocalStorage();
    return this.wallets[index];
  }

  public deleteWallet(id: number): void {
    this.wallets = this.wallets.filter(wallet => wallet.id !== id);
    this.saveToLocalStorage();
  }

  public importWallets(wallets: Wallet[]): number {
    let added = 0;
    
    for (const wallet of wallets) {
      try {
        this.addWallet(wallet);
        added++;
      } catch (error) {
        console.warn(`Skipping duplicate wallet: ${wallet.address}`);
      }
    }
    
    this.saveToLocalStorage();
    return added;
  }

  public addActivity(activity: Activity): Activity {
    const newActivity = {
      ...activity,
      id: Date.now(),
      timestamp: activity.timestamp || Date.now()
    };
    
    this.activities.push(newActivity);
    this.saveToLocalStorage();
    return newActivity;
  }

  public getActivities(limit: number = 50, walletAddress?: string): Activity[] {
    let filtered = this.activities;
    
    if (walletAddress) {
      filtered = filtered.filter(a => 
        a.walletAddress.toLowerCase() === walletAddress.toLowerCase()
      );
    }
    
    return filtered
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  public getWalletStats(walletAddress: string) {
    const activities = this.activities.filter(a => 
      a.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
    
    return {
      total: activities.length,
      successful: activities.filter(a => a.status === 'success').length,
      failed: activities.filter(a => a.status === 'failed').length,
      byType: {
        claim: activities.filter(a => a.type === 'claim').length,
        swap: activities.filter(a => a.type === 'swap').length,
        transfer: activities.filter(a => a.type === 'transfer').length,
        mint: activities.filter(a => a.type === 'mint').length,
        register: activities.filter(a => a.type === 'register').length,
        upload: activities.filter(a => a.type === 'upload').length
      }
    };
  }

  public clearActivities(walletAddress?: string): void {
    if (walletAddress) {
      this.activities = this.activities.filter(a => 
        a.walletAddress.toLowerCase() !== walletAddress.toLowerCase()
      );
    } else {
      this.activities = [];
    }
    
    this.saveToLocalStorage();
  }

  // Bulk operations on wallets
  public selectWallets(ids: number[]): void {
    this.wallets = this.wallets.map(wallet => ({
      ...wallet,
      selected: ids.includes(wallet.id)
    }));
    
    this.saveToLocalStorage();
  }

  public selectAllWallets(): void {
    this.wallets = this.wallets.map(wallet => ({
      ...wallet,
      selected: true
    }));
    
    this.saveToLocalStorage();
  }

  public deselectAllWallets(): void {
    this.wallets = this.wallets.map(wallet => ({
      ...wallet,
      selected: false
    }));
    
    this.saveToLocalStorage();
  }

  public getSelectedWallets(): Wallet[] {
    return this.wallets.filter(wallet => wallet.selected);
  }

  public setWalletsActive(ids: number[], active: boolean): void {
    this.wallets = this.wallets.map(wallet => ({
      ...wallet,
      active: ids.includes(wallet.id) ? active : wallet.active
    }));
    
    this.saveToLocalStorage();
  }
}

// Create a singleton instance
export const walletDB = new WalletDB();
