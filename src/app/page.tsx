import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Shield, 
  ArrowRight,
  Upload,
  LineChart,
  Target
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link className="flex items-center gap-2 font-bold text-xl" href="/">
            <BarChart3 className="h-6 w-6 text-primary" />
            KLOB
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/contact">
              <Button size="sm">Request Demo</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-muted-foreground">
                🚀 Now in Beta — Early Access Available
              </div>
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Turn Your Data Into
                  <span className="text-primary"> Growth</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 text-lg md:text-xl">
                  KLOB gives you the insights you need to make smarter business decisions. 
                  Upload your data, get actionable analytics, and watch your business thrive.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" className="gap-2">
                    Request a Demo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg">
                    See How It Works
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                No credit card required • Free consultation
              </p>
            </div>
          </div>
        </section>

        {/* Logos/Social Proof Section */}
        <section className="w-full py-12 border-y bg-gray-50/50">
          <div className="container mx-auto px-4 md:px-6">
            <p className="text-center text-sm font-medium text-muted-foreground mb-8">
              TRUSTED BY FORWARD-THINKING BUSINESSES
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
              {/* Placeholder logos - replace with real ones later */}
              <div className="text-2xl font-bold text-gray-400">Acme Corp</div>
              <div className="text-2xl font-bold text-gray-400">TechStart</div>
              <div className="text-2xl font-bold text-gray-400">RetailPro</div>
              <div className="text-2xl font-bold text-gray-400">GrowthCo</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Everything You Need to Grow
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 text-lg">
                Powerful tools designed for businesses that want to make data-driven decisions without the complexity.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<BarChart3 className="h-10 w-10" />}
                title="Real-Time Analytics"
                description="Get instant insights into your sales, revenue, and performance metrics."
              />
              <FeatureCard
                icon={<TrendingUp className="h-10 w-10" />}
                title="Smart Forecasting"
                description="AI-powered predictions to help you plan inventory and resources."
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10" />}
                title="Instant Setup"
                description="Upload your data and start seeing insights in minutes, not weeks."
              />
              <FeatureCard
                icon={<Shield className="h-10 w-10" />}
                title="Enterprise Security"
                description="Your data is encrypted and protected with bank-level security."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-20 md:py-32 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                How It Works
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 text-lg">
                Get started in three simple steps
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              <StepCard
                number="1"
                icon={<Upload className="h-8 w-8" />}
                title="Upload Your Data"
                description="Simply drag and drop your sales data. We support Excel, CSV, and more."
              />
              <StepCard
                number="2"
                icon={<LineChart className="h-8 w-8" />}
                title="Get Insights"
                description="Our platform instantly analyzes your data and generates actionable reports."
              />
              <StepCard
                number="3"
                icon={<Target className="h-8 w-8" />}
                title="Grow Your Business"
                description="Make informed decisions backed by data to accelerate your growth."
              />
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="w-full py-20 md:py-32 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your Business?
              </h2>
              <p className="mx-auto max-w-[600px] text-primary-foreground/80 text-lg">
                Join hundreds of businesses already using KLOB to make smarter decisions.
              </p>
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="gap-2">
                  Get Started Today
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <Link className="flex items-center gap-2 font-bold text-xl" href="/">
                <BarChart3 className="h-6 w-6 text-primary" />
                KLOB
              </Link>
              <p className="text-sm text-muted-foreground">
                Business analytics and forecasting made simple.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/contact" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} KLOB. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="text-center border-0 shadow-none bg-transparent">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

function StepCard({ number, icon, title, description }: { number: string, icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="relative flex flex-col items-center text-center p-6">
      <div className="absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
        {number}
      </div>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
