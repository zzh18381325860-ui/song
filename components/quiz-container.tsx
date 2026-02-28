"use client"

import { useState, useCallback } from "react"
import { QuizHero } from "./quiz-hero"
import { QuizQuestion } from "./quiz-question"
import { QuizResult } from "./quiz-result"
import { questions, songs, calculateResult } from "@/lib/quiz-data"

type QuizState = "hero" | "quiz" | "result"

export function QuizContainer() {
  const [state, setState] = useState<QuizState>("hero")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [resultId, setResultId] = useState<string | null>(null)

  const handleStart = useCallback(() => {
    setState("quiz")
    setCurrentQuestion(0)
    setAnswers({})
    setResultId(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      const question = questions[currentQuestion]
      const newAnswers = { ...answers, [question.id]: optionIndex }
      setAnswers(newAnswers)

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        const songId = calculateResult(newAnswers)
        setResultId(songId)
        setState("result")
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    },
    [currentQuestion, answers]
  )

  const handleRestart = useCallback(() => {
    setState("hero")
    setCurrentQuestion(0)
    setAnswers({})
    setResultId(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const resultSong = resultId
    ? songs.find((s) => s.id === resultId) ?? null
    : null

  return (
    <main className="min-h-screen bg-background">
      {state === "hero" && <QuizHero onStart={handleStart} />}

      {state === "quiz" && (
        <QuizQuestion
          key={questions[currentQuestion].id}
          question={questions[currentQuestion]}
          currentIndex={currentQuestion}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
        />
      )}

      {state === "result" && resultSong && (
        <QuizResult song={resultSong} onRestart={handleRestart} />
      )}
    </main>
  )
}
