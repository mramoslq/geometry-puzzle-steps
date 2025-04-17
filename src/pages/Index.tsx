
import { GameBoard } from "@/components/game/GameBoard";

const Index = () => {
  return (
    <div className="min-h-screen py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Geometry Puzzle</h1>
        <p className="text-gray-600 mt-2">Transform shapes to match the target pattern</p>
      </header>
      <GameBoard />
    </div>
  );
};

export default Index;
