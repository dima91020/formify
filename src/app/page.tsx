import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import LiquidMateria from "@/components/builder/LiquidMateria";
import VideoShowcase from "@/components/landing/VideoShowcase";

const FEATURES = [
  {
    id: "01",
    tag: "JSON SCHEMA",
    title: "Dynamic Survey Engine",
    description: "Build highly customizable forms using a JSON-driven architecture that adapts to any complex data schema in real time.",
    colSpan: "sm:col-span-2 lg:col-span-2",
    isRow: true,
    hint: (
      <div className="p-3.5 rounded-xl bg-zinc-950 text-zinc-300 font-mono text-xs border border-zinc-800 space-y-1.5 w-full md:w-64">
        <div className="flex justify-between border-b border-zinc-800 pb-1 text-[10px] text-zinc-500">
          <span>schema.json</span>
          <span className="text-emerald-400">VALID</span>
        </div>
        <pre className="text-[11px] leading-tight">{`{\n  "version": "2.0",\n  "strict": true,\n  "dynamic": true\n}`}</pre>
      </div>
    ),
  },
  {
    id: "02",
    tag: "MULTI-LOGIC",
    title: "Advanced Branching",
    description: "Design sophisticated user flows with multi-level conditional logic, routing participants based on their previous answers.",
    hintContent: (
      <>
        <span>if (rating &lt; 3)</span>
        <span className="text-zinc-400">➔ goto(Q4)</span>
      </>
    ),
  },
  {
    id: "03",
    tag: "WEBSOCKETS",
    title: "Live Sentiment & NPS",
    description: "Monitor customer satisfaction metrics instantly with WebSocket-powered dashboards that update without page reloads.",
    hintContent: (
      <>
        <span className="flex items-center gap-1.5 text-zinc-900 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> CSAT 4.9/5
        </span>
        <span className="text-emerald-600 font-medium">LIVE</span>
      </>
    ),
  },
  {
    id: "04",
    tag: "AUTH / RBAC",
    title: "Role-Based Access",
    description: "Manage team permissions securely with enterprise-grade authentication, ensuring granular control over workspaces and analytics.",
    hintContent: (
      <>
        <span>admin: full_access</span>
        <span className="text-zinc-400">member: read</span>
      </>
    ),
  },
  {
    id: "05",
    tag: "REST & WEBHOOKS",
    title: "Developer API & Webhooks",
    description: "Integrate seamlessly with your existing infrastructure. Trigger real-time webhooks on new submissions and manage data programmatically.",
    hintContent: (
      <>
        <span className="text-blue-600 font-medium">POST</span>
        <span className="text-zinc-500">/api/v1/webhooks</span>
      </>
    ),
  },
  {
    id: "06",
    tag: "PG INDEXING",
    title: "High-Performance Export",
    description: "Process thousands of responses instantly. Optimized database indexing ensures fast data aggregations and exports to CSV or JSON formats.",
    hintContent: (
      <>
        <span>formats:</span>
        <span className="text-zinc-900 font-medium">CSV • JSON • XLSX</span>
      </>
    ),
  },
];

const PRICING_TIERS = [
  {
    id: "community",
    typeTag: "SELF-HOSTED",
    title: "Community",
    description: "Perfect for solo developers and personal projects.",
    price: "$0",
    oldPrice: null,
    period: "/ forever",
    features: [
      "Unlimited forms & questions",
      "Up to 1,000 responses / mo",
      "Basic analytics & CSV export",
      "Community GitHub support"
    ],
    buttonText: "Deploy Now",
    buttonHref: "/login",
    buttonVariant: "outline" as const,
    isPopular: false,
    bgClass: "bg-white",
  },
  {
    id: "pro-cloud",
    typeTag: "CLOUD HOSTED",
    title: "Pro Cloud",
    description: "Zero-setup cloud instance for growing teams and startups.",
    oldPrice: "$49",
    price: "$0",
    period: "/ forever",
    features: [
      "Everything in Community",
      "Unlimited responses & storage",
      "Conditional logic & branching",
      "Real-time Webhooks & API",
      "High-five from author"
    ],
    buttonText: "Start Free Cloud",
    buttonHref: "/login",
    buttonVariant: "default" as const,
    isPopular: true,
    bgClass: "bg-zinc-50/70"
  },
  {
    id: "sponsor",
    typeTag: "OPEN SOURCE",
    title: "Sponsor & Scale",
    description: "For organization teams wanting custom domains & RBAC.",
    oldPrice: "$999",
    price: "$0",
    period: "/ forever",
    features: [
      "Everything in Pro Cloud",
      "Custom domain integration",
      "Role-Based Access (RBAC)",
      "\"Why pay when it's free?\""
    ],
    buttonText: "Star on GitHub ⭐",
    buttonHref: "https://github.com/dima91020/formify",
    buttonVariant: "outline" as const,
    isPopular: false,
    bgClass: "bg-white"
  },
];

