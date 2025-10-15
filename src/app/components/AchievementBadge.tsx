interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

export default function AchievementBadge({ title, description, icon, earned, earnedDate }: AchievementBadgeProps) {
  return (
    <div className={`p-4 rounded-lg border transition-all ${
      earned
        ? 'bg-yellow-900/20 border-yellow-500/50'
        : 'bg-gray-800 border-gray-700 opacity-50'
    }`}>
      <div className="text-center">
        <div className={`text-3xl mb-2 ${earned ? 'text-yellow-400' : 'text-gray-600'}`}>
          {icon}
        </div>
        <h3 className={`font-semibold mb-1 ${earned ? 'text-white' : 'text-gray-500'}`}>
          {title}
        </h3>
        <p className={`text-sm mb-2 ${earned ? 'text-gray-300' : 'text-gray-600'}`}>
          {description}
        </p>
        {earned && earnedDate && (
          <p className="text-xs text-yellow-400">
            Earned {new Date(earnedDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}
