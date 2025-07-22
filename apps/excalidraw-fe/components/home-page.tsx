'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { 
  Square, 
  Circle, 
  Triangle, 
  Minus, 
  Edit3, 
  MousePointer, 
  Trash2, 
  Download, 
  Undo, 
  Redo,
  Move,
  Type,
  Share2,
  Sun,
  Moon,
  ArrowRight,
  Image,
  Hand
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Point {
  x: number;
  y: number;
}

interface Shape {
  id: string;
  type: 'rectangle' | 'circle' | 'triangle' | 'line' | 'freehand' | 'text' | 'arrow' | 'image';
  points: Point[];
  color: string;
  strokeWidth: number;
  fill?: string;
  text?: string;
  fontSize?: number;
  isEditing?: boolean;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageElement?: HTMLImageElement;
}

type Tool = 'select' | 'rectangle' | 'circle' | 'triangle' | 'line' | 'pen' | 'text' | 'move' | 'arrow' | 'image' | 'pan';

export default function CanvasPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  
  const [isDark, setIsDark] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [currentTool, setCurrentTool] = useState<Tool>('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [currentColor, setCurrentColor] = useState('#3B82F6');
  const [dragOffset, setDragOffset] = useState<Point | null>(null);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [history, setHistory] = useState<Shape[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState<Point | null>(null);
  
  // Infinite canvas state
  const [canvasOffset, setCanvasOffset] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null);
  const [zoom, setZoom] = useState(1);

  const tools = [
    { id: 'select' as Tool, icon: MousePointer, label: 'Select' },
    { id: 'move' as Tool, icon: Move, label: 'Move' },
    { id: 'pan' as Tool, icon: Hand, label: 'Pan Canvas' },
    { id: 'rectangle' as Tool, icon: Square, label: 'Rectangle' },
    { id: 'circle' as Tool, icon: Circle, label: 'Circle' },
    { id: 'triangle' as Tool, icon: Triangle, label: 'Triangle' },
    { id: 'line' as Tool, icon: Minus, label: 'Line' },
    { id: 'arrow' as Tool, icon: ArrowRight, label: 'Arrow' },
    { id: 'pen' as Tool, icon: Edit3, label: 'Pen' },
    { id: 'text' as Tool, icon: Type, label: 'Text' },
    { id: 'image' as Tool, icon: Image, label: 'Image' },
  ];

  const selectedShape = useMemo(() => 
    shapes.find(s => s.id === selectedShapeId), 
    [shapes, selectedShapeId]
  );

  const drawArrowHead = useCallback((ctx: CanvasRenderingContext2D, from: Point, to: Point, size: number = 10) => {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - size * Math.cos(angle - Math.PI / 6),
      to.y - size * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - size * Math.cos(angle + Math.PI / 6),
      to.y - size * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  }, []);

  const drawShape = useCallback((ctx: CanvasRenderingContext2D, shape: Shape) => {
    ctx.save();
    ctx.translate(canvasOffset.x, canvasOffset.y);
    ctx.scale(zoom, zoom);
    
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.strokeWidth / zoom;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (shape.fill) {
      ctx.fillStyle = shape.fill;
    }

    switch (shape.type) {
      case 'rectangle':
        if (shape.points.length >= 2) {
          const width = shape.points[1].x - shape.points[0].x;
          const height = shape.points[1].y - shape.points[0].y;
          ctx.strokeRect(shape.points[0].x, shape.points[0].y, width, height);
          if (shape.fill) {
            ctx.fillRect(shape.points[0].x, shape.points[0].y, width, height);
          }
        }
        break;
      
      case 'circle':
        if (shape.points.length >= 2) {
          const radius = Math.sqrt(
            Math.pow(shape.points[1].x - shape.points[0].x, 2) +
            Math.pow(shape.points[1].y - shape.points[0].y, 2)
          );
          ctx.beginPath();
          ctx.arc(shape.points[0].x, shape.points[0].y, radius, 0, 2 * Math.PI);
          ctx.stroke();
          if (shape.fill) {
            ctx.fill();
          }
        }
        break;
      
      case 'triangle':
        if (shape.points.length >= 2) {
          const base = shape.points[1].x - shape.points[0].x;
          const height = shape.points[1].y - shape.points[0].y;
          ctx.beginPath();
          ctx.moveTo(shape.points[0].x, shape.points[0].y + height);
          ctx.lineTo(shape.points[0].x + base / 2, shape.points[0].y);
          ctx.lineTo(shape.points[0].x + base, shape.points[0].y + height);
          ctx.closePath();
          ctx.stroke();
          if (shape.fill) {
            ctx.fill();
          }
        }
        break;
      
      case 'line':
        if (shape.points.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(shape.points[0].x, shape.points[0].y);
          ctx.lineTo(shape.points[1].x, shape.points[1].y);
          ctx.stroke();
        }
        break;
      
      case 'arrow':
        if (shape.points.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(shape.points[0].x, shape.points[0].y);
          ctx.lineTo(shape.points[1].x, shape.points[1].y);
          ctx.stroke();
          drawArrowHead(ctx, shape.points[0], shape.points[1], 15 / zoom);
        }
        break;
      
      case 'freehand':
        if (shape.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(shape.points[0].x, shape.points[0].y);
          for (let i = 1; i < shape.points.length; i++) {
            ctx.lineTo(shape.points[i].x, shape.points[i].y);
          }
          ctx.stroke();
        }
        break;
      
      case 'text':
        if (shape.text && shape.points.length > 0) {
          ctx.font = `${(shape.fontSize || 16) / zoom}px Inter, sans-serif`;
          ctx.fillStyle = shape.color;
          ctx.fillText(shape.text, shape.points[0].x, shape.points[0].y);
        }
        break;
      
      case 'image':
        if (shape.imageUrl && shape.points.length > 0 && shape.imageWidth && shape.imageHeight) {
          // Create a cached image element
          if (!shape.imageElement) {
            const img = new Image();
            img.onload = () => {
              shape.imageElement = img;
              redrawCanvas(); // Redraw when image loads
            };
            img.src = shape.imageUrl;
          } else {
            // Draw the cached image
            const maxWidth = 200;
            const maxHeight = 200;
            let { imageWidth, imageHeight } = shape;
            
            // Scale down large images
            if (imageWidth! > maxWidth || imageHeight! > maxHeight) {
              const ratio = Math.min(maxWidth / imageWidth!, maxHeight / imageHeight!);
              imageWidth = imageWidth! * ratio;
              imageHeight = imageHeight! * ratio;
            }
            
            ctx.drawImage(
              shape.imageElement, 
              shape.points[0].x, 
              shape.points[0].y, 
              imageWidth! / zoom, 
              imageHeight! / zoom
            );
          }
        }
        break;
    }
    
    ctx.restore();
  }, [canvasOffset, zoom, drawArrowHead]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid with infinite canvas support
    ctx.save();
    ctx.translate(canvasOffset.x, canvasOffset.y);
    ctx.scale(zoom, zoom);
    
    ctx.strokeStyle = isDark ? '#374151' : '#f3f4f6';
    ctx.lineWidth = 1 / zoom;
    const gridSize = 20;
    
    const startX = Math.floor(-canvasOffset.x / zoom / gridSize) * gridSize;
    const endX = Math.ceil((canvas.width - canvasOffset.x) / zoom / gridSize) * gridSize;
    const startY = Math.floor(-canvasOffset.y / zoom / gridSize) * gridSize;
    const endY = Math.ceil((canvas.height - canvasOffset.y) / zoom / gridSize) * gridSize;
    
    for (let x = startX; x <= endX; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
      ctx.stroke();
    }
    
    for (let y = startY; y <= endY; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    }
    
    ctx.restore();

    // Draw all shapes
    shapes.forEach(shape => drawShape(ctx, shape));

    // Draw current shape being created
    if (currentShape) {
      drawShape(ctx, currentShape);
    }

    // Draw selection indicator
    if (selectedShapeId && selectedShape && selectedShape.points.length > 0) {
      ctx.save();
      ctx.translate(canvasOffset.x, canvasOffset.y);
      ctx.scale(zoom, zoom);
      
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2 / zoom;
      ctx.setLineDash([5 / zoom, 5 / zoom]);
      
      // Calculate bounding box for all shape types
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      
      selectedShape.points.forEach(point => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      });
      
      // Expand bounding box for different shape types
      if (selectedShape.type === 'circle' && selectedShape.points.length >= 2) {
        const radius = Math.sqrt(
          Math.pow(selectedShape.points[1].x - selectedShape.points[0].x, 2) +
          Math.pow(selectedShape.points[1].y - selectedShape.points[0].y, 2)
        );
        minX = selectedShape.points[0].x - radius;
        maxX = selectedShape.points[0].x + radius;
        minY = selectedShape.points[0].y - radius;
        maxY = selectedShape.points[0].y + radius;
      }
      
      const padding = 5 / zoom;
      ctx.strokeRect(minX - padding, minY - padding, maxX - minX + 2 * padding, maxY - minY + 2 * padding);
      ctx.setLineDash([]);
      
      ctx.restore();
    }
  }, [shapes, currentShape, selectedShapeId, selectedShape, drawShape, canvasOffset, zoom, isDark]);

  const getShapeBounds = useCallback((shape: Shape) => {
    if (shape.points.length === 0) return null;
    
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    shape.points.forEach(point => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    });
    
    // Expand bounds for specific shape types
    if (shape.type === 'circle' && shape.points.length >= 2) {
      const radius = Math.sqrt(
        Math.pow(shape.points[1].x - shape.points[0].x, 2) +
        Math.pow(shape.points[1].y - shape.points[0].y, 2)
      );
      minX = shape.points[0].x - radius;
      maxX = shape.points[0].x + radius;
      minY = shape.points[0].y - radius;
      maxY = shape.points[0].y + radius;
    } else if (shape.type === 'text') {
      // Approximate text bounds
      const textWidth = (shape.text?.length || 0) * ((shape.fontSize || 16) * 0.6);
      maxX = minX + textWidth;
      maxY = minY + (shape.fontSize || 16);
    }
    
    return { minX, maxX, minY, maxY };
  }, []);

  const isPointInShape = useCallback((point: Point, shape: Shape): boolean => {
    const bounds = getShapeBounds(shape);
    if (!bounds) return false;
    
    const tolerance = 10 / zoom;
    return point.x >= bounds.minX - tolerance && 
           point.x <= bounds.maxX + tolerance && 
           point.y >= bounds.minY - tolerance && 
           point.y <= bounds.maxY + tolerance;
  }, [getShapeBounds, zoom]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
      redrawCanvas();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [redrawCanvas]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    // Convert to canvas coordinates considering offset and zoom
    return {
      x: (clientX - canvasOffset.x) / zoom,
      y: (clientY - canvasOffset.y) / zoom
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    const clientPos = { x: e.clientX, y: e.clientY };
    
    if (currentTool === 'pan') {
      setIsPanning(true);
      setLastPanPoint(clientPos);
      return;
    }
    
    setIsDrawing(true);

    if (currentTool === 'select' || currentTool === 'move') {
      // Find clicked shape (reverse order to get topmost)
      const clickedShape = [...shapes].reverse().find(shape => isPointInShape(pos, shape));
      
      setSelectedShapeId(clickedShape?.id || null);
      
      if (currentTool === 'move' && clickedShape) {
        // Calculate offset for smooth dragging
        const bounds = getShapeBounds(clickedShape);
        if (bounds) {
          const centerX = (bounds.minX + bounds.maxX) / 2;
          const centerY = (bounds.minY + bounds.maxY) / 2;
          setDragOffset({
            x: pos.x - centerX,
            y: pos.y - centerY
          });
        }
      }
      return;
    }

    if (currentTool === 'text') {
      // Check if clicking on existing text
      const clickedTextShape = shapes.find(shape => 
        shape.type === 'text' && isPointInShape(pos, shape)
      );
      
      if (clickedTextShape) {
        // Edit existing text
        setEditingTextId(clickedTextShape.id);
        setTextInput(clickedTextShape.text || '');
        setTextPosition({
          x: clickedTextShape.points[0].x * zoom + canvasOffset.x,
          y: clickedTextShape.points[0].y * zoom + canvasOffset.y
        });
      } else {
        // Create new text
        const newTextId = Date.now().toString();
        const newShape: Shape = {
          id: newTextId,
          type: 'text',
          points: [pos],
          color: currentColor,
          strokeWidth,
          text: '',
          fontSize: 16,
          isEditing: true
        };
        
        setShapes(prev => [...prev, newShape]);
        setEditingTextId(newTextId);
        setTextInput('');
        setTextPosition({
          x: pos.x * zoom + canvasOffset.x,
          y: pos.y * zoom + canvasOffset.y
        });
      }
      return;
    }

    if (currentTool === 'image') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            const img = new Image();
            img.onload = () => {
              const newShape: Shape = {
                id: Date.now().toString(),
                type: 'image',
                points: [pos],
                color: currentColor,
                strokeWidth,
                imageUrl,
                imageWidth: img.width,
                imageHeight: img.height
              };
              
              setShapes(prev => {
                const newShapes = [...prev, newShape];
                setHistory(h => [...h.slice(0, historyIndex + 1), newShapes]);
                setHistoryIndex(i => i + 1);
                return newShapes;
              });
            };
            img.src = imageUrl;
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
      return;
    }

    const newShape: Shape = {
      id: Date.now().toString(),
      type: currentTool === 'pen' ? 'freehand' : currentTool,
      points: [pos],
      color: currentColor,
      strokeWidth
    };

    setCurrentShape(newShape);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    const clientPos = { x: e.clientX, y: e.clientY };
    
    if (isPanning && lastPanPoint) {
      const deltaX = clientPos.x - lastPanPoint.x;
      const deltaY = clientPos.y - lastPanPoint.y;
      
      setCanvasOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint(clientPos);
      return;
    }
    
    if (!isDrawing) return;

    // Handle moving selected shape
    if (currentTool === 'move' && selectedShape && dragOffset) {
      const bounds = getShapeBounds(selectedShape);
      if (bounds) {
        const currentCenterX = (bounds.minX + bounds.maxX) / 2;
        const currentCenterY = (bounds.minY + bounds.maxY) / 2;
        const newCenterX = pos.x - dragOffset.x;
        const newCenterY = pos.y - dragOffset.y;
        
        const deltaX = newCenterX - currentCenterX;
        const deltaY = newCenterY - currentCenterY;
        
        setShapes(prev => prev.map(shape => 
          shape.id === selectedShapeId 
            ? {
                ...shape,
                points: shape.points.map(point => ({
                  x: point.x + deltaX,
                  y: point.y + deltaY
                }))
              }
            : shape
        ));
      }
      return;
    }

    if (!currentShape) return;

    if (currentShape.type === 'freehand') {
      setCurrentShape(prev => prev ? {
        ...prev,
        points: [...prev.points, pos]
      } : null);
    } else {
      setCurrentShape(prev => prev ? {
        ...prev,
        points: [prev.points[0], pos]
      } : null);
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      setLastPanPoint(null);
      return;
    }
    
    if (currentShape && isDrawing && currentTool !== 'move') {
      setShapes(prev => {
        const newShapes = [...prev, currentShape];
        setHistory(h => [...h.slice(0, historyIndex + 1), newShapes]);
        setHistoryIndex(i => i + 1);
        return newShapes;
      });
      setCurrentShape(null);
    }
    setIsDrawing(false);
    setDragOffset(null);
    
    // Save history after moving
    if (currentTool === 'move' && selectedShape) {
      setHistory(h => [...h.slice(0, historyIndex + 1), shapes]);
      setHistoryIndex(i => i + 1);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, zoom * delta));
    
    // Zoom towards mouse position
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const zoomFactor = newZoom / zoom;
      setCanvasOffset(prev => ({
        x: mouseX - (mouseX - prev.x) * zoomFactor,
        y: mouseY - (mouseY - prev.y) * zoomFactor
      }));
    }
    
    setZoom(newZoom);
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTextInput(value);
    
    // Update the shape in real-time
    if (editingTextId) {
      setShapes(prev => prev.map(shape => 
        shape.id === editingTextId 
          ? { ...shape, text: value }
          : shape
      ));
    }
  };

  const finishTextEditing = () => {
    if (editingTextId) {
      if (textInput.trim() === '') {
        // Remove empty text shapes
        setShapes(prev => {
          const newShapes = prev.filter(s => s.id !== editingTextId);
          setHistory(h => [...h.slice(0, historyIndex + 1), newShapes]);
          setHistoryIndex(i => i + 1);
          return newShapes;
        });
      } else {
        // Save to history
        setHistory(h => [...h.slice(0, historyIndex + 1), shapes]);
        setHistoryIndex(i => i + 1);
      }
    }
    
    setEditingTextId(null);
    setTextInput('');
    setTextPosition(null);
  };

  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      finishTextEditing();
    } else if (e.key === 'Escape') {
      // Cancel editing and remove if it was a new text
      if (editingTextId) {
        const shape = shapes.find(s => s.id === editingTextId);
        if (shape && shape.isEditing && !shape.text) {
          setShapes(prev => prev.filter(s => s.id !== editingTextId));
        }
      }
      setEditingTextId(null);
      setTextInput('');
      setTextPosition(null);
    }
  };

  const deleteSelected = () => {
    if (selectedShapeId) {
      setShapes(prev => {
        const newShapes = prev.filter(s => s.id !== selectedShapeId);
        setHistory(h => [...h.slice(0, historyIndex + 1), newShapes]);
        setHistoryIndex(i => i + 1);
        return newShapes;
      });
      setSelectedShapeId(null);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(i => i - 1);
      setShapes(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(i => i + 1);
      setShapes(history[historyIndex + 1]);
    }
  };

  const clearCanvas = () => {
    setShapes([]);
    setHistory([[]]);
    setHistoryIndex(0);
    setSelectedShapeId(null);
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `drawing-${roomId}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const resetView = () => {
    setCanvasOffset({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className={`border-b px-4 py-3 transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className={`text-xl font-bold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              DrawSpace - Room: {roomId}
            </h1>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetView}
              className={`transition-colors ${
                isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title="Reset View"
            >
              Reset View
            </Button>
          </div>
          
          {/* Centered Toolbar */}
          <div className={`absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-1 rounded-lg p-2 shadow-lg border transition-colors duration-300 ${
            isDark 
              ? 'bg-gray-800 border-gray-600' 
              : 'bg-white border-gray-200'
          }`}>
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant={currentTool === tool.id ? "default" : "ghost"}
                size="sm"
                className={`w-10 h-10 p-0 transition-colors ${
                  currentTool === tool.id 
                    ? '' 
                    : isDark 
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setCurrentTool(tool.id)}
                title={tool.label}
              >
                <tool.icon className="w-4 h-4" />
              </Button>
            ))}
            
            <Separator orientation="vertical" className={`h-6 mx-2 ${
              isDark ? 'bg-gray-600' : 'bg-gray-300'
            }`} />
            
            {/* Color Picker */}
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer"
                title="Stroke Color"
              />
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {strokeWidth}px
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-16"
                title="Stroke Width"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleTheme}
              className={`transition-colors ${
                isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={undo} 
              disabled={historyIndex === 0}
              className={`transition-colors ${
                isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50'
              }`}
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={redo} 
              disabled={historyIndex === history.length - 1}
              className={`transition-colors ${
                isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50'
              }`}
            >
              <Redo className="w-4 h-4" />
            </Button>
            <Separator orientation="vertical" className={`h-6 ${
              isDark ? 'bg-gray-600' : 'bg-gray-300'
            }`} />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportCanvas}
              className={`transition-colors ${
                isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={`transition-colors ${
                isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      {/* Canvas Info */}
      <div className={`px-4 py-2 text-sm border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-800 border-gray-700 text-gray-400' 
          : 'bg-gray-50 border-gray-200 text-gray-600'
      }`}>
        Zoom: {Math.round(zoom * 100)}% | Pan: ({Math.round(canvasOffset.x)}, {Math.round(canvasOffset.y)}) | 
        Use mouse wheel to zoom, pan tool to move canvas
      </div>

      {/* Full Size Canvas */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden w-full h-full">
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full ${
            currentTool === 'move' ? 'cursor-move' : 
            currentTool === 'select' ? 'cursor-pointer' : 
            currentTool === 'pan' ? 'cursor-grab' :
            isPanning ? 'cursor-grabbing' :
            'cursor-crosshair'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
        
        {/* Floating Delete Button */}
        {selectedShapeId && (
          <div className="absolute top-4 right-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteSelected}
              className="shadow-lg"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
        
        {/* Floating Clear Button */}
        <div className="absolute bottom-4 right-4">
          <Button
            variant="outline"
            size="sm"
            onClick={clearCanvas}
            className={`shadow-lg transition-colors ${
              isDark 
                ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            Clear All
          </Button>
        </div>
        
        {/* Text Input Overlay */}
        {editingTextId && textPosition && (
          <input
            type="text"
            value={textInput}
            onChange={handleTextInputChange}
            onKeyDown={handleTextKeyDown}
            onBlur={finishTextEditing}
            autoFocus
            className={`absolute border-2 border-blue-500 rounded px-2 py-1 font-sans text-base outline-none transition-colors ${
              isDark 
                ? 'bg-gray-800 text-white border-blue-400' 
                : 'bg-white text-gray-900 border-blue-500'
            }`}
            style={{
              left: textPosition.x,
              top: textPosition.y - 20,
              fontSize: '16px',
              fontFamily: 'Inter, sans-serif',
              color: currentColor,
              minWidth: '100px',
              zIndex: 1000
            }}
            placeholder="Type text..."
          />
        )}
      </div>
    </div>
  );
}