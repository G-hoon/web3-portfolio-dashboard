# Web3 Portfolio Dashboard

블록체인 지갑을 연결하고, 온체인 자산 데이터를 조회하여 포트폴리오를 시각화하는 대시보드입니다.

**Live Demo:** https://web3-portfolio-dashboard-git-main-g-hoons-projects.vercel.app/

## 주요 기능

- **지갑 연결** - MetaMask, WalletConnect, Coinbase Wallet 등 멀티 지갑 지원
- **ETH 잔액 조회** - 네이티브 토큰 잔액 실시간 조회 + USD 가치 표시
- **ERC-20 토큰 목록** - 보유 토큰의 이름, 심볼, 로고, 잔액, USD 가치, 24h 변동률
- **트랜잭션 히스토리** - 최근 송금/수신 내역 및 Etherscan 링크 연동
- **포트폴리오 시각화** - 자산 분포 도넛 차트
- **자산 가치 추이** - ETH 보유량 기반 7일/30일 가치 변동 라인 차트
- **RWA 토큰 대시보드** - 실물자산 토큰(USDY, OUSG 등) 보유 현황 및 시장 개요, 스마트 컨트랙트 multicall 조회
- **WebSocket 실시간 시세** - Binance WebSocket으로 ETH/USDT 실시간 가격 피드, 가격 변동 플래시 효과
- **온체인 이벤트 알림** - ERC-20 Transfer 이벤트 실시간 구독, 토스트 알림, 이벤트 로그
- **DeFi 활동 (Uniswap V3)** - The Graph GraphQL로 Uniswap 글로벌 통계, 스왑 히스토리, 유동성 포지션 조회
- **AI 포트폴리오 분석** - Claude API 기반 자산 구성 분석, 리스크 평가, 개선 제안 (스트리밍 응답)

## 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Web3 | wagmi, viem |
| Wallet UI | RainbowKit |
| 상태관리 | TanStack Query |
| 차트 | Recharts |
| 날짜 처리 | dayjs |
| 스타일 | Tailwind CSS |
| Blockchain API | Alchemy SDK |
| 가격 API | CoinGecko (REST), Binance (WebSocket) |
| GraphQL | graphql-request + The Graph |
| AI | Vercel AI SDK + Anthropic Claude API |
| 토스트 알림 | sonner |
| 마크다운 렌더링 | react-markdown + remark-gfm |

## API 통신 형태

| 형태 | 사용처 |
|------|--------|
| REST API | CoinGecko 가격 조회, Alchemy 토큰/트랜잭션 조회 |
| WebSocket | Binance 실시간 ETH/USDT 시세 |
| GraphQL | The Graph - Uniswap V3 서브그래프 쿼리 |
| Streaming | Anthropic Claude API 스트리밍 응답 |
| RPC (multicall) | viem multicall로 RWA 토큰 컨트랙트 일괄 조회 |
| Event Subscription | viem watchEvent로 ERC-20 Transfer 이벤트 구독 |

## 시작하기

### 사전 준비

1. [Alchemy](https://dashboard.alchemy.com)에서 API Key 발급
2. [WalletConnect](https://cloud.walletconnect.com)에서 Project ID 발급
3. [The Graph](https://thegraph.com/studio/)에서 API Key 발급 (무료, 월 100K 쿼리)
4. [Anthropic](https://console.anthropic.com)에서 API Key 발급

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일에 API Key 입력

# 개발 서버 실행
pnpm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 환경 변수

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_THEGRAPH_API_KEY=your_thegraph_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

> `ANTHROPIC_API_KEY`는 `NEXT_PUBLIC_` 접두사 없이 서버 전용으로 설정됩니다 (클라이언트 노출 방지).

## 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # AI 분석 API Route (스트리밍)
│   ├── layout.tsx                # 루트 레이아웃 + Toaster
│   ├── page.tsx                  # 메인 페이지
│   ├── providers.tsx             # Web3 Provider 통합
│   └── globals.css               # 글로벌 스타일 + 마크다운 스타일
├── components/
│   ├── Header.tsx                # 헤더 + 지갑 연결 버튼
│   ├── BalanceCard.tsx           # ETH 잔액 카드 (실시간 가격 연동)
│   ├── RealtimeTicker.tsx        # ETH/USDT 실시간 시세 (WebSocket)
│   ├── PortfolioChart.tsx        # 자산 분포 도넛 차트
│   ├── PortfolioValueChart.tsx   # 자산 가치 추이 라인 차트
│   ├── RWADashboard.tsx          # RWA 토큰 대시보드
│   ├── TokenList.tsx             # ERC-20 토큰 목록
│   ├── DeFiActivity.tsx          # Uniswap V3 DeFi 활동
│   ├── TransactionHistory.tsx    # 트랜잭션 히스토리
│   ├── EventNotification.tsx     # 온체인 이벤트 토스트 알림
│   ├── EventLog.tsx              # 온체인 이벤트 로그
│   ├── AIAnalysis.tsx            # AI 포트폴리오 분석
│   ├── ErrorBoundary.tsx         # 에러 바운더리
│   └── skeletons.tsx             # Suspense 스켈레톤 UI
├── hooks/
│   ├── useWalletBalance.ts       # ETH 잔액 조회
│   ├── useTokenBalances.ts       # ERC-20 토큰 잔액 조회
│   ├── useTokenPrices.ts         # 토큰 가격 조회 (CoinGecko)
│   ├── useEthPriceHistory.ts     # ETH 가격 히스토리
│   ├── useRealtimePrice.ts       # 실시간 가격 (Binance WebSocket)
│   ├── useRWATokens.ts           # RWA 토큰 온체인 조회 (multicall)
│   ├── useUniswapActivity.ts     # Uniswap 활동 조회 (GraphQL)
│   ├── useTransactions.ts        # 트랜잭션 조회
│   └── useTransferEvents.ts      # ERC-20 Transfer 이벤트 구독
└── lib/
    ├── wagmi.ts                  # wagmi + RainbowKit 설정
    ├── alchemy.ts                # Alchemy SDK 설정
    ├── coingecko.ts              # CoinGecko API
    ├── rwa-tokens.ts             # RWA 토큰 레지스트리 + ABI
    └── graphql.ts                # The Graph GraphQL 클라이언트
```

## 배포

Vercel을 통해 배포할 수 있습니다. 환경 변수를 Vercel 프로젝트 설정에 추가한 뒤 배포하세요.

```bash
# 빌드 확인
pnpm build

# Vercel 배포
vercel --prod
```
