interface AchievementPopupProps {
  title: string;
  description: string;
  icon: string;
  onClose: () => void;
}

export default function AchievementPopup({ title, description, icon, onClose }: AchievementPopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg border border-yellow-500/50 max-w-md mx-4 text-center">
        <div className="text-6xl mb-4 text-yellow-400">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h2>
        <h3 className="text-xl font-semibold text-yellow-400 mb-2">{title}</h3>
        <p className="text-gray-300 mb-6">{description}</p>
        <button
          onClick={onClose}
          className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition-colors"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
