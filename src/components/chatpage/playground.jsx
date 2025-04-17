"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Pencil, Eraser, Square, Circle, Download, Undo2, Redo2 } from "lucide-react";

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 700;

const Playground = ({ isOpen, context = "standalone", onClose }) => {
  const router = useRouter();
  const [isSlidBack, setIsSlidBack] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [drawMode, setDrawMode] = useState("free"); // free, rect, circle
  const [startPoint, setStartPoint] = useState(null);
  const [previewShape, setPreviewShape] = useState(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [showPointer, setShowPointer] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    context.scale(1, 1);
    context.lineCap = "round";
    contextRef.current = context;
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  }, []);

  useEffect(() => {
    if (!contextRef.current) return;
    contextRef.current.strokeStyle = isEraser ? "white" : color;
    contextRef.current.lineWidth = isEraser ? size * 2 : size;
  }, [color, size, isEraser]);

  const saveState = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    }
    historyRef.current.push(imageData);
    historyIndexRef.current = historyRef.current.length - 1;
  };

  const undo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      const imageData = historyRef.current[historyIndexRef.current];
      const img = new window.Image();
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
      const img = new window.Image();
      img.src = imageData;
      img.onload = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
    }
  };

  // --- Drawing logic ---
  const startDrawing = ({ nativeEvent }) => {
    if (!contextRef.current) return;
    const { offsetX, offsetY } = nativeEvent;
    setStartPoint({ x: offsetX, y: offsetY });
    if (drawMode === "free") {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    } else {
      setIsDrawing(true);
      setPreviewShape(null);
    }
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = nativeEvent;
    if (drawMode === "free") {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    } else if (drawMode === "rect" && startPoint) {
      setPreviewShape({ type: "rect", x: startPoint.x, y: startPoint.y, w: offsetX - startPoint.x, h: offsetY - startPoint.y });
    } else if (drawMode === "circle" && startPoint) {
      const radius = Math.sqrt(Math.pow(offsetX - startPoint.x, 2) + Math.pow(offsetY - startPoint.y, 2));
      setPreviewShape({ type: "circle", x: startPoint.x, y: startPoint.y, r: radius });
    }
  };

  const stopDrawing = (e) => {
    if (!contextRef.current) return;
    setIsDrawing(false);
    if (drawMode === "free") {
      contextRef.current.closePath();
      saveState();
    } else if (drawMode && previewShape) {
      const ctx = contextRef.current;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      if (previewShape.type === "rect") {
        ctx.strokeRect(previewShape.x, previewShape.y, previewShape.w, previewShape.h);
      } else if (previewShape.type === "circle") {
        ctx.beginPath();
        ctx.arc(previewShape.x, previewShape.y, previewShape.r, 0, 2 * Math.PI);
        ctx.stroke();
      }
      ctx.restore();
      setPreviewShape(null);
      saveState();
    }
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
    setDrawMode("free");
    setShowPointer(true);
    if (contextRef.current) {
      contextRef.current.strokeStyle = "white";
    }
  };

  const togglePencil = () => {
    setIsEraser(false);
    setDrawMode("free");
    setShowPointer(false);
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
    }
  };

  const setShapeMode = (mode) => {
    setIsEraser(false);
    setDrawMode(mode);
  };

  // --- Download Button ---
  const downloadCanvas = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const updatePointer = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setPointer({
      x: e.nativeEvent.clientX - rect.left,
      y: e.nativeEvent.clientY - rect.top
    });
    setShowPointer(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 h-full w-full max-w-full bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto flex flex-col"
        >
          <div className="p-4 flex flex-col items-center w-full">
            <div className="flex justify-between items-center w-full mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Playground</h2>
              <button
                onClick={() => {
                  if (context === "standalone") {
                    router.push("/");
                  } else if (onClose) {
                    onClose();
                  }
                }}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                title="Close"
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
              className={``}
            >
              <div className="flex gap-3 mb-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <button
                  onClick={togglePencil}
                  className={`p-2 rounded-full ${!isEraser && drawMode === "free" ? "bg-purple-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                  title="Pencil"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={toggleEraser}
                  className={`p-2 rounded-full border-2 ${isEraser ? "bg-yellow-300 border-yellow-500 text-black shadow-lg" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                  title="Eraser"
                >
                  <Eraser className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShapeMode("rect")}
                  className={`p-2 rounded-full ${drawMode === "rect" ? "bg-purple-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                  title="Rectangle"
                >
                  <Square className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShapeMode("circle")}
                  className={`p-2 rounded-full ${drawMode === "circle" ? "bg-purple-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                  title="Circle"
                >
                  <Circle className="h-5 w-5" />
                </button>
                <button
                  onClick={undo}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="Undo"
                >
                  <Undo2 className="h-5 w-5" />
                </button>
                <button
                  onClick={redo}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="Redo"
                >
                  <Redo2 className="h-5 w-5" />
                </button>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                  disabled={isEraser}
                />
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-32 accent-purple-600"
                />
                <button
                  onClick={clearCanvas}
                  className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Clear
                </button>
                <button
                  onClick={downloadCanvas}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  title="Download"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
              <div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-lg relative">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={(e) => { draw(e); if (isEraser) updatePointer(e); }}
                  onMouseUp={stopDrawing}
                  onMouseLeave={(e) => { stopDrawing(e); setShowPointer(false); }}
                  onMouseEnter={(e) => { if (isEraser) { updatePointer(e); setShowPointer(true); } }}
                  className="w-[1000px] h-[700px] cursor-crosshair"
                />
                {/* Shape preview overlay */}
                {isDrawing && previewShape && (
                  <svg
                    className="absolute top-0 left-0 pointer-events-none"
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                  >
                    {previewShape.type === "rect" && (
                      <rect
                        x={previewShape.x}
                        y={previewShape.y}
                        width={previewShape.w}
                        height={previewShape.h}
                        fill="none"
                        stroke={color}
                        strokeWidth={size}
                      />
                    )}
                    {previewShape.type === "circle" && (
                      <circle
                        cx={previewShape.x}
                        cy={previewShape.y}
                        r={previewShape.r}
                        fill="none"
                        stroke={color}
                        strokeWidth={size}
                      />
                    )}
                  </svg>
                )}
                {/* Eraser pointer overlay */}
                {isEraser && showPointer && (
                  <svg
                    className="absolute top-0 left-0 pointer-events-none"
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    style={{ zIndex: 10 }}
                  >
                    <circle
                      cx={pointer.x}
                      cy={pointer.y}
                      r={size}
                      fill="rgba(255,255,0,0.3)"
                      stroke="#facc15"
                      strokeWidth={2}
                    />
                  </svg>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Playground;
