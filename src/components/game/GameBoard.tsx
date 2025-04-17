import { useState } from "react";
import { Shape } from "./Shape";
import { Controls } from "./Controls";
import { LevelDisplay } from "./LevelDisplay";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface GameState {
  shapes: Array<{
    id: number;
    type: "triangle" | "square" | "circle";
    size: "sm" | "md" | "lg";
    rotation: number;
  }>;
  movesLeft: number;
  level: number;
  targetShape: {
    type: "triangle" | "square" | "circle";
    size: "sm" | "md" | "lg";
    rotation: number;
  };
}

const INITIAL_MOVES = 5;

const generateLevel = (level: number): GameState => {
  // For now, we'll keep it simple with just increasing difficulty
  const shapes = [
    { id: 1, type: "triangle" as const, size: "md" as const, rotation: 0 }
  ];
  
  // Example progression: each level rotates target more and makes it larger
  const targetShape = {
    type: "triangle" as const,
    size: level === 1 ? "lg" as const : "lg" as const,
    rotation: level * 90
  };

  return {
    shapes,
    movesLeft: INITIAL_MOVES,
    level,
    targetShape
  };
};

export const GameBoard = () => {
  const [gameState, setGameState] = useState<GameState>(() => generateLevel(1));

  const handleRotateLeft = () => {
    if (gameState.movesLeft <= 0) return;
    setGameState(prev => ({
      ...prev,
      shapes: prev.shapes.map(shape => ({
        ...shape,
        rotation: shape.rotation - 90
      })),
      movesLeft: prev.movesLeft - 1
    }));
  };

  const handleRotateRight = () => {
    if (gameState.movesLeft <= 0) return;
    setGameState(prev => ({
      ...prev,
      shapes: prev.shapes.map(shape => ({
        ...shape,
        rotation: shape.rotation + 90
      })),
      movesLeft: prev.movesLeft - 1
    }));
  };

  const handleExpand = () => {
    if (gameState.movesLeft <= 0) return;
    setGameState(prev => ({
      ...prev,
      shapes: prev.shapes.map(shape => ({
        ...shape,
        size: shape.size === "sm" ? "md" : "lg"
      })),
      movesLeft: prev.movesLeft - 1
    }));
  };

  const handleDuplicate = () => {
    if (gameState.movesLeft <= 0) return;
    setGameState(prev => ({
      ...prev,
      shapes: [
        ...prev.shapes,
        {
          ...prev.shapes[prev.shapes.length - 1],
          id: Date.now()
        }
      ],
      movesLeft: prev.movesLeft - 1
    }));
  };

  const checkShapes = () => {
    const currentShape = gameState.shapes[0];
    const targetShape = gameState.targetShape;

    const isMatch = 
      currentShape.type === targetShape.type &&
      currentShape.size === targetShape.size &&
      currentShape.rotation % 360 === targetShape.rotation % 360;

    if (isMatch) {
      toast.success("Perfect match! Moving to next level...");
      setGameState(generateLevel(gameState.level + 1));
    } else {
      toast.error("Shapes don't match. Keep trying!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <LevelDisplay level={gameState.level} targetMoves={INITIAL_MOVES} />
      
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Your Shape</h3>
          <div className="min-h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
            {gameState.shapes.map(shape => (
              <Shape
                key={shape.id}
                type={shape.type}
                size={shape.size}
                rotation={shape.rotation}
              />
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Target Shape</h3>
          <div className="min-h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
            <Shape
              type={gameState.targetShape.type}
              size={gameState.targetShape.size}
              rotation={gameState.targetShape.rotation}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Controls
          onRotateLeft={handleRotateLeft}
          onRotateRight={handleRotateRight}
          onExpand={handleExpand}
          onDuplicate={handleDuplicate}
          movesLeft={gameState.movesLeft}
        />
        <div className="mt-4 flex justify-center">
          <Button
            onClick={checkShapes}
            className="w-full max-w-xs"
            disabled={gameState.movesLeft <= 0}
          >
            <Check className="w-4 h-4 mr-2" />
            Check Shape
          </Button>
        </div>
      </div>
    </div>
  );
};
