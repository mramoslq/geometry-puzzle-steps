
import { RotateCcw, RotateCw, Expand, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ControlsProps {
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onExpand: () => void;
  onDuplicate: () => void;
  movesLeft: number;
}

export const Controls = ({
  onRotateLeft,
  onRotateRight,
  onExpand,
  onDuplicate,
  movesLeft,
}: ControlsProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md">
      <div className="text-center mb-2">
        <span className="text-sm font-medium text-gray-600">Moves left: {movesLeft}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={onRotateLeft}
          disabled={movesLeft <= 0}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Rotate Left
        </Button>
        <Button
          variant="outline"
          onClick={onRotateRight}
          disabled={movesLeft <= 0}
          className="flex items-center gap-2"
        >
          <RotateCw className="w-4 h-4" />
          Rotate Right
        </Button>
        <Button
          variant="outline"
          onClick={onExpand}
          disabled={movesLeft <= 0}
          className="flex items-center gap-2"
        >
          <Expand className="w-4 h-4" />
          Expand
        </Button>
        <Button
          variant="outline"
          onClick={onDuplicate}
          disabled={movesLeft <= 0}
          className="flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Duplicate
        </Button>
      </div>
    </div>
  );
};
