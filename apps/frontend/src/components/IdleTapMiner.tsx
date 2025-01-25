import { motion } from "framer-motion"
import { useState, useEffect, ReactNode } from "react"
import { useActiveAddress } from "arweave-wallet-kit"
import Timer from "./Timer"
import Score from "./Score"
import CoinEffect from "./CoinEffect"
import SoundManager from "../utils/sound"
import "../styles/IdleTapMiner.css"
import { mintAA, mintToken, support } from "../mint"
import MintPopup from "./MintPopup.tsx"


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
    const [showMintPopup, setShowMintPopup] = useState(false)

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
            mintToken()
            soundManager.playTapSound()
            setTimeout(() => {
                setCoinEffects((prev) => prev.slice(1))
            }, 1000)
        }
    }

    const handleMintClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMintPopup(true);
    };

    const handleMint = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsCreatingMemory(true);
        setMintError(null); // Reset error message
        if (walletAddress) {
            try {
                const result = await mintAA(walletAddress, score);
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

    const handleMintAndSupport = async (e: React.MouseEvent) => {
        handleMint(e);
        await support();
    };

    const handleViewMemory = () => {
        if (createdProcessId) {
            window.open(`https://bazar.arweave.net/#/asset/${createdProcessId}`, '_blank');
        }
    };

    const handleRestart = () => {
        setIsPlaying(false)
        setScore(0)
        setTimeLeft(10)
        setCreatedProcessId(null)
    }

    return (
        <div className="game-container" onClick={incrementScore}>
            <h1 className="title">$TAP $Tap Miner</h1>
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
                    <div className="instruction">Tap anywhere to mine $TAP!</div>
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
                            className="start-button play-again-button"
                            onClick={handleRestart}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            Play Again
                        </motion.button>

                        {!createdProcessId ? (
                            <div className="mint-button-container">
                                {!mintError ? (
                                    <motion.button
                                        className="start-button action-button"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleMintClick}
                                        disabled={isCreatingMemory}
                                    >
                                        {isCreatingMemory ? "Minting Memory..." : "Mint Memory!"}
                                    </motion.button>
                                ) : (
                                    <motion.div
                                        className="mint-error-container"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="mint-error">
                                            <svg
                                                className="error-icon"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                                <path d="M12 7v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                <circle cx="12" cy="16" r="1" fill="currentColor" />
                                            </svg>
                                            {mintError}
                                        </div>
                                        <motion.button
                                            className="start-button action-button"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMintError(null);
                                            }}
                                        >
                                            Try Again
                                        </motion.button>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <motion.button
                                className="start-button action-button"
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
            {showMintPopup && (
                <MintPopup
                    onClose={() => setShowMintPopup(false)}
                    onMintFreely={(e) => {
                        setShowMintPopup(false);
                        handleMint(e);
                    }}
                    onMintSupport={(e) => {
                        setShowMintPopup(false);
                        handleMintAndSupport(e);
                    }}
                />
            )}
        </div>
    )
}

