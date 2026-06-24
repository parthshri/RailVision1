import { Cpu, ImageIcon, TrainFront } from "lucide-react";

export function ProductVisual({
  label,
  imageUrl,
  variant = "kit"
}: {
  label: string;
  imageUrl?: string;
  variant?: "kit" | "pro";
}) {
  if (imageUrl) {
    return (
      <div className="product-visual has-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={label} />
      </div>
    );
  }

  return (
    <div className={`product-visual ${variant}`}>
      <div className="visual-grid" />
      <div className="visual-core">
        {variant === "pro" ? <TrainFront size={54} /> : <Cpu size={54} />}
      </div>
      <div className="visual-label">
        <ImageIcon size={16} />
        <span>{label} image placeholder</span>
      </div>
    </div>
  );
}
