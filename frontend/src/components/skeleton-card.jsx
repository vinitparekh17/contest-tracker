export default function SkeletonContestCard() {
    // Dynamic classes based on dark mode
    const cardBg = "dark:bg-gray-800 bg-white";
    const shimmerBg =  "dark:bg-gray-700 bg-gray-200";
    const shimmerAnimation =  "dark:animate-pulse-dark animate-pulse";
    const borderColor =  "dark:border-gray-700 border-gray-200";
    const footerBg =  "dark:bg-gray-900 bg-gray-50";
    
    return (
      <div className={`overflow-hidden ${cardBg} rounded-lg shadow-md`}>
        {/* Card Header */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className={`${shimmerBg} ${shimmerAnimation} inline-block w-20 h-5 rounded-full`}></div>
              <div className={`${shimmerBg} ${shimmerAnimation} h-6 w-48 rounded`}></div>
            </div>
          </div>
        </div>
  
        {/* Card Content */}
        <div className={`px-4 pb-4 border-b ${borderColor}`}>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className={`${shimmerBg} ${shimmerAnimation} mr-2 h-4 w-4 rounded-full`}></div>
              <div className={`${shimmerBg} ${shimmerAnimation} h-4 w-32 rounded`}></div>
            </div>
            <div className="flex items-center">
              <div className={`${shimmerBg} ${shimmerAnimation} mr-2 h-4 w-4 rounded-full`}></div>
              <div className={`${shimmerBg} ${shimmerAnimation} h-4 w-24 rounded`}></div>
            </div>
          </div>
        </div>
  
        {/* Card Footer */}
        <div className={`flex justify-between items-center p-4 ${footerBg}`}>
          <div className={`${shimmerBg} ${shimmerAnimation} h-4 w-28 rounded`}></div>
          <div className={`${shimmerBg} ${shimmerAnimation} h-4 w-24 rounded`}></div>
        </div>
      </div>
    );
  };