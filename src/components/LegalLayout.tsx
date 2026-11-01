import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const LegalLayout = ({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) => (
  <div className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border py-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 font-body text-[10px] tracking-luxe uppercase text-muted-foreground hover:text-gold transition-colors">
          <ArrowLeft className="h-3 w-3" /> Back to home
        </Link>
        <span className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground">Dalila Bahtijarevic</span>
      </div>
    </header>
    <main className="container mx-auto max-w-3xl py-20">
      <p className="font-body text-[10px] tracking-luxe uppercase text-gold mb-3">Legal</p>
      <h1 className="font-display text-5xl md:text-6xl mb-3">{title}</h1>
      <p className="font-body text-xs text-muted-foreground mb-12">Last updated: {updated}</p>
      <article className="prose-legal font-body text-foreground/85 leading-relaxed space-y-6 text-[15px]">
        {children}
      </article>
    </main>
    <footer className="border-t border-border py-8">
      <div className="container mx-auto text-center">
        <p className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground">© 2026 Dalila Bahtijarevic · All rights reserved</p>
      </div>
    </footer>
  </div>
);

export const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-2xl mt-10 mb-3 text-foreground">{children}</h2>
);
