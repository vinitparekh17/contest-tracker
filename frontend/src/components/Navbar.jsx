import { useState } from "react"
import ThemeSwitcher from "./themeSwitcher"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
<nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-neutral-900/80">
  <div className="container mx-auto flex h-16 items-center justify-between px-4">
    {/* Left Section: Logo and Mobile Menu Button */}
    <div className="flex items-center gap-4">
      <button
        className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <a href="/" className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m18 16 4-4-4-4" />
          <path d="m6 8-4 4 4 4" />
          <path d="m14.5 4-5 16" />
        </svg>
        <span>Contest Tracker</span>
      </a>
    </div>

    {/* Desktop Navigation */}
    <div className="hidden md:flex flex-1 justify-center">
      <div className="flex items-center gap-6">
        <a href="/" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Home
        </a>
        <a
          href="/bookmarks"
          className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center transition-colors"
        >
          Bookmarks
        </a>
        <a href="/about" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          About
        </a>
        <a href="/contact" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Contact
        </a>
        <ThemeSwitcher />
      </div>
    </div>
  </div>

  {/* Mobile Menu */}
  {isMenuOpen && (
    <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900">
      <div className="flex flex-col px-4 py-2 space-y-2">
        <a
          href="/"
          className="py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </a>
        <a
          href="/bookmarks"
          className="py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center"
          onClick={() => setIsMenuOpen(false)}
        >
          Bookmarks
          {bookmarkCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full">
              {bookmarkCount}
            </span>
          )}
        </a>
        <a
          href="/about"
          className="py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          onClick={() => setIsMenuOpen(false)}
        >
          About
        </a>
        <a
          href="/contact"
          className="py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          onClick={() => setIsMenuOpen(false)}
        >
          Contact
        </a>
      </div>
    </div>
  )}
</nav>
  )
}

