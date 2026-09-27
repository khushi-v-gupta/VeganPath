import React, { useEffect, useRef, useState } from "react";
import "./FoodScanner.css";

const FoodScanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeFood = async (image) => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await fetch(
        "http://localhost:5000/api/scanner/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image,
          }),
        },
      );

      const text = await response.text();

      console.log("Scanner HTTP status:", response.status);
      console.log("Scanner raw response:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        throw new Error(
          `Backend returned invalid response (${response.status}): ${text || "empty response"}`,
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Food analysis failed");
      }

      setResult(data.result);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to analyze food");
    } finally {
      setLoading(false);
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      setError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraOn(true);
    } catch (err) {
      console.error(err);
      setError(
        "Camera access was denied. Please allow camera permission in your browser.",
      );
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setCameraOn(false);
  };

  // Open scanner
  const openScanner = () => {
    setOpen(true);
    setCapturedImage(null);
    setError("");

    setTimeout(() => {
      startCamera();
    }, 200);
  };

  // Close scanner
  const closeScanner = () => {
    stopCamera();
    setOpen(false);
    setCapturedImage(null);
  };

  // Capture image
  const captureImage = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const image = canvas.toDataURL("image/jpeg", 0.8);

    setCapturedImage(image);

    stopCamera();

    await analyzeFood(image);
  };

  // Scan again
  const scanAgain = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Stop camera when component disappears
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <>
      {/* Floating Scanner Button */}
      <button className="scanner-floating-button" onClick={openScanner}>
        <span className="scanner-camera-icon">📷</span>
        <span>Scan Food</span>
      </button>

      {/* Scanner Modal */}
      {open && (
        <div className="scanner-overlay">
          <div className="scanner-modal">
            {/* Header */}
            <div className="scanner-header">
              <div>
                <h2>Scan Food</h2>
                <p>
                  Check whether the food is Vegan, Vegetarian, or
                  Non-Vegetarian.
                </p>
              </div>

              <button className="close-button" onClick={closeScanner}>
                ✕
              </button>
            </div>

            {/* Camera */}
            {!capturedImage && (
              <div className="camera-container">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="camera-preview"
                />

                {/* Scanner Frame */}
                <div className="scanner-frame">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            {/* Camera Error */}
            {error && <div className="camera-error">⚠️ {error}</div>}

            {/* Capture Button */}
            {!capturedImage && cameraOn && (
              <button className="capture-button" onClick={captureImage}>
                <span>📷</span>
                Capture Food
              </button>
            )}

            {/* Captured Image */}
            {capturedImage && (
              <div className="result-container">
                <img
                  src={capturedImage}
                  alt="Captured food"
                  className="captured-image"
                />

                <h3>Food Captured Successfully</h3>

                {loading && (
                  <p className="analysis-text">
                    🤖 AI is analyzing the food...
                  </p>
                )}

                {result && (
                  <div className="scanner-result">
                    <h3>{result.foodName}</h3>

                    <div className="classification">
                      {result.classification === "Vegan" && "🟢 Vegan"}

                      {result.classification === "Vegetarian" &&
                        "🟡 Vegetarian"}

                      {result.classification === "Non-Vegetarian" &&
                        "🔴 Non-Vegetarian"}

                      {result.classification === "Unclear" && "⚪ Unclear"}
                    </div>

                    <p>
                      <strong>Confidence:</strong> {result.confidence}%
                    </p>

                    <p>
                      <strong>Why:</strong> {result.reason}
                    </p>

                    {result.detectedIngredients?.length > 0 && (
                      <div>
                        <strong>Detected ingredients:</strong>

                        <ul>
                          {result.detectedIngredients.map(
                            (ingredient, index) => (
                              <li key={index}>{ingredient}</li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                <button className="scan-again-button" onClick={scanAgain}>
                  📷 Scan Again
                </button>
              </div>
            )}

            {/* Hidden Canvas */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        </div>
      )}
    </>
  );
};

export default FoodScanner;
