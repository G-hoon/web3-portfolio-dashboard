# Master Plan: 한화투자증권 FE 포지션 어필용 추가 개발

## 실행 순서 및 의존성

```
Plan 2 (RWA 대시보드) ──────────── 독립
Plan 3 (WebSocket 실시간 가격) ─── 독립
Plan 4 (온체인 이벤트 알림) ────── 독립
Plan 5 (GraphQL / The Graph) ──── 독립
Plan 1 (AI 포트폴리오 분석) ────── Plan 2~5 완료 후가 이상적 (분석 데이터 풍부)
```

> 모든 플랜은 독립 실행 가능. 단, Plan 1은 다른 기능들이 추가된 후 분석 데이터가 풍부해지므로 마지막에 하는 것을 권장.

---

## 권장 실행 순서

| 순서 | 플랜 | 예상 소요 | 핵심 어필 |
|------|------|-----------|-----------|
| 1st | **Plan 2: RWA 토큰 대시보드** | 중 | 회사 핵심 사업 직결, 스마트 컨트랙트 읽기 |
| 2nd | **Plan 3: WebSocket 실시간 가격** | 소 | WebSocket 경험, 증권사 실시간 시세 UX |
| 3rd | **Plan 4: 온체인 이벤트 알림** | 소 | 담당업무 "온체인 이벤트 바인딩" |
| 4th | **Plan 5: GraphQL (The Graph)** | 중 | GraphQL 경험, DeFi 생태계 이해 |
| 5th | **Plan 1: AI 포트폴리오 분석** | 중 | AI 연동, 스트리밍 UX, 실용적 기능 |

---

## 필요한 추가 의존성 (전체)

```bash
# Plan 1: AI
pnpm add ai @ai-sdk/anthropic

# Plan 4: 토스트 알림
pnpm add sonner

# Plan 5: GraphQL
pnpm add graphql-request graphql
```

## 필요한 추가 환경 변수

```env
# Plan 1
ANTHROPIC_API_KEY=your_anthropic_api_key

# Plan 5 (옵션, 없어도 공개 엔드포인트 사용 가능)
NEXT_PUBLIC_THEGRAPH_API_KEY=your_thegraph_api_key
```

## 필요한 추가 API Key 발급

| API | 발급처 | 비용 |
|-----|--------|------|
| Anthropic (Claude) | https://console.anthropic.com | 유료 (소액) |
| The Graph | https://thegraph.com/studio/ | 무료 (월 100K 쿼리) |

---

## 최종 page.tsx 레이아웃 (모든 플랜 완료 후)

```
┌─ Header ────────────────────────────────────┐
│ Web3 Portfolio Dashboard    [지갑 연결 버튼] │
└─────────────────────────────────────────────┘

┌─ Grid 2열 ──────────────────────────────────┐
│ BalanceCard (실시간 가격)  │ PortfolioChart  │
│ + RealtimeTicker (Plan 3)  │                 │
└─────────────────────────────────────────────┘

┌─ PortfolioValueChart ───────────────────────┐
│ 총 자산 가치 추이 (7일/30일)                 │
└─────────────────────────────────────────────┘

┌─ RWADashboard (Plan 2) ────────────────────┐
│ RWA 토큰 - 보유 현황 + 시장 개요            │
└─────────────────────────────────────────────┘

┌─ TokenList ─────────────────────────────────┐
│ ERC-20 토큰 목록                             │
└─────────────────────────────────────────────┘

┌─ DeFiActivity (Plan 5) ────────────────────┐
│ Uniswap V3 - 통계, 포지션, 스왑 히스토리     │
└─────────────────────────────────────────────┘

┌─ TransactionHistory ────────────────────────┐
│ 트랜잭션 히스토리                            │
└─────────────────────────────────────────────┘

┌─ EventLog (Plan 4) ────────────────────────┐
│ 온체인 이벤트 로그 (실시간)                  │
└─────────────────────────────────────────────┘

┌─ AIAnalysis (Plan 1) ──────────────────────┐
│ AI 포트폴리오 분석     [분석하기]            │
└─────────────────────────────────────────────┘

+ EventNotification (Plan 4) ← headless, 토스트만
+ Toaster (Plan 4) ← layout.tsx
```

---

## 진행 상태 추적

각 플랜을 시작할 때 아래 체크리스트 업데이트:

- [x] Plan 2: RWA 토큰 대시보드
- [x] Plan 3: WebSocket 실시간 가격
- [x] Plan 4: 온체인 이벤트 알림
- [x] Plan 5: GraphQL (The Graph)
- [x] Plan 1: AI 포트폴리오 분석
- [x] 최종 README 업데이트
- [x] 최종 빌드 검증
- [x] Vercel 재배포

---

## 실행 방법

Claude에게 다음과 같이 요청:

```
docs/plan-2-rwa-token-dashboard.md 에 있는 플랜을 실행해줘.
```

또는 한 번에 여러 개:

```
docs/plan-master.md 의 순서대로 Plan 2부터 실행해줘.
```
