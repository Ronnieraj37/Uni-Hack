export interface Token {
    symbol: string;
    name: string;
    logo: string;
    network?: string;
  }
  
  export interface SelectedToken {
    symbol: string;
    percentage: number;
  }
  
  export interface ProtectionStatus {
    stage: string;
    address?: string;
    collectionId?: string;
    error?: string;
  }
  
  export interface PortfolioData {
    timestamp: string;
    allocations: {
      token: string;
      percentage: number;
    }[];
  }