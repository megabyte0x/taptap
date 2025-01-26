import { ConnectButton } from "arweave-wallet-kit";
import { useActiveAddress } from "arweave-wallet-kit";
import "./App.css";
import IdleTapMiner from "./components/IdleTapMiner.tsx";
import { useState, Suspense, lazy, useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import { totalTaps } from "./utils";
const Confetti = lazy(() => import("./components/Confetti"))

function App() {
  const [gameEnded, setGameEnded] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [tapCount, setTotalTaps] = useState("");
  const walletAddress = useActiveAddress();

  const handleGameEnd = () => {
    setGameEnded(true);
    setTimeout(() => setGameEnded(false), 3000);
  };
  const fetchTaps = async () => {
    const taps = await totalTaps();
    setTotalTaps(taps);
  };

  useEffect(() => {
    fetchTaps();
  }, []);

  return (
    <div className="container">
      <Toaster
        position="bottom-right"
        reverseOrder={true}
        gutter={-6}
        containerClassName="toast-container"
        toastOptions={{
          className: 'toast'
        }}
      />
      {showDisclaimer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>⚠️ Important Disclaimer</h2>
            <p>This is just a game. $TAP tokens do not hold any monetary value and should not be considered as an investment.</p>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="modal-button"
            >
              I understand $TAP doesn't hold any value
            </button>
          </div>
        </div>
      )}
      {gameEnded && (
        <Suspense fallback={null}>
          <Confetti />
        </Suspense>
      )}
      <div className="disclaimer">
        <p>⚠️ This is just a game, <strong>$TAP doesn't hold any value.</strong></p>
      </div>
      <div className="total-taps-counter">
        <h2>Total Taps: {tapCount}</h2>
      </div>
      <div className="card">
        <div className={`wallet-button ${!walletAddress ? 'hidden' : ''}`}>
          <ConnectButton profileModal={true} showBalance={true} />
        </div>
        <IdleTapMiner
          onGameEnd={handleGameEnd}
          ConnectButtonComponent={
            !walletAddress ? <ConnectButton profileModal={true} showBalance={true} /> : null
          }
        />
      </div>
      <footer className="footer">
        Proof of Build! by <a
          href="https://megabyte.ar.io"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >@megabyte 💫</a>
      </footer>
    </div>
  );
}

export default App;
