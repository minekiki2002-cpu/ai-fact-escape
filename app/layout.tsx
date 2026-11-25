import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI 怪怪校園：消失的真相｜校園AI查證遊戲',
  description: '走進班群、圖書館與校園相簿，搜集證物、辨識AI幻覺與偏見，親手修復錯誤資訊。',
  metadataBase: new URL('https://minekiki2002-cpu.github.io/ai-fact-escape/'),
  openGraph: {
    title: 'AI 怪怪校園：消失的真相',
    description: '探索校園、搜集證物，辨識AI幻覺與偏見。',
    images: ['og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 怪怪校園：消失的真相',
    description: '探索校園、搜集證物，辨識AI幻覺與偏見。',
    images: ['og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
