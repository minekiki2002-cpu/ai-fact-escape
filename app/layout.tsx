import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '失控的完美答案｜AI 幻覺與偏見密室',
  description: '用 FACT 四步驟破解 AI 幻覺、偏見與假客觀的學生媒體識讀遊戲。',
  metadataBase: new URL('https://minekiki2002-cpu.github.io/ai-fact-escape/'),
  openGraph: {
    title: '失控的完美答案｜AI 幻覺與偏見密室',
    description: '用 FACT 四步驟破解 AI 幻覺、偏見與假客觀。',
    images: ['og.webp'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '失控的完美答案｜AI 幻覺與偏見密室',
    description: '用 FACT 四步驟破解 AI 幻覺、偏見與假客觀。',
    images: ['og.webp'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
