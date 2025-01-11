"use client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient } from "@tanstack/react-query";
import { darkTheme , lightTheme} from "@rainbow-me/rainbowkit";
import {
  Chain
} from '@rainbow-me/rainbowkit';

const iExec = {
  id: 134,
  name: 'iExec Sidechain',
  iconBackground: '#fff',
  nativeCurrency: { name: 'xRLC', symbol: 'xRLC', decimals: 18 },
  rpcUrls: {
    default: { http: ['bellecour.iex.ec'] },
  },
  blockExplorers: {
    default: { name: 'OffChainVM', url: 'blockscout-bellecour.iex.ec' },
  }
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: "Uni-Hack",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string,
  chains: [iExec],
  ssr: true,
});

export const queryClient = new QueryClient();

export const dark = darkTheme();
export const light = lightTheme();