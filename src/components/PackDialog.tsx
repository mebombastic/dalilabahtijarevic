import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Check, ChevronLeft, ChevronRight, Sparkles, Minus, Plus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

export type PackMedia = { type: "image" | "video"; src: string; poster?: string };

export type Pack = {
  name: string;
  tagline: string;
  price: string;
  media: PackMedia[];
  desc: string;
  perfect: string;
  items: string[];
  popular?: boolean;
};

// EDIT THESE: shared FAQ shown inside every pack popup. Keep generic & honest.
const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I place an order?",
    a: "Fill the short form on the right with your name, email and quantity. It opens your email app with the pack details prefilled — just press send.",
  },
  {
    q: "Can I change or combine packs?",
    a: "Yes. If you'd like a different combination or quantity, mention it in your message and we'll come back to you.",
  },
  {
    q: "When can I start?",
    a: "As soon as your order is confirmed and your products arrive. We'll guide you through the first steps personally.",
  },
];

const orderSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Please enter a valid email").max(160),
  quantity: z.number().int().min(1).max(20),
});

const MediaCarousel = ({ media, alt }: { media: PackMedia[]; alt: string }) => {
  const [idx, setIdx] = useState(0);
  const cur = media[idx];
  const go = (d: number) => setIdx((i) => (i + d + media.length) % media.length);
  return (
    <div className="relative w-full h-full bg-secondary/30">
      {cur.type === "video" ? (
        <video key={cur.src} src={cur.src} poster={cur.poster} controls autoPlay muted loop playsInline className="w-full h-full object-contain md:object-cover" />
      ) : (
        <img key={cur.src} src={cur.src} alt={alt} className="w-full h-full object-contain md:object-cover" />
      )}
      {media.length > 1 && (
        <>
          <button onClick={() => go(-1)} aria-label="Previous" className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 inline-flex items-center justify-center bg-background/80 backdrop-blur border border-gold/40 text-gold hover:bg-gold hover:text-primary-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => go(1)} aria-label="Next" className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 inline-flex items-center justify-center bg-background/80 backdrop-blur border border-gold/40 text-gold hover:bg-gold hover:text-primary-foreground transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {media.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} aria-label={`Media ${i + 1}`} className={`h-1.5 w-6 transition-colors ${i === idx ? "bg-gold" : "bg-background/60 border border-gold/40"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const PackDialog = ({
  pack,
  open,
  onOpenChange,
}: {
  pack: Pack | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // reset when reopening
  useEffect(() => {
    if (open) { setQty(1); setName(""); setEmail(""); setSubmitted(false); }
  }, [open, pack?.name]);

  if (!pack) return null;

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = orderSchema.safeParse({ name, email, quantity: qty });
    if (!result.success) {
      toast({
        title: "Check your details",
        description: result.error.errors[0]?.message ?? "Please review the form.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("pack_orders").insert({
      pack_name: pack.name,
      customer_name: result.data.name,
      customer_email: result.data.email,
      quantity: result.data.quantity,
      listed_price: pack.price,
    });
    setSubmitting(false);

    if (error) {
      toast({
        title: "Couldn't send your request",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }

    setSubmitted(true);
    toast({
      title: "Request received",
      description: `We'll get back to you shortly at ${result.data.email}.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[calc(100vw-1rem)] sm:w-full p-0 gap-0 bg-background border border-gold/30 rounded-none overflow-hidden max-h-[95vh] sm:rounded-none">
        <DialogTitle className="sr-only">{pack.name}</DialogTitle>
        <DialogDescription className="sr-only">{pack.tagline}</DialogDescription>

        <div className="grid max-h-[95vh] min-h-0 md:grid-cols-2 overflow-y-auto md:overflow-hidden">
          {/* MEDIA */}
          <div className="relative h-[34vh] max-h-64 min-h-48 md:h-[95vh] md:max-h-none overflow-hidden border-b border-border md:border-b-0">
            <MediaCarousel media={pack.media} alt={pack.name} />
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 max-w-[calc(100%-3.5rem)]">
              <span className="px-2.5 py-1 bg-background/85 backdrop-blur font-body text-[10px] tracking-luxe uppercase text-gold border border-gold/40">Ready</span>
              {pack.popular && (
                <span className="px-2.5 py-1 bg-gold font-body text-[10px] tracking-luxe uppercase text-primary-foreground inline-flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" /> Popular
                </span>
              )}
            </div>
          </div>

          {/* DETAILS */}
          <div className="relative z-10 bg-background md:overflow-y-auto p-5 sm:p-8 md:p-12 flex flex-col min-w-0">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-gold" />
              <span className="font-body text-[10px] tracking-luxe uppercase text-gold">The Pack</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl leading-[1.1] mb-3 break-words">{pack.name}</h2>
            <p className="font-script text-lg sm:text-xl text-gold mb-5">{pack.tagline}</p>

            <div className="flex items-baseline gap-3 mb-7">
              <span className="font-display text-3xl sm:text-4xl md:text-5xl gold-text">{pack.price}</span>
            </div>

            <div className="gold-divider mb-8" />

            <p className="font-body text-sm text-foreground/80 leading-relaxed mb-8">{pack.desc}</p>

            <div className="mb-8">
              <div className="font-body text-[10px] tracking-luxe uppercase text-gold mb-2">Perfect For</div>
              <p className="font-body text-sm text-foreground/80">{pack.perfect}</p>
            </div>

            <div className="mb-10">
              <div className="font-body text-[10px] tracking-luxe uppercase text-gold mb-3">What's Included</div>
              <ul className="space-y-3">
                {pack.items.map((it) => (
                  <li key={it} className="flex gap-3 font-body text-sm text-foreground/85">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center border border-gold/60 shrink-0">
                      <Check className="h-3 w-3 text-gold" strokeWidth={2.5} />
                    </span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>

            {/* ORDER FORM */}
            {submitted ? (
              <div className="border border-gold/40 p-6 mb-8 bg-secondary/20 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center border border-gold mb-4">
                  <Check className="h-5 w-5 text-gold" strokeWidth={2.5} />
                </div>
                <div className="font-display text-2xl mb-2">Request received</div>
                <p className="font-body text-sm text-foreground/75">
                  Thank you, {name.split(" ")[0] || "friend"}. We'll be in touch at <span className="text-gold">{email}</span> soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleOrder} className="border border-gold/30 p-6 mb-8 bg-secondary/20">
                <div className="font-body text-[10px] tracking-luxe uppercase text-gold mb-4">Request This Pack</div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="pd-name" className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground">Name</Label>
                    <Input id="pd-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required disabled={submitting} className="mt-1 rounded-none border-border focus:border-gold" />
                  </div>
                  <div>
                    <Label htmlFor="pd-email" className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground">Email</Label>
                    <Input id="pd-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={160} required disabled={submitting} className="mt-1 rounded-none border-border focus:border-gold" />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-5">
                  <Label className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground">Quantity</Label>
                  <div className="inline-flex items-center border border-border">
                    <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={submitting} aria-label="Decrease" className="h-9 w-9 inline-flex items-center justify-center hover:text-gold transition-colors disabled:opacity-50">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center font-display text-lg">{qty}</span>
                    <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} disabled={submitting} aria-label="Increase" className="h-9 w-9 inline-flex items-center justify-center hover:text-gold transition-colors disabled:opacity-50">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={submitting} className="btn-shine w-full bg-gold text-primary-foreground hover:bg-gold/90 rounded-2xl font-body text-xs tracking-luxe uppercase h-12 shadow-gold">
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending</>
                  ) : "Send Request"}
                </Button>
                <p className="font-body text-[10px] text-muted-foreground mt-3 text-center">
                  Your request is saved securely. We'll reply by email.
                </p>
              </form>
            )}

            {/* FAQ */}
            <div className="mb-2">
              <div className="font-body text-[10px] tracking-luxe uppercase text-gold mb-3">Questions</div>
              <Accordion type="single" collapsible className="border-t border-border">
                {FAQS.map((f, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-b border-border">
                    <AccordionTrigger className="font-body text-sm text-left hover:text-gold hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-sm text-foreground/75 leading-relaxed">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
