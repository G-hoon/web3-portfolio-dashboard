export interface RWATokenInfo {
  address: `0x${string}`;
  name: string;
  symbol: string;
  underlyingAsset: string;
  category: "treasury" | "real-estate" | "credit" | "commodity";
  issuer: string;
  yield: string | null;
  description: string;
  website: string;
  decimals: number;
}

export const rwaTokenList: RWATokenInfo[] = [
  {
    address: "0x96F6eF951840721AdBF46Ac996b59E0235CB985C",
    name: "Ondo US Dollar Yield",
    symbol: "USDY",
    underlyingAsset: "US Treasury Bonds",
    category: "treasury",
    issuer: "Ondo Finance",
    yield: "5.2% APY",
    description:
      "미국 국채 담보 수익형 스테이블코인. 보유만으로 국채 수익률 획득.",
    website: "https://ondo.finance/usdy",
    decimals: 18,
  },
  {
    address: "0x1B19C19393e2d034D8Ff31ff34c81252FcBbee92",
    name: "Ondo Short-Term US Gov Bond",
    symbol: "OUSG",
    underlyingAsset: "Short-term US Treasuries",
    category: "treasury",
    issuer: "Ondo Finance",
    yield: "4.8% APY",
    description:
      "단기 미국 국채 펀드를 토큰화. 기관 투자자 대상 온체인 국채 접근.",
    website: "https://ondo.finance/ousg",
    decimals: 18,
  },
  {
    address: "0xCA30c93B02514f86d5C86a6e375E3A330B435Fb5",
    name: "Backed IB01",
    symbol: "bIB01",
    underlyingAsset: "iShares $ Treasury Bond 0-1yr ETF",
    category: "treasury",
    issuer: "Backed Finance",
    yield: "4.5% APY",
    description:
      "BlackRock iShares 단기 국채 ETF를 토큰화. 규제 준수 구조.",
    website: "https://backed.fi",
    decimals: 18,
  },
  {
    address: "0x136471a34f6ef19fE571EFFC1CA711fdb8E49f2b",
    name: "Hashnote USYC",
    symbol: "USYC",
    underlyingAsset: "US Treasuries",
    category: "treasury",
    issuer: "Hashnote",
    yield: "5.0% APY",
    description:
      "미국 단기 국채 기반 수익형 토큰. T+0 실시간 환매 지원.",
    website: "https://usyc.hashnote.com",
    decimals: 6,
  },
];

export const erc20ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;
