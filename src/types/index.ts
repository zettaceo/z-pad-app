/**
 * Z-PAD — Core domain types
 */

export type ChainId = 'bsc' | 'eth' | 'polygon' | 'arbitrum' | 'zetta' | 'solana' | 'base';
export type SaleStatus = 'live' | 'upcoming' | 'ended';
export type SaleType = 'fairlaunch' | 'presale' | 'private' | 'lbp' | 'bondingcurve';

export interface AiBreakdown {
  tokenomics: number;
  contract: number;
  team: number;
  market: number;
  liquidity: number;
  community: number;
}

export interface Tokenomics {
  supply: string;
  presale: number;
  liquidity: number;
  team: number;
  marketing: number;
}

export interface Project {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  description: string;
  chain: ChainId;
  chainName: string;
  saleType: string;
  saleTypeKey: SaleType;
  status: SaleStatus;
  featured?: boolean;
  hot?: boolean;
  trending?: boolean;
  rate: string;
  ratePerBase: number;
  raised: number;
  target: number;
  softCap: number;
  liquidity: number;
  participants: number;
  startsAt: number;
  endsAt: number;
  minBuy: number;
  maxBuy: number;
  kyc: boolean;
  audited: string | null;
  refundable: boolean;
  aiScore: number;
  aiBreakdown: AiBreakdown;
  aiSummary: string;
  aiStrengths: string[];
  aiFlags: string[];
  tokenomics: Tokenomics;
  vesting?: string;
}

export interface Position {
  id: string;
  name: string;
  symbol: string;
  invested: number;
  value: number;
  change: number;
  claimable: number;
  vestingEnds: number | null;
}

export interface Activity {
  type: 'buy' | 'claim' | 'stake';
  project: string;
  amount: string;
  tokens: string | null;
  time: number;
  status: 'confirmed' | 'pending' | 'failed';
  tx: string;
}

export interface Quest {
  id: string;
  icon: string;
  title: string;
  desc: string;
  reward: string;
  completed: boolean;
  progress: number;
}

export interface Proposal {
  id: string;
  title: string;
  category: string;
  author: string;
  status: 'active' | 'passed' | 'rejected';
  endsAt: number;
  desc: string;
  votes: { for: number; against: number; abstain: number };
  totalVotes: number;
}

export interface Wallet {
  connected: boolean;
  address: string | null;
  walletName: string | null;
  balance: { bnb: number; usdt: number; z: number; eth: number; sol: number };
  kyc: boolean;
  reputation: number;
  level: number;
  xp: number;
  stakedZ: number;
}
