
interface LevelDisplayProps {
  level: number;
  targetMoves: number;
}

export const LevelDisplay = ({ level, targetMoves }: LevelDisplayProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Level {level}</h2>
      <p className="text-sm text-gray-600">
        Complete in {targetMoves} moves
      </p>
    </div>
  );
};
