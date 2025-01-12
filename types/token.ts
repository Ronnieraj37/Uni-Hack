// types/token.ts
export interface Token {
  symbol: string;
  name: string;
  logo: string;
}

export const tokens: Token[] = [
  { symbol: "ETH", name: "Ethereum", logo: "/eth-logo.jpeg" },
  { symbol: "USDC", name: "USD Coin", logo: "/usdc-logo.jpeg" },
  { symbol: "LINK", name: "Chainlink", logo: "/link-logo.png" },
  { symbol: "WBTC", name: "Wrapped Bitcoin", logo: "/wbtc-logo.png" },
  { symbol: "AAVE", name: "Aave", logo: "/aave-logo.jpeg" },
  { symbol: "UNI", name: "Uniswap", logo: "/uni-logo.png" },
  { symbol: "MATIC", name: "Polygon", logo: "/matic-logo.png" },
  { symbol: "DAI", name: "Dai", logo: "/dai-logo.jpeg" },
];

export const getTokenInfo = (symbol: string): Token | undefined => {
  return tokens.find(
    (token) => token.symbol.toUpperCase() === symbol.toUpperCase()
  );
};
