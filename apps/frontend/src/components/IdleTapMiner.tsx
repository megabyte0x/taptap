import { motion } from "framer-motion"
import { useState, useEffect, ReactNode } from "react"
import { useActiveAddress } from "arweave-wallet-kit"
import Timer from "./Timer"
import Score from "./Score"
import CoinEffect from "./CoinEffect"
import SoundManager from "../utils/sound"
import "./IdleTapMiner.css"
import { aaSteps } from "./mint"


interface IdleTapMinerProps {
    onGameEnd: () => void;
    ConnectButtonComponent: ReactNode
}

export default function IdleTapMiner({ onGameEnd, ConnectButtonComponent }: IdleTapMinerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(10)

    const [coinEffects, setCoinEffects] = useState<{ x: number; y: number }[]>([])
    const soundManager = SoundManager.getInstance()
    const walletAddress = useActiveAddress()

    useEffect(() => {
        let timer: number
        if (isPlaying && timeLeft > 0) {
            timer = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setIsPlaying(false)
            onGameEnd()
        }
        return () => clearInterval(timer)
    }, [isPlaying, timeLeft, onGameEnd])

    const incrementScore = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isPlaying) {
            setScore((prev) => prev + 1)
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            setCoinEffects((prev) => [...prev, { x, y }])
            soundManager.playTapSound()
            setTimeout(() => {
                setCoinEffects((prev) => prev.slice(1))
            }, 1000)
        }
    }

    const handleMint = (e: React.MouseEvent) => {
        e.stopPropagation();
        onGameEnd();
        if (walletAddress) {
            aaSteps(walletAddress, score);
        } else {
            console.error("Wallet address not found");
        }
    };

    return (
        <div className="game-container" onClick={incrementScore}>
            <h1 className="title">$TAP Coin Miner</h1>
            {!isPlaying && timeLeft === 10 && (
                <div className="start-section">
                    {!walletAddress ? (
                        <div className="connect-button-container">
                            {ConnectButtonComponent}
                        </div>
                    ) : (
                        <motion.button
                            className="start-button"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsPlaying(true)
                                setScore(0)
                                setTimeLeft(10)
                            }}
                        >
                            Start Mining
                        </motion.button>
                    )}
                </div>
            )}
            {isPlaying && (
                <div className="game-info">
                    <Timer timeLeft={timeLeft} />
                    <Score score={score} />
                    <div className="instruction">Tap anywhere to mine $TAP coins!</div>
                </div>
            )}
            {timeLeft === 0 && (
                <motion.div
                    className="game-over"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="game-over-text">
                        Mining Complete! You mined {score} $TAP coins!
                    </div>
                    <div className="button-container">

                        <motion.button
                            className="start-button"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsPlaying(false)
                                setScore(0)
                                setTimeLeft(10)
                            }}
                        >
                            Play Again
                        </motion.button>

                        <motion.button
                            className="start-button"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleMint}
                        >
                            Mint $TAP
                        </motion.button>
                    </div>
                </motion.div>
            )}
            {coinEffects.map((effect, index) => (
                <CoinEffect key={index} x={effect.x} y={effect.y} />
            ))}
        </div>
    )
}

