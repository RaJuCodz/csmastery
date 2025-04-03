"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eraser,
  Undo2,
  Redo2,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";

export const Playground = ({ isOpen, onClose }) => {
  const [isSlidBack, setIsSlidBack] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set fixed canvas dimensions
    canvas.width = 600;
    canvas.height = 600;

    // Initialize context
    context.scale(1, 1);
    context.lineCap = "round";
    context.strokeStyle = color;
    context.lineWidth = size;
    contextRef.current = context;

    // Save initial state
    saveState();
  }, [color, size, isOpen]);

  const saveState = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();

    // Clear redo history when new action is performed
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(
        0,
        historyIndexRef.current + 1
      );
    }

    historyRef.current.push(imageData);
    historyIndexRef.current = historyRef.current.length - 1;
  };

  const undo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      const imageData = historyRef.current[historyIndexRef.current];
      const img = new Image();
      img.src = imageData;
      img.onload = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
    }
  };

  const redo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      const imageData = historyRef.current[historyIndexRef.current];
      const img = new Image();
      img.src = imageData;
      img.onload = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
    }
  };

  const startDrawing = ({ nativeEvent }) => {
    if (!contextRef.current) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.strokeStyle = isEraser ? "#ffffff" : color;
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
    saveState();
  };

  const clearCanvas = () => {
    if (!canvasRef.current || !contextRef.current) return;
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const toggleEraser = () => {
    setIsEraser(true);
    if (contextRef.current) {
      contextRef.current.strokeStyle = "#ffffff";
    }
  };

  const togglePencil = () => {
    setIsEraser(false);
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: isSlidBack ? "calc(100% - 20px)" : 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed right-0 top-0 h-full w-[700px] bg-gray-100 shadow-lg z-50 flex items-center justify-center"
        >
          {/* Slide Back Button */}
          <button
            onClick={() => setIsSlidBack(!isSlidBack)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 text-gray-600 z-50"
            title={isSlidBack ? "Slide Forward" : "Slide Back"}
          >
            <ChevronRight
              className={`h-6 w-6 transition-transform ${
                isSlidBack ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className="p-4 flex flex-col items-center w-full">
            <div className="flex justify-between items-center w-full mb-4">
              <h2 className="text-xl font-bold text-gray-800">Playground</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-200 text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: isSlidBack ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className={`${isSlidBack ? "hidden" : ""}`}
            >
              <div className="flex gap-3 mb-4 bg-white p-3 rounded-lg shadow-sm">
                <button
                  onClick={togglePencil}
                  className={`p-2 rounded-full ${
                    !isEraser
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title="Pencil"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={toggleEraser}
                  className={`p-2 rounded-full ${
                    isEraser
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title="Eraser"
                >
                  <Eraser className="h-5 w-5" />
                </button>
                <button
                  onClick={undo}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                  title="Undo"
                >
                  <Undo2 className="h-5 w-5" />
                </button>
                <button
                  onClick={redo}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                  title="Redo"
                >
                  <Redo2 className="h-5 w-5" />
                </button>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                  disabled={isEraser}
                />
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-32 accent-purple-600"
                />
                <button
                  onClick={clearCanvas}
                  className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Clear
                </button>
              </div>

              <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-[600px] h-[600px] cursor-crosshair"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
