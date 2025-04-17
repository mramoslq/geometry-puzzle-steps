
import { useState } from "react";
import { Shape } from "./Shape";
import { Controls } from "./Controls";
import { LevelDisplay } from "./LevelDisplay";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Block {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isTarget?: boolean;
}

interface GameState {
  blocks: Block[];
  movesLeft: number;
  level: number;
}

const INITIAL_MOVES = 15;
const BOARD_SIZE = 6;

const LEVELS = [
  {
    blocks: [
      { id: 1, x: 2, y: 2, width: 2, height: 1, isTarget: true }, // Target block
      { id: 2, x: 0, y: 0, width: 2, height: 2 },
      { id: 3, x: 4, y: 1, width: 1, height: 2 },
      { id: 4, x: 0, y: 3, width: 2, height: 2 },
    ],
    movesLeft: INITIAL_MOVES,
    level: 1,
  }
];

const generateLevel = (level: number): GameState => {
  const levelData = LEVELS[level - 1] || LEVELS[0];
  return {
    blocks: levelData.blocks,
    movesLeft: levelData.movesLeft,
    level: level,
  };
};

export const GameBoard = () => {
  const [gameState, setGameState] = useState<GameState>(() => generateLevel(1));
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);

  const handleBlockClick = (blockId: number) => {
    setSelectedBlock(blockId);
  };

  const moveBlock = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (selectedBlock === null || gameState.movesLeft <= 0) return;

    setGameState(prev => {
      const newBlocks = [...prev.blocks];
      const blockIndex = newBlocks.findIndex(b => b.id === selectedBlock);
      const block = newBlocks[blockIndex];

      let newX = block.x;
      let newY = block.y;

      switch (direction) {
        case 'left':
          if (block.x > 0) newX--;
          break;
        case 'right':
          if (block.x + block.width < BOARD_SIZE) newX++;
          break;
        case 'up':
          if (block.y > 0) newY--;
          break;
        case 'down':
          if (block.y + block.height < BOARD_SIZE) newY++;
          break;
      }

      // Check for collisions with other blocks
      const wouldCollide = newBlocks.some((otherBlock, i) => {
        if (i === blockIndex) return false;
        return checkCollision(
          { ...block, x: newX, y: newY },
          otherBlock
        );
      });

      if (wouldCollide) {
        toast.error("Can't move there - blocked by another piece!");
        return prev;
      }

      newBlocks[blockIndex] = { ...block, x: newX, y: newY };

      // Check if target block reached exit
      const targetBlock = newBlocks.find(b => b.isTarget);
      if (targetBlock && targetBlock.x + targetBlock.width >= BOARD_SIZE) {
        toast.success("Level completed!");
        return generateLevel(prev.level + 1);
      }

      return {
        ...prev,
        blocks: newBlocks,
        movesLeft: prev.movesLeft - 1
      };
    });
  };

  const checkCollision = (block1: Block, block2: Block) => {
    return !(
      block1.x + block1.width <= block2.x ||
      block1.x >= block2.x + block2.width ||
      block1.y + block1.height <= block2.y ||
      block1.y >= block2.y + block2.height
    );
  };

  const handleRestartLevel = () => {
    setGameState(generateLevel(gameState.level));
    setSelectedBlock(null);
    toast.info("Level restarted");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <LevelDisplay level={gameState.level} targetMoves={INITIAL_MOVES} />
      
      <div className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Sliding Blocks Puzzle</h3>
          <div 
            className="relative w-[300px] h-[300px] mx-auto bg-gray-100 rounded-lg"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
              gap: '2px',
              padding: '2px'
            }}
          >
            {gameState.blocks.map(block => (
              <div
                key={block.id}
                className={`absolute transition-all duration-200 ${
                  block.isTarget ? 'bg-red-500' : 'bg-blue-500'
                } ${selectedBlock === block.id ? 'ring-2 ring-yellow-400' : ''}`}
                style={{
                  left: `${(block.x / BOARD_SIZE) * 100}%`,
                  top: `${(block.y / BOARD_SIZE) * 100}%`,
                  width: `${(block.width / BOARD_SIZE) * 100}%`,
                  height: `${(block.height / BOARD_SIZE) * 100}%`,
                  cursor: 'pointer'
                }}
                onClick={() => handleBlockClick(block.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Controls
          onMoveLeft={() => moveBlock('left')}
          onMoveRight={() => moveBlock('right')}
          onMoveUp={() => moveBlock('up')}
          onMoveDown={() => moveBlock('down')}
          movesLeft={gameState.movesLeft}
        />
        <div className="mt-4 flex justify-center">
          <Button
            onClick={handleRestartLevel}
            variant="outline"
            className="w-full max-w-xs"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart Level
          </Button>
        </div>
      </div>
    </div>
  );
};
