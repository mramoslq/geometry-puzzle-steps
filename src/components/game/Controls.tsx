
import { MoveLeft, MoveRight, MoveUp, MoveDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  movesLeft: number;
}

export const Controls = ({
  onMoveLeft,
  onMoveRight,
  onMoveUp,
  onMoveDown,
  movesLeft,
}: ControlsProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md">
      <div className="text-center mb-2">
        <span className="text-sm font-medium text-gray-600">Moves left: {movesLeft}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 place-items-center">
        <div></div>
        <Button
          variant="outline"
          onClick={onMoveUp}
          disabled={movesLeft <= 0}
          className="flex items-center gap-2"
        >
          <MoveUp className="w-4 h-4" />
        </Button>
        <div></div>
        
        <Button
          variant="outline"
          onClick={onMoveLeft}
          disabled={movesLeft <= 0}
          className="flex items-center gap-2"
        >
          <MoveLeft className="w-4 h-4" />
        </Button>
        <div></div>
        <Button
          variant="outline"
          onClick={onMoveRight}
          disabled={movesLeft <= 0}
          className="flex items-center gap-2"
        >
          <MoveRight className="w-4 h-4" />
        </Button>

        <div></div>
        <Button
          variant="outline"
          onClick={onMoveDown}
          disabled={movesLeft <= 0}
          className="flex items-center gap-2"
        >
          <MoveDown className="w-4 h-4" />
        </Button>
        <div></div>
      </div>
    </div>
  );
};
