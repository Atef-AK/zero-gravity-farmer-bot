
import { ethers } from 'ethers';
import { toast } from 'sonner';

// Network configuration - updatable via settings
export const NETWORK_CONFIG = {
  name: '0G-Newton-Testnet',
  chainId: 16600,
  symbol: 'A0GI',
  rpcUrl: 'https://evmrpc-testnet.0g.ai',
  blockExplorerUrl: 'https://chainscan-newton.0g.ai',
  wsUrl: 'wss://evmrpc-testnet.0g.ai/ws'
};

// Token contract addresses - updatable via settings
export const TOKEN_ADDRESSES = {
  A0GI: '0x0000000000000000000000000000000000000000', // Native token
  USDT: '0x9a87c2412d500343c073e5ae5394e3be3c3fce50',
  BTC: '0x1e0d871472973c562650e991ed8006549f8cbefc',
  ETH: '0xce830d0905e0f7a9b300401729761579c5fb6bd6'
};

// DEX contract addresses - updatable via settings
export const DEX_ADDRESSES = {
  zeroGHubRouter: '0xD86b764618c6E3C078845BE3c3fCe50CE9535Da7',
  zeroDexRouter: '0xE233D75Ce6f04C04610947188DEC7C55790beF3b',
  faucetContract: '0x83c4A688174A8d4b99b4C8A2feC124dff79D58d2',
};

// Smart contract addresses - updatable via settings
export const CONTRACT_ADDRESSES = {
  flow: '0x0460aA47b41a66694c0a73f667a1b795A5ED3556',
  mine: '0x1785c8683b3c527618eFfF78d876d9dCB4b70285',
  market: '0x20f7e27cD0FaBD87F96afC4E83A88a47E9Ce4689',
  reward: '0x0496D0817BD8519e0de4894Dc379D35c35275609'
};

// APIs endpoints
export const API_ENDPOINTS = {
  faucet: 'https://992dkn4ph6.execute-api.us-west-1.amazonaws.com/',
  swap: 'https://hub.0g.ai/api/swap',
  nftMint: 'https://conft.app/api/mint',
  storage: 'https://storagescan-newton.0g.ai/api/storage',
  explorer: 'https://chainscan-newton.0g.ai/api'
};

// Captcha and proxy configuration - updatable via settings
export const CAPTCHA_CONFIG = {
  siteKey: '1230eb62-f50c-4da4-a736-da5c3c342e8e',
  apiKey: '10938759000c3287a48933a4bb5a061c',
  service: '2captcha',
  proxyUsername: '',
  proxyPassword: '',
  proxyHost: '',
};

// Gas price configuration - updatable via settings
export const GAS_CONFIG = {
  gasPrice: 1,
  swapsPerWallet: 48,
};

// Standard ERC20 ABI for token interactions - fixed JSON format
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

