import React from "react"
import type { Metadata, Viewport } from "next"
import { Noto_Serif_SC, LXGW_WenKai_TC } from "next/font/google"

import "./globals.css"

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-serif-sc",
})

const lxgwWenKai = LXGW_WenKai_TC({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-wenkai",
})

export const metadata: Metadata = {
  title: "旧时光歌单 — 你和哪首古早流行曲最匹配?",
  description:
    "穿越时光的旋律测评。周杰伦、王菲、孙燕姿、张韶涵、五月天、陈奕迅......五十首经典华语流行曲，哪一首最懂你？",
}

export const viewport: Viewport = {
  themeColor: "#f5f0ea",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${notoSerifSC.variable} ${lxgwWenKai.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
