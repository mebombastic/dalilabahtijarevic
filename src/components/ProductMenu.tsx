import { useRef, useState, type CSSProperties } from "react";
import { Check, Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ProductImage = { src: string; label?: string; color?: string };
export type Product = {
  name: string;
  subtitle: string;
  category: string;
  desc: string;
  facts: string[];
  images: ProductImage[];
  /** "cutout" = transparent product shot on a soft stage, "photo" = full-bleed photo */
  kind: "cutout" | "photo";
  note?: string;
  badge?: string;
};

const ProductCard = ({ p, index, dmUrl, profileUrl, textMe }: { p: Product; index: number; dmUrl: string; profileUrl: string; textMe: string }) => {
  const [img, setImg] = useState(0);
  const current = p.images[img];
  return (
    <article
      className="animate-blur-up group shrink-0 w-[84%] sm:w-[60%] md:w-auto snap-center flex flex-col rounded-3xl border border-border bg-background overflow-hidden hover:border-gold/50 hover:shadow-soft transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1.5"
      style={{ animationDelay: `${index * 0.07}s`, animationDuration: "0.8s" }}
    >
      <div className={`relative aspect-[4/5] overflow-hidden ${p.kind === "cutout" ? "bg-[radial-gradient(70%_60%_at_50%_60%,hsl(var(--gold)/0.22),transparent_70%),linear-gradient(180deg,hsl(37_45%_94%),hsl(36_32%_85%))] dark:bg-[radial-gradient(70%_60%_at_50%_60%,hsl(var(--gold)/0.22),transparent_70%),linear-gradient(180deg,hsl(162_40%_12%),hsl(162_45%_7%))]" : "bg-secondary"}`}>
        {p.kind === "cutout" ? (
          <>
            <div className="absolute left-1/2 bottom-[9%] -translate-x-1/2 w-[70%] h-[8%] rounded-[50%] bg-black/25 blur-xl" />
            <img
              key={current.src}
              src={current.src}
              alt={`${p.name}${current.label ? ` – ${current.label}` : ""}`}
              loading="lazy"
              className="absolute inset-x-0 mx-auto bottom-[11%] h-[74%] w-auto max-w-[86%] object-contain drop-shadow-[0_20px_22px_rgba(0,0,0,0.3)] transition-transform duration-700 ease-luxe group-hover:-translate-y-2 group-hover:scale-[1.04] animate-blur-up"
              style={{ animationDuration: "0.5s" }}
            />
          </>
        ) : (
          <img src={current.src} alt={p.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-luxe group-hover:scale-105" />
        )}
        <span className="absolute top-4 left-4 rounded-full bg-background/85 backdrop-blur px-3 py-1 font-body text-[9px] tracking-luxe uppercase text-gold border border-gold/40">{p.category}</span>
        {p.badge && <span className="absolute top-4 right-4 rounded-full bg-vermilion px-3 py-1 font-body text-[9px] tracking-luxe uppercase text-white">{p.badge}</span>}
        {p.images.length > 1 && (
          <div className="absolute bottom-3 inset-x-0 flex flex-wrap justify-center gap-1.5 px-4">
            {p.images.map((im, i) => (
              <button
                key={im.src}
                type="button"
                aria-label={im.label}
                title={im.label}
                onClick={() => setImg(i)}
                className={`h-5 w-5 rounded-full border-2 transition-transform ${i === img ? "border-gold scale-110" : "border-background/80 hover:scale-110"}`}
                style={{ background: im.color }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-6 md:p-7 flex-1 flex flex-col">
        <h3 className="font-display text-2xl md:text-[1.7rem] leading-tight">{p.name}</h3>
        <p className="font-body text-[10px] tracking-luxe uppercase text-gold mt-1 mb-4">{current.label ?? p.subtitle}</p>
        <p className="font-body text-sm text-foreground/75 leading-relaxed mb-5">{p.desc}</p>
        <ul className="space-y-2 mb-6">
          {p.facts.map((f) => (
            <li key={f} className="flex gap-2.5 font-body text-[13px] text-foreground/80">
              <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" strokeWidth={2} /> {f}
            </li>
          ))}
        </ul>
        {p.note && <p className="font-body text-[11px] text-muted-foreground italic mb-5">{p.note}</p>}
        <div className="mt-auto flex items-center gap-3">
          <Button asChild className="flex-1 rounded-full font-body text-[11px] tracking-luxe uppercase h-11 bg-foreground text-background hover:bg-gold hover:text-primary-foreground">
            <a href={dmUrl} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> {textMe}</a>
          </Button>
          <a href={profileUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram @dalilafitlife" className="h-11 w-11 shrink-0 inline-flex items-center justify-center rounded-full border border-border hover:border-gold hover:text-gold transition-colors">
            <Instagram className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
};

/** Filterable product menu: category tabs, product cards, swipe rail on phones. */
export const ProductMenu = ({
  products, dmUrl, profileUrl, allLabel = "All", textMe = "Text Me", showTabs = true,
}: { products: Product[]; dmUrl: string; profileUrl: string; allLabel?: string; textMe?: string; showTabs?: boolean }) => {
  const cats = [allLabel, ...Array.from(new Set(products.map((p) => p.category)))];
  const [cat, setCat] = useState(allLabel);
  const shown = cat === allLabel ? products : products.filter((p) => p.category === cat);
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const onScroll = () => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };
  const pick = (c: string) => {
    setCat(c);
    setProgress(0);
    railRef.current?.scrollTo({ left: 0 });
  };

  return (
    <>
      {showTabs && <div className="no-scrollbar flex md:flex-wrap md:justify-center gap-2 overflow-x-auto -mx-5 px-5 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 mb-10 md:mb-14">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => pick(c)}
            className={`shrink-0 rounded-full px-5 py-2.5 font-body text-[10px] tracking-luxe uppercase border transition-all duration-300 ${c === cat ? "bg-gold text-primary-foreground border-gold shadow-gold" : "border-border text-foreground/70 hover:border-gold/60 hover:text-gold"}`}
          >
            {c}
          </button>
        ))}
      </div>}

      <div
        key={cat}
        ref={railRef}
        onScroll={onScroll}
        className="no-scrollbar flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-5 px-5 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 pb-6 md:pb-0"
      >
        {shown.map((p, i) => (
          <ProductCard key={p.name} p={p} index={i} dmUrl={dmUrl} profileUrl={profileUrl} textMe={textMe} />
        ))}
      </div>
      {shown.length > 1 && (
        <div className="md:hidden mx-auto mt-2 h-[3px] w-40 rounded-full bg-border overflow-hidden">
          <div className="h-full rounded-full bg-gold transition-[width] duration-200" style={{ width: `${Math.max(1 / shown.length, progress) * 100}%` } as CSSProperties} />
        </div>
      )}
    </>
  );
};
