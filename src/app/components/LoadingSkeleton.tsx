export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-24"></div>
          </div>
        ))}
      </div>
      <div className="mt-12">
        <div className="h-8 bg-gray-700 rounded mb-8 w-64 mx-auto"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <div className="h-6 bg-gray-700 rounded mb-4"></div>
            <div className="h-64 bg-gray-700 rounded"></div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <div className="h-6 bg-gray-700 rounded mb-4"></div>
            <div className="h-64 bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="flex justify-center">
            <div className="w-64 h-64 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
