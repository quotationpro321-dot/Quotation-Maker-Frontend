/** A4 at 96 CSS px/in — matches jsPDF `format: "a4"` portrait export. */
export const QUOTATION_A4_WIDTH_PX = 794;
export const QUOTATION_A4_HEIGHT_PX = 1123;

/** Horizontal inset for intro page text and collage — aligned in the PDF mockup. */
export const UMRAH_INTRO_PAGE_MARGIN_PX = 40;

/** Full content width for intro text and square collage. */
export const UMRAH_INTRO_CONTENT_WIDTH_PX =
  QUOTATION_A4_WIDTH_PX - UMRAH_INTRO_PAGE_MARGIN_PX * 2;

/** Square collage display size (1:1 JPEG) — fits below copy on A4. */
export const UMRAH_INTRO_COLLAGE_SIZE_PX = 520;

export const UMRAH_QUOTATION_ASSETS = {
  coverPage: "/quotations/umrah/cover-page.png",
  experienceCollage: "/quotations/umrah/experience-collage.jpeg",
  logo: "/Alsama-logo.png",
} as const;

export const UMRAH_INTRO_PARAGRAPHS = [
  "At Alsama Tours, we bring decades of expertise and a heartfelt dedication to serving those embarking on the sacred pilgrimage of Umrah. We recognize that this journey is not merely a trip, but a profound spiritual endeavor—one that deserves meticulous care, reverence, and flawless execution.",
  "Our team of seasoned professionals is committed to crafting personalized Umrah experiences tailored to your unique needs. Whether you seek the comfort of luxury or the simplicity of a budget-conscious package, we offer thoughtfully curated options to align with your aspirations.",
  "Through exclusive partnerships with trusted hotels, airlines, and local service providers, we ensure seamless transitions at every stage—from visa processing and accommodations to guided tours and transportation. Our holistic approach allows you to devote yourself entirely to worship, free from logistical concerns.",
  "With Alsama Tours, you gain more than a service; you gain a partner dedicated to precision, compassion, and creating memories that resonate long after your pilgrimage concludes. It would be our honor to accompany you on this transformative journey.",
] as const;
