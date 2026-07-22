export type Theme = {
  bg_cream: string;
  bg_sand: string;
  text_dark: string;
  text_muted: string;
  accent_primary: string;
  accent_hover: string;
  footer_bg: string;
};

export type Settings = {
  admin_email: string;
  submit_button_text: string;
  submit_success_text: string;
  site_title: string;
};

export type HeroContent = {
  subtitle: string;
  title: string;
  subheading: string;
  body: string;
  button_text: string;
  image_url: string;
};

export type EmidContent = { title: string; body: string; image_url?: string };
export type HeaderPair = { title: string; subtitle: string };
export type BridgeContent = { title: string; body: string };
export type AboutContent = { title: string; body: string; credentials: string; image_url: string };
export type ContactContent = {
  title: string;
  subtitle: string;
  name_label: string;
  phone_label: string;
  message_label: string;
};
export type FooterContent = { right: string; center: string };

export type Card = {
  id: string;
  sort_order: number;
  slug: string;
  title: string;
  description: string;
  image_url: string | null;
  target_title: string;
  target_body: string;
  target_image_url: string | null;
};

export type MagazineCard = Card & { tag: string };

export type Faq = { id: string; sort_order: number; question: string; answer: string };

export type SiteData = {
  theme: Theme;
  settings: Settings;
  hero: HeroContent;
  emid: EmidContent;
  matrix_header: HeaderPair;
  bridge: BridgeContent;
  outcomes_header: HeaderPair;
  magazine_header: HeaderPair;
  about: AboutContent;
  faq_header: HeaderPair;
  contact: ContactContent;
  footer: FooterContent;
  matrix: Card[];
  outcomes: Card[];
  magazine: MagazineCard[];
  faqs: Faq[];
};
