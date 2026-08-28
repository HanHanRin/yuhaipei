import Image from "next/image";
import { asset } from "@/components/portfolio/data";

export type EditorialMediaItem = {
  src: string;
  alt: string;
  label?: string;
  objectPosition?: string;
  /** cover 裁切填满；contain 完整露出画面（品牌截图窄屏用） */
  fit?: "cover" | "contain";
};

export type EditorialMediaVariant =
  | "dashboard"
  | "collage"
  | "citations"
  | "phones"
  | "flows"
  | "poster"
  | "company";

type Props = {
  items: readonly EditorialMediaItem[];
  variant: EditorialMediaVariant;
  credit?: string;
  compact?: boolean;
  className?: string;
};

const IMAGE_SIZES: Record<EditorialMediaVariant, string> = {
  dashboard: "(max-width: 860px) 82vw, 42vw",
  collage: "(max-width: 860px) 82vw, 42vw",
  citations: "(max-width: 860px) 82vw, 42vw",
  phones: "(max-width: 860px) 34vw, 14vw",
  flows: "(max-width: 860px) 86vw, 46vw",
  poster: "(max-width: 860px) 70vw, 30vw",
  company: "(max-width: 860px) 82vw, 28vw",
};

export default function EditorialMedia({
  items,
  variant,
  credit,
  compact = false,
  className = "",
}: Props) {
  return (
    <figure
      className={`editorial-media editorial-media--${variant}${
        compact ? " is-compact" : ""
      } ${className}`.trim()}
    >
      <div className="editorial-media-grid">
        {items.map((item, index) => (
          <div
            className={`editorial-media-item editorial-media-item-${index + 1}`}
            key={item.src}
          >
            <Image
              src={asset(item.src)}
              alt={item.alt}
              fill
              sizes={IMAGE_SIZES[variant]}
              style={{
                objectFit: item.fit ?? "cover",
                objectPosition: item.objectPosition ?? "center",
              }}
            />
            {item.label ? (
              <span className="editorial-media-label">{item.label}</span>
            ) : null}
          </div>
        ))}
      </div>
      {credit ? <figcaption>{credit}</figcaption> : null}
    </figure>
  );
}
