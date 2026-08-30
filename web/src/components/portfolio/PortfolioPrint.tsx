"use client";

import { useEffect, type ReactNode } from "react";
import Cover from "@/components/sections/Cover";
import Resume from "@/components/sections/Resume";
import Internships, {
  INTERNSHIPS,
} from "@/components/sections/Internships";
import Projects from "@/components/sections/Projects";
import Life from "@/components/sections/Life";
import Closing from "@/components/sections/Closing";
import { chapters, type ChapterMeta } from "./data";

type PrintPageFrameProps = {
  chapter: ChapterMeta;
  detail: string;
  pageNumber: number;
  totalPages: number;
  children: ReactNode;
};

const internshipPageCount = INTERNSHIPS.reduce(
  (total, internship) => total + internship.projects.length,
  0,
);

const totalPages =
  chapters[0]!.slides.length +
  chapters[1]!.slides.length +
  internshipPageCount +
  chapters[3]!.slides.length +
  chapters[4]!.slides.length +
  chapters[5]!.slides.length;

function PrintPageFrame({
  chapter,
  detail,
  pageNumber,
  totalPages,
  children,
}: PrintPageFrameProps) {
  return (
    <section
      className={`pdf-export-page theme-${chapter.theme}`}
      data-chapter={chapter.id}
      aria-label={`${chapter.label} - ${detail}`}
    >
      <header className="pdf-page-topline" aria-hidden>
        <strong>
          YU<span>·</span>HAIPEI
        </strong>
        <p>
          {chapter.short} · {chapter.label} / {detail}
        </p>
      </header>
      <div className="pdf-page-content">{children}</div>
      <footer className="pdf-page-footer" aria-hidden>
        <span>PORTFOLIO / 2026</span>
        <span>
          {String(pageNumber).padStart(2, "0")} / {totalPages}
        </span>
      </footer>
    </section>
  );
}

export default function PortfolioPrint() {
  useEffect(() => {
    document.body.classList.add("pdf-export-body");

    const prepareImages = async () => {
      const images = Array.from(
        document.querySelectorAll<HTMLImageElement>(".pdf-export-root img"),
      );
      images.forEach((image) => {
        image.loading = "eager";
        image.fetchPriority = "high";
      });

      await document.fonts.ready;
      await Promise.all(
        images.map(async (image) => {
          if (!image.complete) {
            await new Promise<void>((resolve) => {
              image.addEventListener("load", () => resolve(), { once: true });
              image.addEventListener("error", () => resolve(), { once: true });
            });
          }
          await image.decode().catch(() => undefined);
        }),
      );

      document.documentElement.dataset.pdfReady = "true";
    };

    void prepareImages();
    return () => {
      document.body.classList.remove("pdf-export-body");
      delete document.documentElement.dataset.pdfReady;
    };
  }, []);

  let pageNumber = 0;

  return (
    <main className="pdf-export-root">
      <PrintPageFrame
        chapter={chapters[0]!}
        detail={chapters[0]!.slides[0]!.title}
        pageNumber={++pageNumber}
        totalPages={totalPages}
      >
        <Cover onEnterResume={() => undefined} />
      </PrintPageFrame>

      {chapters[1]!.slides.map((slide, slideIndex) => (
        <PrintPageFrame
          chapter={chapters[1]!}
          detail={slide.title}
          pageNumber={++pageNumber}
          totalPages={totalPages}
          key={slide.id}
        >
          <Resume slide={slideIndex} />
        </PrintPageFrame>
      ))}

      {INTERNSHIPS.flatMap((internship, companyIndex) =>
        internship.projects.map((project, projectIndex) => (
          <PrintPageFrame
            chapter={chapters[2]!}
            detail={`${internship.shortName} · ${project.title}`}
            pageNumber={++pageNumber}
            totalPages={totalPages}
            key={`${internship.id}-${project.id}`}
          >
            <Internships
              company={companyIndex}
              project={projectIndex}
              onCompanySelect={() => undefined}
            />
          </PrintPageFrame>
        )),
      )}

      {chapters[3]!.slides.map((slide, slideIndex) => (
        <PrintPageFrame
          chapter={chapters[3]!}
          detail={slide.title}
          pageNumber={++pageNumber}
          totalPages={totalPages}
          key={slide.id}
        >
          <Projects slide={slideIndex} />
        </PrintPageFrame>
      ))}

      {chapters[4]!.slides.map((slide, slideIndex) => (
        <PrintPageFrame
          chapter={chapters[4]!}
          detail={slide.title}
          pageNumber={++pageNumber}
          totalPages={totalPages}
          key={slide.id}
        >
          <Life slide={slideIndex} />
        </PrintPageFrame>
      ))}

      <PrintPageFrame
        chapter={chapters[5]!}
        detail={chapters[5]!.slides[0]!.title}
        pageNumber={++pageNumber}
        totalPages={totalPages}
      >
        <Closing />
      </PrintPageFrame>
    </main>
  );
}
