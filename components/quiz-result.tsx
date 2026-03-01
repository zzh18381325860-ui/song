"use client"

import { useState, useEffect, useMemo } from "react"
import type { SongResult } from "@/lib/quiz-data"
import { songs } from "@/lib/quiz-data"
import { RotateCcw, Share2, Music } from "lucide-react"

interface QuizResultProps {
  song: SongResult
  onRestart: () => void
}

export function QuizResult({ song, onRestart }: QuizResultProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // 【修改 1/3】: 新增一个 state 来管理分享按钮的文本内容
  const [buttonText, setButtonText] = useState("分享结果")

  useEffect(() => {
    const t1 = setTimeout(() => setIsRevealed(true), 400)
    const t2 = setTimeout(() => setShowDetails(true), 1400)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  // 【修改 2/3】: 升级 handleShare 函数，增加复制后的用户反馈
  const handleShare = async () => {
    const shareData = {
      title: "旧时光歌单测评",
      text: `我在「旧时光歌单测评」中的结果是：${song.artist}《${song.title}》！`,
      url: window.location.href, // 关键：分享当前页面的链接，让朋友可以点进来
    }

    // 尝试使用 Web Share API（原生分享）
    if (navigator.share) {
      try {
        // 分享完整的标题、文本和链接
        await navigator.share(shareData)
      } catch {
        // 用户取消了分享，什么都不用做
      }
    } else {
      // 不支持原生分享，则降级为复制链接到剪贴板
      try {
        // 组合要复制的文本和链接
        const textToCopy = `${shareData.text} 快来测测你和哪首古早流行曲最匹配！ ${shareData.url}`
        await navigator.clipboard.writeText(textToCopy)
        
        // 【关键反馈】: 改变按钮文字提示用户已复制
        setButtonText("链接已复制！")
        
        // 2秒后恢复按钮原来的文字
        setTimeout(() => {
          setButtonText("分享结果")
        }, 2000)
      } catch (err) {
        // 如果复制也失败了，可以给个提示
        alert("自动复制失败，请手动复制链接。")
      }
    }
  }

  // Randomly select 8 other songs to show in the grid at the bottom
  const otherSongs = useMemo(() => {
    const filtered = songs.filter((s) => s.id !== song.id)
    const shuffled = [...filtered].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 8)
  }, [song.id])

  return (
    <section className="relative flex min-h-screen flex-col items-center overflow-hidden px-4 py-16">
      {/* Reveal overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background transition-all duration-1000 ease-out"
        style={{
          opacity: isRevealed ? 0 : 1,
          pointerEvents: isRevealed ? "none" : "auto",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <Music className="h-6 w-6 animate-pulse text-accent" />
          <p className="animate-pulse font-serif text-xl tracking-[0.5em] text-foreground">
            {"旋律已找到"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-3xl pt-8 md:pt-16">
        {/* Header */}
        <div className="mb-10 flex items-center justify-center gap-4 md:mb-14">
          <div className="h-px w-8 bg-accent/30 md:w-16" />
          <span className="text-xs tracking-[0.4em] text-muted-foreground">
            {"你的专属旋律"}
          </span>
          <div className="h-px w-8 bg-accent/30 md:w-16" />
        </div>

        {/* Main result card */}
        <div
          className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm transition-all duration-1000"
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? "translateY(0)" : "translateY(30px)",
          }}
        >
          {/* Top: Song info section */}
          <div className="relative bg-primary/[0.06] px-6 py-10 md:px-12 md:py-14">
            {/* Decorative vinyl-ish circle */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-primary/[0.06] md:h-56 md:w-56" />
            <div className="absolute -right-4 -top-4 h-28 w-28 rounded-full border border-accent/[0.06] md:h-40 md:w-40" />

            <div className="relative z-10">
              <div className="mb-2 text-xs tracking-[0.2em] text-muted-foreground">
                {song.artist}
                <span className="mx-2 text-border">{"/"}</span>
                {song.year}
              </div>
              <h2 className="mb-3 font-serif text-3xl font-bold tracking-wider text-foreground md:text-5xl">
                {"《"}{song.title}{"》"}
              </h2>
              <div className="flex flex-wrap gap-2">
                {song.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-accent/20 bg-accent/[0.06] px-3 py-1 text-[11px] tracking-wider text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-8 md:px-12 md:py-10">
            {/* Lyric Quote */}
            <div
              className="mb-8 transition-all duration-700"
              style={{
                opacity: showDetails ? 1 : 0,
                transform: showDetails ? "translateY(0)" : "translateY(15px)",
              }}
            >
              <div className="rounded-lg bg-muted/50 px-6 py-5">
                <p className="font-serif text-sm italic leading-relaxed text-muted-foreground md:text-base">
                  {`"${song.lyricQuote}"`}
                </p>
                <p className="mt-2 text-right text-[11px] text-muted-foreground/60">
                  {"—— 《"}{song.title}{"》"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div
              className="mb-8 transition-all duration-700 delay-200"
              style={{
                opacity: showDetails ? 1 : 0,
                transform: showDetails ? "translateY(0)" : "translateY(15px)",
              }}
            >
              <p className="text-sm leading-[1.9] text-foreground/80 md:text-base">
                {song.description}
              </p>
            </div>

            {/* Mood */}
            <div
              className="mb-8 transition-all duration-700 delay-300"
              style={{
                opacity: showDetails ? 1 : 0,
                transform: showDetails ? "translateY(0)" : "translateY(15px)",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-[11px] tracking-[0.2em] text-muted-foreground/60">
                  {"情绪色彩"}
                </span>
                <div className="h-px flex-1 bg-border/50" />
                <span className="text-sm text-accent">
                  {song.mood}
                </span>
              </div>
            </div>

            {/* Album info */}
            <div
              className="mb-10 transition-all duration-700 delay-[400ms]"
              style={{
                opacity: showDetails ? 1 : 0,
                transform: showDetails ? "translateY(0)" : "translateY(15px)",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-[11px] tracking-[0.2em] text-muted-foreground/60">
                  {"收录专辑"}
                </span>
                <div className="h-px flex-1 bg-border/50" />
                <span className="text-sm text-foreground/60">
                  {song.album}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div
              className="flex gap-3 transition-all duration-700 delay-500"
              style={{
                opacity: showDetails ? 1 : 0,
                transform: showDetails ? "translateY(0)" : "translateY(15px)",
              }}
            >
              {/* 【修改 3/3】: 更新分享按钮的文本和禁用状态 */}
              <button
                onClick={handleShare}
                type="button"
                className="flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-6 py-3 text-xs tracking-[0.15em] text-accent transition-all duration-300 hover:bg-accent/20 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
                disabled={buttonText !== "分享结果"} // 当文本不是默认值时，禁用按钮
              >
                <Share2 className="h-3.5 w-3.5" />
                {buttonText} {/* 显示动态的按钮文本 */}
              </button>
              <button
                onClick={onRestart}
                type="button"
                className="flex items-center gap-2 rounded-full border border-border/40 px-6 py-3 text-xs tracking-[0.15em] text-muted-foreground transition-all duration-300 hover:border-accent/30 hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {"重新测评"}
              </button>
            </div>
          </div>
        </div>

        {/* Other songs preview */}
        <div
          className="mt-16 transition-all duration-700 delay-700"
          style={{
            opacity: showDetails ? 1 : 0,
            transform: showDetails ? "translateY(0)" : "translateY(15px)",
          }}
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-border/50" />
            <span className="text-[11px] tracking-[0.3em] text-muted-foreground/60">
              {"更多旋律等你探索"}
            </span>
            <div className="h-px w-8 bg-border/50" />
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            {otherSongs.map((s) => (
              <div
                key={s.id}
                className="group rounded-lg border border-border/30 bg-card/50 p-4 transition-all duration-300 hover:border-accent/20 hover:bg-card"
              >
                <p className="mb-1 font-serif text-sm text-foreground">
                  {"《"}{s.title}{"》"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {s.artist}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 pb-8 text-center">
            <p className="text-[11px] leading-relaxed text-muted-foreground/40">
              {"旧时光歌单 — 共收录五十首经典华语流行曲"}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
