import { ConnectButton } from "arweave-wallet-kit";
import { useActiveAddress } from "arweave-wallet-kit";
import "./App.css";
import IdleTapMiner from "./components/IdleTapMiner.tsx";
import { useState, Suspense, lazy, useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import { totalTaps, checkVouch } from "./utils";

const Confetti = lazy(() => import("./components/Confetti"))

function App() {
  const [gameEnded, setGameEnded] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [tapCount, setTotalTaps] = useState("");
  const [vouched, setVouched] = useState<boolean | null>(null); // null represents no wallet connected
  const [showVouchPopup, setShowVouchPopup] = useState(false);
  const [isCheckingVouch, setIsCheckingVouch] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const walletAddress = useActiveAddress();

  const handleGameEnd = () => {
    setGameEnded(true);
    setTimeout(() => setGameEnded(false), 3000);
  };

  const fetchTaps = async () => {
    try {
      const taps = await totalTaps();
      setTotalTaps(taps);
    } catch (error) {
      console.error("Error fetching taps:", error);
      setTotalTaps("Error fetching taps");
    }
  };

  useEffect(() => {
    fetchTaps();
  }, []);

  useEffect(() => {
    const verifyVouchStatus = async () => {
      if (walletAddress) {
        setIsCheckingVouch(true);
        setError(null);
        try {
          const status = await checkVouch(walletAddress);
          setVouched(status);
          console.log("Vouched:", status);
        } catch (err) {
          console.error("Error checking vouch status:", err);
          setError("Failed to check vouch status. Please try again.");
          setVouched(false); // Depending on desired fallback
        } finally {
          setIsCheckingVouch(false);
        }
      } else {
        setVouched(null); // Represents no wallet connected
        setShowVouchPopup(false);
      }
    };

    verifyVouchStatus();
  }, [walletAddress]);

  useEffect(() => {
    if (vouched === false && walletAddress) {
      setShowVouchPopup(true);
    } else {
      setShowVouchPopup(false);
    }
  }, [vouched, walletAddress]);

  const handleIAmVouched = async () => {
    if (walletAddress) {
      setIsCheckingVouch(true);
      setError(null);
      try {
        const status = await checkVouch(walletAddress);
        setVouched(status);
        console.log("Vouched after 'I am vouched':", status);
      } catch (err) {
        console.error("Error rechecking vouch status:", err);
        setError("Failed to recheck vouch status. Please try again.");
        setVouched(false);
      } finally {
        setIsCheckingVouch(false);
      }
    }
  };

  const handleGetVouched = () => {
    window.open("http://vouch-twitter.arweave.dev/", "_blank", "noopener,noreferrer");
  };

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
      {showVouchPopup && (
        <div className="modal-overlay">
          <div className="modal-content vouch-popup">
            <h2>Vouch Status</h2>
            <p>Your address is not vouched.</p>
            {error && <p className="error-message">{error}</p>}
            <div className="button-group">
              <button
                onClick={handleIAmVouched}
                className="modal-button"
                disabled={isCheckingVouch}
              >
                {isCheckingVouch ? "Checking..." : "I am vouched"}
              </button>
              <button
                onClick={handleGetVouched}
                className="modal-button highlighted"
                disabled={isCheckingVouch}
              >
                Get vouched
              </button>
            </div>
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
          <ConnectButton profileModal={false} showBalance={false} />
        </div>
        <div className="error-container">
          Due to huge number of $TAPs, the process is congested right now. It will be back automatically after there's no more congestion.
        </div>
        {tapCount === "Error" ? (
          <div className="error-container">
            Due to huge number of $TAPs, the process is congested right now. It will be back automatically after there's no more congestion.
          </div>
        ) : (
          <IdleTapMiner
            onGameEnd={handleGameEnd}
            ConnectButtonComponent={
              !walletAddress ? <ConnectButton profileModal={false} showBalance={false} /> : null
            }
          />
        )}
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
