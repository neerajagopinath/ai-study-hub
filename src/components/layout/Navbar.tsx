import { BookOpen, User, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Dashboard", path: "/" },
  { name: "Tools", path: "/tools" },
  { name: "About", path: "/about" },
];

export function Navbar() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50
        w-full border-b border-border/40
        bg-background/80 backdrop-blur-xl
        supports-[backdrop-filter]:bg-background/60
      "
    >
      <div className="container flex h-16 items-center justify-between">

        {/* ------------------------------------------------------------------ */}
        {/*                               BRAND                                 */}
        {/* ------------------------------------------------------------------ */}
        <Link to="/" className="flex items-center gap-3 group select-none">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-105">
            <BookOpen className="h-5 w-5" />
          </div>

          <div className="leading-tight">
            <span className="block text-base font-semibold tracking-tight text-foreground">
              AI Study Companion
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              Study smarter. Not longer.
            </span>
          </div>
        </Link>

        {/* ------------------------------------------------------------------ */}
        {/*                           NAV LINKS                                 */}
        {/* ------------------------------------------------------------------ */}
        <nav className="relative hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.name}

                {/* Active underline */}
                {isActive && (
                  <span className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ------------------------------------------------------------------ */}
        {/*                         ACTION BUTTONS                              */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex items-center gap-2">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="
              relative flex h-9 w-9 items-center justify-center
              rounded-full bg-secondary/70 text-muted-foreground
              transition-all hover:bg-secondary hover:text-foreground
              focus:outline-none focus:ring-2 focus:ring-primary/40
            "
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>

          {/* User Button (future dropdown ready) */}
          <button
            aria-label="User menu"
            className="
              flex h-9 w-9 items-center justify-center
              rounded-full bg-secondary/70 text-muted-foreground
              transition-all hover:bg-secondary hover:text-foreground
              focus:outline-none focus:ring-2 focus:ring-primary/40
            "
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
