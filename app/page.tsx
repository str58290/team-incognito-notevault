import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Lock, Zap, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">NoteVault</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
              Your thoughts, organized and secure
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              NoteVault is a simple, elegant notes manager that keeps your ideas safe and accessible. 
              Write freely, find easily, and never lose a thought again.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Writing for Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Log in to Your Account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-card border-y border-border">
          <div className="max-w-6xl mx-auto px-4 py-20">
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-foreground mb-12">
              Everything you need, nothing you don&apos;t
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<FileText className="w-6 h-6" />}
                title="Simple & Clean"
                description="A distraction-free writing experience. Focus on your thoughts, not the interface."
              />
              <FeatureCard
                icon={<Lock className="w-6 h-6" />}
                title="Secure by Default"
                description="Your notes are private and protected. Only you can access your content."
              />
              <FeatureCard
                icon={<Zap className="w-6 h-6" />}
                title="Fast & Reliable"
                description="Instant sync across devices. Your notes are always up to date and available."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              Ready to start organizing your thoughts?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of users who trust NoteVault with their ideas.
            </p>
            <Link href="/signup" className="inline-block mt-8">
              <Button size="lg">
                Create Your Free Account
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <FileText className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">
                NoteVault &copy; {new Date().getFullYear()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with care for note-takers everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}
