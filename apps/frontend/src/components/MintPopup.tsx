import { motion } from "framer-motion";
import "../styles/MintPopup.css"

interface MintPopupProps {
    onClose: () => void;
    onMintFreely: (e: React.MouseEvent) => void;
    onMintSupport: (e: React.MouseEvent) => void;
}

export default function MintPopup({ onClose, onMintFreely, onMintSupport }: MintPopupProps) {
    return (
        <motion.div
            className="mint-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="mint-popup"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <h2>Choose Minting Option</h2>
                <div className="mint-buttons">
                    <motion.button
                        className="mint-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onMintFreely}
                    >
                        Mint Freely
                    </motion.button>
                    <motion.button
                        className="mint-button highlight"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onMintSupport}
                    >
                        Mint with 0.1 wAR (if enjoyed)
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}