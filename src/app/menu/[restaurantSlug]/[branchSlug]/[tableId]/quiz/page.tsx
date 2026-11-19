'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { CustomerHeader } from '@/components/CustomerHeader';
import { INITIAL_QUIZ_QUESTIONS } from '@/lib/seed-data';
import {
  Sparkles,
  Timer,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  Flame,
  RotateCcw,
} from 'lucide-react';

export default function SpiceQuizPage({
  params,
}: {
  params: { restaurantSlug: string; branchSlug: string; tableId: string };
}) {
  const { restaurantSlug, branchSlug, tableId } = params;
  const tableNumber = tableId.toUpperCase();
  const basePath = `/menu/${restaurantSlug}/${branchSlug}/${tableNumber}`;

  const questions = INITIAL_QUIZ_QUESTIONS;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [quizFinished, setQuizFinished] = useState(false);
  const [phoneForRewards, setPhoneForRewards] = useState('');
  const [claimedRewards, setClaimedRewards] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (quizFinished || isAnswered) return;

    if (timeLeft <= 0) {
      handleAnswer(-1); // Time expired
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizFinished, isAnswered]);

  const currentQ = questions[currentIdx];

  const handleAnswer = (optionIdx: number) => {
    if (isAnswered) return;

    setSelectedAnswer(optionIdx);
    setIsAnswered(true);

    if (optionIdx === currentQ.correctIndex) {
      setScore((s) => s + 10);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      setQuizFinished(true);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  };

  const handleClaimPoints = async () => {
    if (!phoneForRewards.trim()) return;
    try {
      await fetch('/api/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneForRewards.trim(),
          points: score,
        }),
      });
      setClaimedRewards(true);
    } catch (e) {
      console.error(e);
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setTimeLeft(15);
    setQuizFinished(false);
    setClaimedRewards(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* Customer Header */}
      <CustomerHeader
        restaurantName="Zaika Restaurant & Bar"
        tableNumber={tableNumber}
        restaurantSlug={restaurantSlug}
        branchSlug={branchSlug}
      />

      <div className="max-w-xl mx-auto px-4 pt-4">
        {quizFinished ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-200 shadow-xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8" />
            </div>
            <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Quiz Completed!
            </span>
            <h2 className="text-2xl font-black text-[#25364A] mt-2">
              You Scored {score} / {questions.length * 10} Points!
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              You are an authentic Indian food connoisseur! Redeem your points on this meal or future visits.
            </p>

            {/* Claim Form */}
            {claimedRewards ? (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold">
                🎉 {score} Loyalty Points credited to {phoneForRewards}!
              </div>
            ) : (
              <div className="mt-6 bg-orange-50/60 border border-orange-200 p-4 rounded-2xl">
                <label className="text-xs font-bold text-[#25364A] block mb-2">
                  Claim Reward Points to Mobile Wallet:
                </label>
                <div className="flex space-x-2">
                  <input
                    type="tel"
                    placeholder="Enter Phone (e.g. 9876543210)"
                    value={phoneForRewards}
                    onChange={(e) => setPhoneForRewards(e.target.value)}
                    className="flex-1 text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
                  />
                  <button
                    onClick={handleClaimPoints}
                    className="px-4 py-2.5 bg-[#E76F35] text-white text-xs font-bold rounded-xl shadow hover:bg-[#D3551B] transition"
                  >
                    Claim Points
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-center space-x-3">
              <button
                onClick={restartQuiz}
                className="py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play Again</span>
              </button>
              <Link
                href={basePath}
                className="py-2.5 px-4 rounded-xl bg-[#25364A] text-white text-xs font-bold hover:bg-slate-800 flex items-center space-x-1"
              >
                <span>Back to Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-[#25364A]">
                  Zaika Spice Trivia &bull; Question {currentIdx + 1} of {questions.length}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 bg-orange-50 text-[#E76F35] px-2.5 py-1 rounded-full text-xs font-black">
                <Timer className="w-3.5 h-3.5" />
                <span>{timeLeft}s</span>
              </div>
            </div>

            {/* Score Pill */}
            <div className="flex items-center justify-between text-xs text-gray-400 mb-4 pb-2 border-b border-gray-100">
              <span>Category: {currentQ.category}</span>
              <span className="font-bold text-[#E76F35]">Current Score: {score} pts</span>
            </div>

            {/* Question */}
            <h3 className="text-base font-bold text-[#25364A] mb-5 leading-snug">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-2.5 mb-5">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let btnStyle = 'border-gray-200 text-gray-700 hover:bg-gray-50';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'border-red-500 bg-red-50 text-red-800 font-bold';
                  } else {
                    btnStyle = 'border-gray-100 opacity-50 text-gray-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Fact Explanation */}
            {isAnswered && (
              <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-xl mb-4 text-xs text-amber-900 leading-relaxed animate-in fade-in">
                <strong className="block text-amber-950 mb-0.5">💡 Chef&apos;s Culinary Fact:</strong>
                {currentQ.explanation}
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="w-full py-3 bg-[#E76F35] hover:bg-[#D3551B] text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center space-x-1"
              >
                <span>{currentIdx < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
