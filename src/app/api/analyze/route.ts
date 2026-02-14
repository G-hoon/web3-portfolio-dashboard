import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export async function POST(req: Request) {
  const { ethBalance, ethUsdValue, tokens, recentTransactions, totalUsdValue } =
    await req.json();

  const userMessage = `
현재 포트폴리오 데이터:

- ETH 잔액: ${ethBalance}
- ETH USD 가치: ${ethUsdValue}
- 총 자산 가치: ${totalUsdValue}

보유 토큰:
${
  tokens?.length > 0
    ? tokens
        .map(
          (t: { name: string; symbol: string; balance: string; usdValue: string | null; change24h: number | null }) =>
            `  - ${t.name} (${t.symbol}): ${t.balance}${t.usdValue ? ` ≈ ${t.usdValue}` : ""}${t.change24h != null ? ` (24h: ${t.change24h > 0 ? "+" : ""}${t.change24h.toFixed(2)}%)` : ""}`
        )
        .join("\n")
    : "  없음"
}

최근 트랜잭션:
${
  recentTransactions?.length > 0
    ? recentTransactions
        .map(
          (tx: { direction: string; asset: string; value: string }) =>
            `  - ${tx.direction === "sent" ? "발신" : "수신"}: ${tx.value} ${tx.asset}`
        )
        .join("\n")
    : "  없음"
}

위 데이터를 기반으로 포트폴리오를 분석해주세요.
`.trim();

  const result = streamText({
    model: anthropic("claude-sonnet-4-5-20250929"),
    system: `당신은 블록체인 포트폴리오 분석 전문가입니다.
사용자의 온체인 자산 데이터를 분석하여 다음 항목을 한국어로 제공하세요:

1. 자산 구성 분석: 현재 포트폴리오의 자산 배분 상태
2. 리스크 평가: 집중 투자 리스크, 변동성 노출도
3. 개선 제안: 분산 투자 방향, 리밸런싱 제안
4. 활동 분석: 최근 트랜잭션 패턴 요약

간결하고 실용적인 인사이트를 제공하세요. 마크다운 형식으로 작성합니다.
각 섹션은 적절한 이모지와 함께 제목을 달아주세요.`,
    prompt: userMessage,
  });

  return result.toTextStreamResponse();
}
