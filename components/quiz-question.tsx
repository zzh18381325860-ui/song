"use client"

import { useState } from "react"
import type { QuizQuestion as QuizQuestionType } from "@/lib/quiz-data"
import { cn } from "@/lib/utils"

interface QuizQuestionProps {
  question: QuizQuestionType
  currentIndex: number
  totalQuestions: number
  onAnswer: (optionIndex: number) => void
}

export function QuizQuestion({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
}: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleSelect = (index: number) => {
    if (isTransitioning) return
    setSelectedOption(index)
    setIsTransitioning(true)

    setTimeout(() => {
      onAnswer(index)
      setSelectedOption(null)
      setIsTransitioning(false)
    }, 600)
  }

  const progress = ((currentIndex + 1) / totalQuestions) * 100
  const labels = ["壹", "贰", "叁", "肆"]

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-14">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] tracking-[0.3em] text-muted-foreground/60">
              {"问题"}
            </span>
            <span className="text-sm tabular-nums text-muted-foreground">
              {currentIndex + 1}
              <span className="mx-1 text-border">{"/"}</span>
              {totalQuestions}
            </span>
          </div>
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-border/50">
            <div
              className="h-full rounded-full bg-accent/60 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h2
          key={question.id}
          className="mb-14 animate-fade-in text-center font-serif text-xl font-semibold leading-relaxed text-foreground md:text-2xl"
        >
          {question.question}
        </h2>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {question.options.map((option, index) => (
            <button
              key={`${question.id}-${index}`}
              type="button"
              onClick={() => handleSelect(index)}
              disabled={isTransitioning}
              className={cn(
                "group relative w-full overflow-hidden rounded-lg border border-border/40 bg-card px-6 py-5 text-left text-sm transition-all duration-400 md:px-8 md:py-6 md:text-base",
                "hover:border-accent/40 hover:bg-accent/[0.04] hover:shadow-sm",
                selectedOption === index &&
                  "border-accent/60 bg-accent/[0.08] shadow-sm",
                "animate-fade-in",
                isTransitioning && selectedOption !== index && "opacity-30"
              )}
              style={{
                animationDelay: `${index * 80}ms`,
                animationFillMode: "both",
              }}
            >
              {/* Option label */}
              <span className="mr-4 inline-block text-xs text-accent/40">
                {labels[index]}
              </span>

              {/* Option text */}
              <span className="text-secondary-foreground transition-colors duration-300 group-hover:text-foreground">
                {option.text}
              </span>

              {/* Bottom line on hover */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-accent/40 transition-all duration-500 group-hover:w-full" />

              {/* Selected dot */}
              {selectedOption === index && (
                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