// Alternative ERC20 ABI format
export const ERC20_ABI_ALT = [
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"name": "success", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"}],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
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

// Get token balance - supports both ABI formats
export const getTokenBalance = async (tokenAddress: string, walletAddress: string) => {
  try {
    const provider = getProvider();
    if (!provider) return '0';

    if (tokenAddress === TOKEN_ADDRESSES.A0GI) {
      const balance = await provider.getBalance(walletAddress);
      return ethers.utils.formatEther(balance);
    } else {
      // Try with standard ABI first
      try {
        const tokenContract = new ethers.Contract(
          tokenAddress,
          ERC20_ABI,
          provider
        );
        const balance = await tokenContract.balanceOf(walletAddress);
        const decimals = await tokenContract.decimals();
        return ethers.utils.formatUnits(balance, decimals);
      } catch (error) {
        // If standard ABI fails, try with alternative ABI
        console.log("Trying alternative ABI format");
        const tokenContract = new ethers.Contract(
          tokenAddress,
          ERC20_ABI_ALT,
          provider
        );
        const balance = await tokenContract.balanceOf(walletAddress);
        const decimals = await tokenContract.decimals();
        return ethers.utils.formatUnits(balance, decimals);
      }
    }
  } catch (error) {
    console.error('Failed to get token balance:', error);
    return '0';
  }
};

// Solve captcha using 2captcha service
export const solveCaptcha = async () => {
  try {
    // In a real implementation, this would make an actual API call to 2captcha
    // For demo, simulate solving captcha
    console.log('Solving captcha with 2captcha...');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock response
    return {
      success: true,
      solution: 'captcha-token-' + Math.random().toString(36).substring(2, 15)
    };
  } catch (error) {
    console.error('Failed to solve captcha:', error);
    throw new Error(`Failed to solve captcha: ${error.message}`);
  }
};

// Claim tokens from faucet
export const claimFromFaucet = async (walletAddress: string, tokenSymbol: string, useProxy = false) => {
  try {
    console.log(`Claiming ${tokenSymbol} for ${walletAddress} from faucet`);
    
    let captchaToken = '';
    
    // For A0GI token, solve captcha
    if (tokenSymbol === 'A0GI') {
      const captchaResult = await solveCaptcha();
      captchaToken = captchaResult.solution;
      console.log('Captcha solved:', captchaToken);
    }
    
    // Configure proxy if needed
    const proxyConfig = useProxy ? {
      host: CAPTCHA_CONFIG.proxyHost,
      auth: {
        username: CAPTCHA_CONFIG.proxyUsername,
        password: CAPTCHA_CONFIG.proxyPassword
      }
    } : null;
    
    if (useProxy && proxyConfig) {
      console.log('Using proxy for claim:', proxyConfig.host);
    }
    
    // Simulate API call to faucet
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In real implementation, this would use ethers.js to interact with the faucet contract
    // or make an API call to the faucet endpoint
    
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

// Perform token swap using the specified DEX
export const swapTokens = async (
  privateKey: string,
  fromToken: string,
  toToken: string,
  amount: string,
  dexAddress: string = DEX_ADDRESSES.zeroDexRouter
) => {
  try {
    console.log(`Swapping ${amount} ${fromToken} to ${toToken} using DEX: ${dexAddress}`);
    
    const wallet = createWallet(privateKey);
    if (!wallet) throw new Error("Invalid wallet");
    
    const fromTokenAddress = TOKEN_ADDRESSES[fromToken] || fromToken;
    const toTokenAddress = TOKEN_ADDRESSES[toToken] || toToken;
    
    if (!fromTokenAddress || !toTokenAddress) {
      throw new Error("Invalid token addresses");
    }
    
    // For real implementation:
    // 1. Create contract interface to the router
    // 2. Approve tokens if needed
    // 3. Make the actual swap call
    
    // Simulate blockchain delay
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
    console.log(`Transferring ${amount} tokens from wallet to ${toAddress}`);
    
    const wallet = createWallet(fromPrivateKey);
    if (!wallet) throw new Error("Invalid wallet");
    
    // For real implementation:
    // 1. Create contract interface to the token
    // 2. Call transfer function
    
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
    console.log('Minting NFT');
    
    const wallet = createWallet(privateKey);
    if (!wallet) throw new Error("Invalid wallet");
    
    // For real implementation:
    // 1. Create contract interface to the NFT contract
    // 2. Call mint function
    
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
    console.log(`Registering domain ${domainName}`);
    
    const wallet = createWallet(privateKey);
    if (!wallet) throw new Error("Invalid wallet");
    
    // For real implementation:
    // 1. Create contract interface to the domain registry
    // 2. Call register function
    
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
    console.log('Uploading file to 0G Storage');
    
    const wallet = createWallet(privateKey);
    if (!wallet) throw new Error("Invalid wallet");
    
    // For real implementation:
    // 1. Create a FormData object with the file
    // 2. Sign the request with the wallet
    // 3. Send the file to the storage API
    
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
