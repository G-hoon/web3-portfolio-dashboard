# Web3 Portfolio Dashboard

블록체인 지갑을 연결하고, 온체인 자산 데이터를 조회하여 포트폴리오를 시각화하는 대시보드입니다.

**Live Demo:** https://web3-portfolio-dashboard-git-main-g-hoons-projects.vercel.app/

## 주요 기능

- **지갑 연결** - MetaMask, WalletConnect, Coinbase Wallet 등 멀티 지갑 지원
- **ETH 잔액 조회** - 네이티브 토큰 잔액 실시간 조회
- **ERC-20 토큰 목록** - 보유 토큰의 이름, 심볼, 로고, 잔액 표시
- **트랜잭션 히스토리** - 최근 송금/수신 내역 및 Etherscan 링크 연동
- **포트폴리오 시각화** - 자산 분포 도넛 차트
- **자산 가치 추이** - ETH 보유량 기반 7일/30일 가치 변동 라인 차트
- **실시간 가격** - CoinGecko API 기반 ETH 및 ERC-20 토큰 USD 가격 + 24h 변동률

## 기술 스택

| 영역           | 기술                 |
| -------------- | -------------------- |
| Framework      | Next.js (App Router) |
| Language       | TypeScript           |
| Web3           | wagmi, viem          |
| Wallet UI      | RainbowKit           |
| 상태관리       | TanStack Query       |
| 차트           | Recharts             |
| 날짜 처리      | dayjs                |
| 스타일         | Tailwind CSS         |
| Blockchain API | Alchemy SDK          |
| 가격 API       | CoinGecko            |

## 시작하기

### 사전 준비

1. [Alchemy](https://dashboard.alchemy.com)에서 API Key 발급
2. [WalletConnect](https://cloud.walletconnect.com)에서 Project ID 발급

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일에 API Key와 Project ID 입력

# 개발 서버 실행
pnpm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 환경 변수

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 메인 페이지
│   ├── providers.tsx       # Web3 Provider 통합
│   └── globals.css         # 글로벌 스타일
├── components/
│   ├── Header.tsx              # 헤더 + 지갑 연결 버튼
│   ├── BalanceCard.tsx         # ETH 잔액 카드
│   ├── TokenList.tsx           # ERC-20 토큰 목록
│   ├── TransactionHistory.tsx  # 트랜잭션 히스토리
│   ├── PortfolioChart.tsx      # 자산 분포 차트
│   ├── PortfolioValueChart.tsx # 자산 가치 추이 차트
│   ├── ErrorBoundary.tsx       # 에러 바운더리
│   └── skeletons.tsx           # Suspense 스켈레톤 UI
├── hooks/
│   ├── useWalletBalance.ts     # ETH 잔액 조회
│   ├── useTokenBalances.ts     # ERC-20 토큰 잔액 조회
│   ├── useTransactions.ts      # 트랜잭션 조회
│   ├── useTokenPrices.ts       # 토큰 가격 조회
│   └── useEthPriceHistory.ts   # ETH 가격 히스토리 조회
└── lib/
    ├── wagmi.ts                # wagmi 설정
    ├── alchemy.ts              # Alchemy SDK 설정
    └── coingecko.ts            # CoinGecko API
```

## 배포

Vercel을 통해 배포할 수 있습니다. 환경 변수를 Vercel 프로젝트 설정에 추가한 뒤 배포하세요.
