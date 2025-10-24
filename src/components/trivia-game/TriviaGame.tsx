import React, { useState, useRef, useEffect } from "react";
import { useToast } from "../toast/useToast";
import { pickRandomFromArray } from "@/utils";

type TriviaQuestion = {
    question: string;
    incorrect: string[];
    correct: string;
};

type TriviaSet = {
    title: string;
    description: string;
    questions: TriviaQuestion[];
};

const correctTaunts = [
    "Nice one!",
    "You're on fire!",
    "Correct!",
    "Well done!",
    "Close enough to count",
    "Wow nice",
    "Keep it up!",
    "savage",
    "Legendary!",
    "Surprisingly correct"
];
const incorrectTaunts = [
    "Oops, not quite.",
    "Better luck next time!",
    "Incorrect, try again!",
    "Don't give up!",
    "Almost had it!",
    "Ouch...",
    "Close, but no cigar.",
    "Bruh.",
    "And you call yourself a trivia master?",
    "another one bites the dust.",
    "That's gotta sting a little.",
    "crazy work."
];

export function TriviaGame({ data }: { data: TriviaSet }) {
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [selected, setSelected] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const confettiActiveRef = useRef(false);

    const q = (currentIndex < 0 || currentIndex >= data.questions.length) ?
        data.questions[0] : data.questions[currentIndex];
    if (!q) return null;

    const choices = React.useMemo(() => {
        const arr = [q.correct, ...q.incorrect];
        return arr.sort(() => Math.random() - 0.5);
    }, [q]);

    function submitChoice(choice: string) {
        if (showAnswer) return;
        setSelected(choice);
        const correct = choice === q.correct;
        if (correct) setScore((s) => s + 1);
        // console.log(`Selected: ${choice}, Correct: ${q.correct}, Correct: ${correct}, Current Score: ${score}`);
        setShowAnswer(true);
    }

    const { show } = useToast();

    function next() {
        setSelected(null);
        setShowAnswer(false);
        // if there are more questions, advance
        if (currentIndex < data.questions.length - 1) {
            setCurrentIndex((i) => i + 1);
        } else {
            // advance past the last question to show final screen
            setCurrentIndex((i) => i + 1);
            // show toast about finished score
            show({ title: "Quiz finished", description: `Score: ${score} / ${data.questions.length}` });
        }
    }
    function restart() {
        setCurrentIndex(-1);
        setSelected(null);
        setShowAnswer(false);
        setScore(0);
    }

    useEffect(() => {
        function onFullScreenChange() {
            setIsFullscreen(document.fullscreenElement === containerRef.current);
        }
        document.addEventListener("fullscreenchange", onFullScreenChange);
        return () => document.removeEventListener("fullscreenchange", onFullScreenChange);
    }, []);

    async function toggleFullscreen() {
        try {
            if (!containerRef.current) return;
            if (!document.fullscreenElement) {
                await containerRef.current.requestFullscreen();
                setIsFullscreen(true);
            } else {
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        } catch (e) {
            // ignore errors silently
            // optionally show a toast if desired
        }
    }

    // --- Confetti implementation (lightweight, no external deps) ---
    function createAndStartConfetti() {
        console.log("Starting confetti!");
        if (!containerRef.current) return;
        const canvas = confettiCanvasRef.current;
        if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

        const rect = containerRef.current.getBoundingClientRect();
        canvas.width = rect.width * devicePixelRatio;
        canvas.height = rect.height * devicePixelRatio;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.scale(devicePixelRatio, devicePixelRatio);

        const particles: Array<any> = [];
        const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#9B6BFF", "#FF9F1C"];

        function spawnParticle(x: number, y: number) {
            particles.push({
                x,
                y,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rot: Math.random() * Math.PI * 2,
                velX: (Math.random() - 0.5) * 6,
                velY: Math.random() * -10 - 2,
                drag: 0.99
            });
        }

        // burst many particles from top center area
        const cx = rect.width / 2;
        for (let i = 0; i < 120; i++) {
            spawnParticle(cx + (Math.random() - 0.5) * rect.width * 0.5, rect.height * 0.35 + (Math.random() - 0.5) * 20);
        }

        let raf = 0;
        let lifetime = 0;
        confettiActiveRef.current = true;

        function step() {
            lifetime += 1;
            ctx.clearRect(0, 0, rect.width, rect.height);
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.velY += 0.35; // gravity
                p.x += p.velX;
                p.y += p.velY;
                p.velX *= p.drag;
                p.rot += 0.2;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                ctx.restore();

                // remove off-screen or old particles
                if (p.y > rect.height + 50 || lifetime > 300) {
                    particles.splice(i, 1);
                }
            }

            if (particles.length > 0 && confettiActiveRef.current) {
                raf = requestAnimationFrame(step);
            } else {
                confettiActiveRef.current = false;
                ctx.clearRect(0, 0, rect.width, rect.height);
            }
        }

        // start animation
        if (!raf) raf = requestAnimationFrame(step);

        // safety stop after 6s
        setTimeout(() => {
            confettiActiveRef.current = false;
        }, 6000);
    }

    const containerClass = `relative bg-neutral-100 dark:bg-neutral-900 rounded-md border border-neutral-200 dark:border-neutral-800 ${isFullscreen ? 'p-8 h-screen flex flex-col justify-center' : 'p-4'}`;

    const contentClass = `${isFullscreen ? 'w-full max-w-3xl mx-auto text-lg md:text-xl' : ''}`;

    return (
        <div ref={containerRef} className={containerClass}>
            {/* confetti canvas overlays the container */}
            <canvas
                ref={confettiCanvasRef}
                style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50 }}
            />
            {/* Fullscreen toggle button top-right */}
            <button
                onClick={toggleFullscreen}
                aria-pressed={isFullscreen}
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                className="absolute top-2 right-2 p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-sm opacity-40 hover:opacity-100"
            >
                {isFullscreen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                    </svg>

                )}
            </button>
            <div className={contentClass}>
            {currentIndex == -1 ? (
                <div>
                    <h2 className="font-semibold mb-3 text-center">
                        {data.title ? data.title : "Untitled Trivia Set"}
                    </h2>
                    <div className="mb-2 text-sm text-muted-foreground text-center">
                        {data.description ? data.description : "Ready to play?"}
                    </div>
                    <button
                        onClick={next}
                        className="px-3 py-1 border bg-[#F48120]/10 text-[#F48120] text-primary-foreground rounded-md text-center block mx-auto mt-4"
                    >
                        Start
                    </button>
                </div>
            ) : currentIndex < data.questions.length ? (
                <div>
                    <h4 className="font-semibold mb-3 text-center">{q.question}</h4>

                    <div className="grid gap-2">
                        {choices.map((c) => {
                            const isSelected = selected === c;
                            const isCorrect = c === q.correct;
                            const className = `p-3 rounded-md border ${isSelected ? "ring-2 ring-primary" : "border-neutral-200 dark:border-neutral-700"} ${showAnswer && isCorrect ? "bg-green-100 dark:bg-green-900" : isSelected ? "bg-red-100 dark:bg-red-900" : "bg-white dark:bg-neutral-800"}`;
                            return (
                                <button
                                    key={c}
                                    onClick={() => submitChoice(c)}
                                    disabled={showAnswer}
                                    className={className}
                                >
                                    <div className="text-left">{c}</div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">
                                {
                                    showAnswer ? 
                                        selected === q.correct
                                        ? `${pickRandomFromArray(correctTaunts)}`
                                        : `${pickRandomFromArray(incorrectTaunts)} Correct answer: ${q.correct}`
                                    : `Question ${currentIndex + 1} / ${data.questions.length}, Score: ${Math.round(score * 100 / Math.max(1, currentIndex + (selected ? 1 : 0)))}%`
                                }
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {showAnswer ? (
                                <button
                                    onClick={next}
                                    className="border px-3 py-1 bg-primary rounded-md text-sm text-primary-foreground "
                                >
                                    {currentIndex < data.questions.length - 1 ? "Next" : "Finish"}
                                </button>
                            ) : (
                                <div className="border px-3 py-1 rounded-md text-sm text-muted-foreground">
                                    Select an answer above
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className="font-semibold mb-3 text-center">
                        {data.title ? data.title : "Untitled Trivia Set"}
                    </h2>
                    <h4 className="font-semibold mb-3 text-center">
                        Quiz over!
                    </h4>
                    <div className="text-center">
                        You got {score} out of {data.questions.length} questions right, or {Math.round(score * 100 / data.questions.length)}%.
                    </div>
                    {/* Trigger confetti for perfect score */}
                    {score === data.questions.length && (
                        <ConfettiTrigger startConfetti={createAndStartConfetti} />
                    )}
                    <button
                        onClick={restart}
                        className="px-3 py-1 border bg-[#F48120]/10 text-[#F48120] text-primary-foreground rounded-md text-center block mx-auto mt-4"
                    >
                        Try again?
                    </button>

                </div>
            )}
            </div>
        </div>
    );
}

export default TriviaGame;

// small component used to trigger confetti once when mounted
function ConfettiTrigger({ startConfetti }: { startConfetti: () => void }) {
    useEffect(() => {
        // startConfetti may be undefined in some odd cases; guard
        try {
            startConfetti();
        } catch (e) {
            // ignore errors
        }
        // no cleanup needed - confetti stops itself
    }, []);
    return null;
}
