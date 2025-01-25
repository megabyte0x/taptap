import { motion } from "framer-motion"
import { useState, useEffect, ReactNode } from "react"
import { useActiveAddress } from "arweave-wallet-kit"
import Timer from "./Timer"
import Score from "./Score"
import CoinEffect from "./CoinEffect"
import SoundManager from "../utils/sound"
import "../styles/IdleTapMiner.css"
import { mint } from "../mint"


interface IdleTapMinerProps {
    onGameEnd: () => void;
    ConnectButtonComponent: ReactNode
}

export default function IdleTapMiner({ onGameEnd, ConnectButtonComponent }: IdleTapMinerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(10)
    const [isCreatingMemory, setIsCreatingMemory] = useState(false)
    const [createdProcessId, setCreatedProcessId] = useState<string | null>(null)
    const [mintError, setMintError] = useState<string | null>(null)

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

    const handleMint = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsCreatingMemory(true);
        setMintError(null); // Reset error message
        if (walletAddress) {
            try {
                const result = await mint(walletAddress, score);
                if (result.success && result.processId) {
                    setCreatedProcessId(result.processId);
                } else {
                    setMintError(result.message || 'Failed to mint memory');
                }
            } catch (error) {
                console.error("Error creating memory:", error);
                setMintError('An unexpected error occurred');
            } finally {
                setIsCreatingMemory(false);
                onGameEnd();
            }
        } else {
            console.error("Wallet address not found");
            setMintError('Wallet address not found');
            setIsCreatingMemory(false);
        }
    };

    const handleViewMemory = () => {
        if (createdProcessId) {
            window.open(`https://bazar.arweave.net/#/asset/${createdProcessId}`, '_blank');
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
                                setCreatedProcessId(null)
                            }}
                        >
                            Play Again
                        </motion.button>

                        {!createdProcessId ? (
                            <div className="mint-button-container">
                                <motion.button
                                    className="start-button"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleMint}
                                    disabled={isCreatingMemory}
                                >
                                    {isCreatingMemory ? "Minting Memory..." : "Mint Memory!"}
                                </motion.button>
                                {mintError && (
                                    <div className="mint-error">
                                        {mintError}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <motion.button
                                className="start-button view-memory"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleViewMemory}
                            >
                                View Memory
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            )}
            {coinEffects.map((effect, index) => (
                <CoinEffect key={index} x={effect.x} y={effect.y} />
            ))}
        </div>
    )
}

