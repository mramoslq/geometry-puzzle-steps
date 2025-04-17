
import { useState } from "react";
import { Shape } from "./Shape";
import { Controls } from "./Controls";
import { LevelDisplay } from "./LevelDisplay";

interface GameState {
  shapes: Array<{
    id: number;
    type: "triangle" | "square" | "circle";
    size: "sm" | "md" | "lg";
    rotation: number;
  }>;
  movesLeft: number;
}

export const GameBoard = () => {
  const [gameState, setGameState] = useState<GameState>({
    shapes: [
      { id: 1, type: "triangle", size: "md", rotation: 0 }
    ],
    movesLeft: 5
  });

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <LevelDisplay level={1} targetMoves={5} />
      
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
              type="triangle"
              size="lg"
              rotation={90}
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
      </div>
    </div>
  );
};
