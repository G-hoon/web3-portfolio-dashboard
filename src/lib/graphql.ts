import { GraphQLClient, gql } from "graphql-request";

// Uniswap V3 서브그래프 (Ethereum Mainnet)
const SUBGRAPH_ID = "5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV";
const API_KEY = process.env.NEXT_PUBLIC_THEGRAPH_API_KEY;

const UNISWAP_V3_ENDPOINT = API_KEY
  ? `https://gateway.thegraph.com/api/${API_KEY}/subgraphs/id/${SUBGRAPH_ID}`
  : `https://gateway.thegraph.com/api/subgraphs/id/${SUBGRAPH_ID}`;

export const uniswapClient = new GraphQLClient(UNISWAP_V3_ENDPOINT);

// --- 타입 정의 ---

export interface UniswapSwap {
  id: string;
  timestamp: string;
  pool: {
    token0: { symbol: string; name: string };
    token1: { symbol: string; name: string };
  };
  amount0: string;
  amount1: string;
  amountUSD: string;
  transaction: { id: string };
}

export interface UniswapPosition {
  id: string;
  pool: {
    token0: { symbol: string; name: string };
    token1: { symbol: string; name: string };
    feeTier: string;
  };
  liquidity: string;
  depositedToken0: string;
  depositedToken1: string;
}

export interface UniswapStats {
  poolCount: string;
  txCount: string;
  totalVolumeUSD: string;
  totalValueLockedUSD: string;
}

// --- 쿼리 ---

const USER_SWAPS_QUERY = gql`
  query UserSwaps($userAddress: String!, $first: Int!) {
    swaps(
      where: { origin: $userAddress }
      orderBy: timestamp
      orderDirection: desc
      first: $first
    ) {
      id
      timestamp
      pool {
        token0 {
          symbol
          name
        }
        token1 {
          symbol
          name
        }
      }
      amount0
      amount1
      amountUSD
      transaction {
        id
      }
    }
  }
`;

const USER_POSITIONS_QUERY = gql`
  query UserPositions($userAddress: String!, $first: Int!) {
    positions(
      where: { owner: $userAddress, liquidity_gt: "0" }
      first: $first
    ) {
      id
      pool {
        token0 {
          symbol
          name
        }
        token1 {
          symbol
          name
        }
        feeTier
      }
      liquidity
      depositedToken0
      depositedToken1
    }
  }
`;

const UNISWAP_STATS_QUERY = gql`
  query UniswapStats {
    factories(first: 1) {
      poolCount
      txCount
      totalVolumeUSD
      totalValueLockedUSD
    }
  }
`;

// --- API 함수 ---

export async function getUserSwaps(
  address: string,
  first = 10
): Promise<UniswapSwap[]> {
  const data = await uniswapClient.request<{ swaps: UniswapSwap[] }>(
    USER_SWAPS_QUERY,
    { userAddress: address.toLowerCase(), first }
  );
  return data.swaps;
}

export async function getUserPositions(
  address: string,
  first = 10
): Promise<UniswapPosition[]> {
  const data = await uniswapClient.request<{ positions: UniswapPosition[] }>(
    USER_POSITIONS_QUERY,
    { userAddress: address.toLowerCase(), first }
  );
  return data.positions;
}

export async function getUniswapStats(): Promise<UniswapStats> {
  const data = await uniswapClient.request<{ factories: UniswapStats[] }>(
    UNISWAP_STATS_QUERY
  );
  return data.factories[0];
}
