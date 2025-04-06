
import { ethers } from 'ethers';
import { toast } from 'sonner';

// Network configuration
export const NETWORK_CONFIG = {
  name: '0G-Newton-Testnet',
  chainId: 16600,
  symbol: 'A0GI',
  rpcUrl: 'https://evmrpc-testnet.0g.ai',
  blockExplorerUrl: 'https://chainscan-newton.0g.ai',
  wsUrl: 'wss://evmrpc-testnet.0g.ai/ws'
};

// Token contract addresses
export const TOKEN_ADDRESSES = {
  A0GI: '0x0000000000000000000000000000000000000000', // Native token
  USDT: '0x201eba5cc46d216ce6dc03f6a759e8e766e956ae',
  BTC: '0xd54ab76474b5025dba69f3b8eff7c824af009c5f',
  ETH: '0x8ae88b2b35f15d6320d77ab8ec7e3410f78376f6'
};

// DEX contract addresses
export const DEX_ADDRESSES = {
  zeroGHubRouter: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  zeroDexRouter: '0x33d9B68db9704c6d4E75453156e8BD8C2DEa4526',
  factoryContract: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  pairFactory: '0xd417A0A4b65D39F57A9A323eC0a3A92647D1f6A7'
};

// Smart contract addresses
export const CONTRACT_ADDRESSES = {
  flow: '0x0460aA47b41a66694c0a73f667a1b795A5ED3556',
  mine: '0x1785c8683b3c527618eFfF78d876d9dCB4b70285',
  market: '0x20f7e27cD0FaBD87F96afC4E83A88a47E9Ce4689',
  reward: '0x0496D0817BD8519e0de4894Dc379D35c35275609'
};

// APIs endpoints
export const API_ENDPOINTS = {
  faucet: 'https://hub.0g.ai/api/faucet/claim',
  swap: 'https://hub.0g.ai/api/swap',
  nftMint: 'https://conft.app/api/mint',
  storage: 'https://storagescan-newton.0g.ai/api/storage',
  explorer: 'https://chainscan-newton.0g.ai/api'
};

// Standard ERC20 ABI for token interactions
export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint amount) returns (bool)',
  'function transferFrom(address sender, address recipient, uint amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint amount)',
  'event Approval(address indexed owner, address indexed spender, uint amount)'
];

// Router ABI (Uniswap V2 compatible) for DEX interactions
export const ROUTER_ABI = [
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)'
];

// Create a provider instance
export const getProvider = () => {
  try {
    return new ethers.providers.JsonRpcProvider(NETWORK_CONFIG.rpcUrl);
  } catch (error) {
    console.error('Failed to create provider:', error);
    toast.error('Failed to connect to the network');
    return null;
  }
};

// Create a wallet instance from a private key
export const createWallet = (privateKey: string) => {
  try {
    const provider = getProvider();
    if (!provider) return null;
    return new ethers.Wallet(privateKey, provider);
  } catch (error) {
    console.error('Failed to create wallet:', error);
    toast.error('Invalid private key');
    return null;
  }
};

// Get token balance
export const getTokenBalance = async (tokenAddress: string, walletAddress: string) => {
  try {
    const provider = getProvider();
    if (!provider) return '0';

    if (tokenAddress === TOKEN_ADDRESSES.A0GI) {
      const balance = await provider.getBalance(walletAddress);
      return ethers.utils.formatEther(balance);
    } else {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        provider
      );
      const balance = await tokenContract.balanceOf(walletAddress);
      const decimals = await tokenContract.decimals();
      return ethers.utils.formatUnits(balance, decimals);
    }
  } catch (error) {
    console.error('Failed to get token balance:', error);
    return '0';
  }
};

// Claim tokens from faucet
export const claimFromFaucet = async (walletAddress: string, tokenSymbol: string) => {
  try {
    // In a real implementation, this would make an actual API call to the faucet
    // For now, we'll simulate it
    console.log(`Claiming ${tokenSymbol} for ${walletAddress} from faucet`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock response
    return {
      success: true,
      txHash: `0x${Math.random().toString(16).substring(2, 50)}`,
      amount: tokenSymbol === 'A0GI' ? '0.5' : '10'
    };
  } catch (error) {
    console.error('Failed to claim from faucet:', error);
    throw new Error(`Failed to claim ${tokenSymbol}: ${error.message}`);
  }
};

// Perform token swap
export const swapTokens = async (
  privateKey: string,
  fromToken: string,
  toToken: string,
  amount: string
) => {
  try {
    // This is a placeholder implementation
    console.log(`Swapping ${amount} ${fromToken} to ${toToken}`);
    
    // Simulate swap delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock response
    return {
      success: true,
      txHash: `0x${Math.random().toString(16).substring(2, 50)}`,
      fromAmount: amount,
      toAmount: (parseFloat(amount) * 1.2).toFixed(6)
    };
  } catch (error) {
    console.error('Failed to swap tokens:', error);
    throw new Error(`Swap failed: ${error.message}`);
  }
};

// Transfer tokens between wallets
export const transferTokens = async (
  fromPrivateKey: string,
  toAddress: string,
  tokenAddress: string,
  amount: string
) => {
  try {
    // This is a placeholder implementation
    console.log(`Transferring ${amount} tokens from wallet to ${toAddress}`);
    
    // Simulate transfer delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock response
    return {
      success: true,
      txHash: `0x${Math.random().toString(16).substring(2, 50)}`,
      amount: amount
    };
  } catch (error) {
    console.error('Failed to transfer tokens:', error);
    throw new Error(`Transfer failed: ${error.message}`);
  }
};

// Mint NFT
export const mintNFT = async (privateKey: string) => {
  try {
    // This is a placeholder implementation
    console.log('Minting NFT');
    
    // Simulate minting delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Return mock response
    return {
      success: true,
      txHash: `0x${Math.random().toString(16).substring(2, 50)}`,
      tokenId: Math.floor(Math.random() * 10000)
    };
  } catch (error) {
    console.error('Failed to mint NFT:', error);
    throw new Error(`NFT minting failed: ${error.message}`);
  }
};

// Register domain
export const registerDomain = async (privateKey: string, domainName: string) => {
  try {
    // This is a placeholder implementation
    console.log(`Registering domain ${domainName}`);
    
    // Simulate registration delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Return mock response
    return {
      success: true,
      txHash: `0x${Math.random().toString(16).substring(2, 50)}`,
      domain: domainName
    };
  } catch (error) {
    console.error('Failed to register domain:', error);
    throw new Error(`Domain registration failed: ${error.message}`);
  }
};

// Upload file to 0G Storage
export const uploadFile = async (privateKey: string, fileData: Blob) => {
  try {
    // This is a placeholder implementation
    console.log('Uploading file to 0G Storage');
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    // Return mock response
    return {
      success: true,
      txHash: `0x${Math.random().toString(16).substring(2, 50)}`,
      fileUrl: `https://storagescan-newton.0g.ai/file/${Math.random().toString(36).substring(2, 15)}`
    };
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw new Error(`File upload failed: ${error.message}`);
  }
};
