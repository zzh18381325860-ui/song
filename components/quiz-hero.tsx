"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"

interface QuizHeroProps {
  onStart: () => void
}

export function QuizHero({ onStart }: QuizHeroProps) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/music-hero-bg.jpg"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      {/* Decorative: subtle music note shapes via borders */}
      <div className="absolute left-1/2 top-1/2 z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/[0.06]" />
      <div className="absolute left-1/2 top-1/2 z-0 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/[0.08]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Top tagline */}
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px w-10 bg-primary/30" />
          <span className="text-xs tracking-[0.5em] text-muted-foreground">
            {"旧时光歌单测评"}
          </span>
          <div className="h-px w-10 bg-primary/30" />
        </div>

        {/* Title */}
        <h1 className="mb-5 font-serif text-3xl font-bold leading-snug tracking-wider text-foreground md:text-5xl lg:text-6xl">
          <span className="text-balance">{"你和哪首"}</span>
          <br />
          <span className="text-accent">{"古早流行曲"}</span>
          <br />
          <span className="text-balance">{"最匹配？"}</span>
        </h1>

        {/* Subtitle */}
        <p className="mb-14 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
          {"那些年单曲循环的旋律，藏着你不曾说出口的心事"}
          <br />
          {"十五道小题，帮你找到灵魂深处的那首歌"}
        </p>

        {/* Start Button */}
        <button
          onClick={onStart}
          type="button"
          className="group relative overflow-hidden rounded-full border border-primary/40 bg-primary/10 px-14 py-4 text-sm tracking-[0.3em] text-primary transition-all duration-500 hover:border-primary hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/10"
        >
          <span className="relative z-10">{"开始测评"}</span>
          <div className="absolute inset-0 -translate-x-full rounded-full bg-primary/10 transition-transform duration-500 group-hover:translate-x-0" />
        </button>

        {/* Scroll hint */}
        <div className="mt-20 flex animate-float flex-col items-center gap-2">
          <span className="text-[11px] tracking-widest text-muted-foreground/60">
            {"向下滑动"}
          </span>
          <ChevronDown className="h-4 w-4 text-primary/30" />
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-px bg-border/50" />
    </section>
  )
}