export default function HomePage() {
  const linkStyles = "text-sm font-medium text-muted-foreground hover:text-foreground hover:underline transition-colors";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-sm">
        <div className="container flex justify-between mx-auto h-14 items-center px-4 md:px-8">
          <div className="flex gap-2 items-center">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold tracking-tighter">Formify</span>
          </div>

          <nav className="hidden md:flex gap-6">
            <Link href="#features" className={linkStyles}>Features</Link>
            <Link href="#pricing" className={linkStyles}>Pricing</Link>
            <Link href="#docs" className={linkStyles}>Docs</Link>
          </nav>

          <div className="flex gap-4 items-center">
            <Link href="/login" className={`hidden md:block ${linkStyles}`}>Log in</Link>
            <Button asChild size="lg" className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all font-medium text-sm px-5 py-2">
              <Link href="/">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        <section className="container mx-auto py-24 space-y-16 px-4 md:px-8">
          <div className="space-y-4 max-w-3xl text-left w-full">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-8xl text-zinc-900 leading-[1.08]">
              Create smart forms. <br />
              Collect insights instantly.
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              A fast, minimalist form builder with real-time analytics, conditional logic, and zero hidden fees.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2 items-stretch sm:items-center">
              <Button asChild size="lg" className="rounded-xl px-8 py-6 text-base bg-zinc-900 text-white hover:bg-zinc-800 transition-all font-medium shadow-sm">
                <Link href="/login">Create Your First Form</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl px-8 py-6 text-base border-zinc-300 text-zinc-800 hover:bg-zinc-100 transition-all font-medium">
                <Link href="#preview">View Demo</Link>
              </Button>
            </div>
          </div>

          <div id="preview" className="flex flex-col w-full max-w-5xl ml-auto rounded-2xl bg-zinc-950 p-8 sm:p-12 space-y-8 text-left">
            <div className="flex items-center justify-between w-full pb-6 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-zinc-800"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-zinc-800"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-zinc-800"></div>

                <span className="ml-4 text-sm text-zinc-400 font-mono">formify.app / customer-experience-survey</span>
              </div>

              <span className="text-xs text-zinc-400 font-mono tracking-wider">LIVE PREVIEW</span>
            </div>

            <div className="grid md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-8 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Question 1 of 3</span>
                  <h3 className="text-2xl text-white font-semibold tracking-tight">How likely are you to recommend Formify to a colleague?</h3>
                  <p className="text-sm text-zinc-400">Your feedback helps us continuously improve our service.</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-5 gap-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div key={n} className={`text-center py-4 rounded-xl font-semibold text-base border
                        ${n === 5 ? "bg-white text-zinc-950 border-white font-bold shadow-lg" : "bg-zinc-900/80 text-zinc-400 border-zinc-800"}`}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Additional Feedback</label>
                  <div className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-400 text-sm font-sans p-4 rounded-xl">
                    Tell us what you loved or what we can improve...
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button size="lg" className="rounded-xl px-8 bg-white text-zinc-950 hover:bg-zinc-200 font-medium text-sm">
                    Submit Response
                  </Button>
                </div>
              </div>

              <div className="md:col-span-4 space-y-6 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Form stats</div>

                <div className="space-y-4">
                  <div>
                    <div className="text-white text-3xl font-bold tracking-tight">2,840</div>
                    <div className="text-zinc-400 text-xs mt-1">Total Submissions</div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800">
                    <div className="text-white text-3xl font-bold tracking-tight">4.9 / 5</div>
                    <div className="text-zinc-400 text-xs mt-1">Average Satisfaction Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-zinc-200/80 bg-zinc-50/50 py-24">
          <div className="container mx-auto px-4 md:px-8 space-y-16">
            <div className="space-y-4 max-w-2xl text-left">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Feuteres</span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900">
                Everything you need to build powerful forms.
              </h2>
              <p className="text-lg text-zinc-600 font-normal leading-relaxed">
                Designed for speed, simplicity, and complete control over your data.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature) => (
                <Card
                  key={feature.id}
                  className={`p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200/90 shadow-sm hover:border-zinc-400 transition-colors text-left flex flex-col justify-between gap-6 ${feature.colSpan || ''} ${feature.isRow ? 'md:flex-row md:items-center' : ''}`}
                >
                  <CardHeader className="p-0 space-y-3 w-full flex-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400 font-medium">{feature.id}</span>
                      <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-[10px] font-mono font-medium text-zinc-600">
                        {feature.tag}
                      </span>
                    </div>
                    <CardTitle className="font-semibold text-zinc-900 text-lg tracking-normal">{feature.title}</CardTitle>
                    <CardDescription className="text-sm text-zinc-500 leading-relaxed font-normal">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  {feature.hint && (
                    <CardContent className="p-0 w-full md:w-auto shrink-0">
                      {feature.hint}
                    </CardContent>
                  )}
                  {feature.hintContent && (
                    <CardContent className="p-0 w-full mt-4">
                      <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80 font-mono text-[11px] text-zinc-600 flex items-center justify-between w-full">
                        {feature.hintContent}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        <VideoShowcase />

        <section id="pricing" className="border-t border-zinc-200/80 bg-zinc-50/50 py-24">
          <div className="container mx-auto px-4 md:px-8 space-y-16">
            <div className="space-y-4 text-left max-w-2xl">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Pricing</span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900">
                Simple, transparent pricing. 100% <br /> free.
              </h2>
              <p className="text-lg text-zinc-600 font-normal leading-relaxed">Formify is open-source and free forever. No credit card required.</p>
            </div>

            <div className="rounded-3xl border border-zinc-200/90 bg-white shadow-sm overflow-hidden grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200/90 text-left items-stretch">
              {PRICING_TIERS.map((pricing_tier) => (
                <Card key={pricing_tier.id} className={`rounded-none border-0 shadow-none p-8 sm:p-10 flex flex-col justify-between space-y-8 relative ${pricing_tier.bgClass}`}>
                  <CardHeader className="p-0 space-y-3">
                    <div className={`flex items-center ${pricing_tier.isPopular ? 'justify-between' : ''}`}>
                      <span className={`text-xs px-2.5 py-0.5 rounded-md ${pricing_tier.isPopular ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'} text-[10px] font-mono font-medium border border-zinc-200`}>{pricing_tier.typeTag}</span>
                      {pricing_tier.isPopular && (
                        <span className="px-2.5 py-0.5 rounded-full bg-zinc-200 border border-zinc-300 text-[10px] font-mono font-medium text-zinc-800">
                          MOST POPULAR
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xl text-zinc-900 font-semibold tracking-normal mt-3">{pricing_tier.title}</CardTitle>
                    <CardDescription className="text-sm text-zinc-500 leading-relaxed font-normal mt-1">{pricing_tier.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="p-0 flex flex-col justify-between flex-1 space-y-8 mt-6">
                    <div className="space-y-6">
                      <div className="flex items-baseline gap-2 pt-2 border-t border-zinc-100">
                        {pricing_tier.oldPrice && (
                          <span className="text-sm font-mono text-zinc-400 line-through">
                            {pricing_tier.oldPrice}
                          </span>
                        )}
                        <span className="text-5xl font-extrabold tracking-tight text-zinc-900">{pricing_tier.price}</span>
                        <span className="text-sm text-zinc-500 font-medium">{pricing_tier.period}</span>
                      </div>

                      <ul className="space-y-3 pt-2 text-sm text-zinc-600 font-medium">
                        {pricing_tier.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button asChild size="lg" variant={pricing_tier.buttonVariant} className="w-full rounded-xl py-6 text-sm font-medium transition-all">
                      <Link href={pricing_tier.buttonHref}>{pricing_tier.buttonText}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LiquidMateria />
    </div>
  );
}
