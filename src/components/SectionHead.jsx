export default function SectionHead({ eyebrow, title, sub, center = true }) {
  return (
    <div className={`mb-10 max-w-2xl md:mb-14 ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight text-primary-900 md:text-4xl">{title}</h2>
      {sub && <p className="mt-3 leading-relaxed text-ink/60">{sub}</p>}
    </div>
  );
}