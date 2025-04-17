
import { useState, useRef } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const [initialDragPosition, setInitialDragPosition] = useState({ x: 0, y: 0 });
  const [initialBlockPosition, setInitialBlockPosition] = useState({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);

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

  const handleDragStart = (e: React.MouseEvent, blockId: number) => {
    e.preventDefault();
    if (gameState.movesLeft <= 0) return;
    
    setSelectedBlock(blockId);
    setIsDragging(true);
    setInitialDragPosition({ x: e.clientX, y: e.clientY });
    
    const block = gameState.blocks.find(b => b.id === blockId);
    if (block) {
      setInitialBlockPosition({ x: block.x, y: block.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !boardRef.current || selectedBlock === null || gameState.movesLeft <= 0) return;

    const deltaX = e.clientX - initialDragPosition.x;
    const deltaY = e.clientY - initialDragPosition.y;
    
    const boardRect = boardRef.current.getBoundingClientRect();
    const cellSize = boardRect.width / BOARD_SIZE;
    
    const xMove = Math.round(deltaX / cellSize);
    const yMove = Math.round(deltaY / cellSize);
    
    if (Math.abs(xMove) >= 1 || Math.abs(yMove) >= 1) {
      // Determine movement direction
      let direction: 'left' | 'right' | 'up' | 'down' | null = null;
      
      if (Math.abs(xMove) > Math.abs(yMove)) {
        direction = xMove > 0 ? 'right' : 'left';
      } else {
        direction = yMove > 0 ? 'down' : 'up';
      }
      
      if (direction) {
        moveBlock(direction);
        // Reset for the next drag
        const block = gameState.blocks.find(b => b.id === selectedBlock);
        if (block) {
          setInitialDragPosition({ x: e.clientX, y: e.clientY });
          setInitialBlockPosition({ x: block.x, y: block.y });
        }
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <LevelDisplay level={gameState.level} targetMoves={INITIAL_MOVES} />
      
      <div className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Sliding Blocks Puzzle</h3>
          <div 
            ref={boardRef}
            className="relative w-[300px] h-[300px] mx-auto bg-gray-100 rounded-lg"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
              gap: '2px',
              padding: '2px'
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            {/* Exit marker */}
            <div 
              className="absolute h-full w-8 right-0 bg-green-100 flex items-center justify-center"
              style={{
                borderLeft: '2px dashed #22c55e',
                zIndex: 0
              }}
            >
              <div className="h-12 w-4 bg-green-500 rounded-r-md" />
            </div>

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
                  cursor: 'move',
                  zIndex: 10
                }}
                onClick={() => handleBlockClick(block.id)}
                onMouseDown={(e) => handleDragStart(e, block.id)}
              />
            ))}
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 mb-2">Drag blocks to move them. Get the red block to the green exit.</p>
            <p className="text-sm font-medium text-gray-600">Moves left: {gameState.movesLeft}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
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
  );
};
