import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3 } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { GitMerge, Activity, ServerCrash } from "lucide-react";

export default function HomePage() {
  const linkStyles = 'text-sm font-medium text-muted-foreground hover:text-foreground hover:underline transition-colors';

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex justify-between mx-auto h-14 items-center px-4 md:px-8">
          <div className="flex gap-2 items-center">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold tracking-tighter">Formify</span>
          </div>

          <nav className="hidden md:flex gap-6">
            <Link href="#features" className={linkStyles}>Features</Link>
            <Link href="#pricing" className={linkStyles}>Pricing</Link>
          </nav>

          <div className="flex gap-4 items-center">
            <Link
              href="/login"
              className={`hidden md:block ${linkStyles}`}
            >
              Log in
            </Link>
            <Button asChild size="sm"> 
              <Link href="/">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="w-full flex-1">
        
      </main>
    </div>
  );
}