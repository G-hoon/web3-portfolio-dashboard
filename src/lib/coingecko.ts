const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

export interface CoinPrice {
  usd: number;
  usd_24h_change: number;
}

export interface CoinMarketData {
  id: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

/**
 * ETH 및 토큰 가격을 CoinGecko에서 조회
 * @param contractAddresses ERC-20 토큰 컨트랙트 주소 배열
 */
export async function getTokenPrices(
  contractAddresses: string[]
): Promise<Record<string, CoinPrice>> {
  const result: Record<string, CoinPrice> = {};

  // ETH 가격 조회
  const ethRes = await fetch(
    `${COINGECKO_BASE_URL}/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true`
  );

  if (ethRes.ok) {
    const ethData = await ethRes.json();
    if (ethData.ethereum) {
      result["eth"] = {
        usd: ethData.ethereum.usd,
        usd_24h_change: ethData.ethereum.usd_24h_change,
      };
    }
  }

  // ERC-20 토큰 가격 조회 (컨트랙트 주소 기반)
  if (contractAddresses.length > 0) {
    const addresses = contractAddresses.map((a) => a.toLowerCase()).join(",");
    const tokenRes = await fetch(
      `${COINGECKO_BASE_URL}/simple/token_price/ethereum?contract_addresses=${addresses}&vs_currencies=usd&include_24hr_change=true`
    );

    if (tokenRes.ok) {
      const tokenData = await tokenRes.json();
      for (const [address, priceData] of Object.entries(tokenData)) {
        const data = priceData as { usd: number; usd_24h_change: number };
        result[address.toLowerCase()] = {
          usd: data.usd,
          usd_24h_change: data.usd_24h_change,
        };
      }
    }
  }

  return result;
}

/**
 * ETH 가격 히스토리 조회 (차트용)
 * @param days 조회할 일수 (7 또는 30)
 */
export async function getEthPriceHistory(
  days: number = 7
): Promise<{ timestamp: number; price: number }[]> {
  const res = await fetch(
    `${COINGECKO_BASE_URL}/coins/ethereum/market_chart?vs_currency=usd&days=${days}`
  );

  if (!res.ok) return [];

  const data = await res.json();
  return (data.prices as [number, number][]).map(([timestamp, price]) => ({
    timestamp,
    price,
  }));
}
