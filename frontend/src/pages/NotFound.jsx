export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center animate-fade-in-down">
                {/* Large 404 Number */}
                <h1 className="text-9xl font-bold text-gray-800 mb-4 animate-bounce-in">404</h1>

                {/* Error Message */}
                <h2 className="text-3xl font-semibold text-gray-700 mb-4">Page Not Found</h2>

                {/* Description */}
                <p className="text-gray-600 mb-8">
                    Oops! It seems we've wandered off the path. The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Back to Home Button */}
                <a
                    href="/"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium
                        hover:bg-blue-700 transition-colors duration-300 animate-pulse-subtle"
                >
                    Return to Home
                </a>
            </div>
        </div>
    );
}