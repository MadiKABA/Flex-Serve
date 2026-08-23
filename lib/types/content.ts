export type PageType = 'standard' | 'custom';
export type SectionType = 'hero' | 'text' | 'gallery' | 'cta';
export type GalleryLayout = 'grid' | 'scroll_ltr' | 'scroll_rtl';
export type PortfolioCategory = 'mariage' | 'portrait' | 'evenementiel' | 'pub';

export interface Page {
    id: string;
    slug: string;
    title: string;
    meta_description: string | null;
    type: PageType;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface Section {
    id: string;
    page_id: string;
    type: SectionType;
    position: number;
    title: string | null;
    subtitle: string | null;
    body: string | null;
    cta_label: string | null;
    cta_url: string | null;
    cta_label_2: string | null;
    cta_url_2: string | null;
    background_media_id: string | null;
    is_visible: boolean;
    layout: GalleryLayout;
    created_at: string;
    updated_at: string;
}

export interface Service {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    tag: string | null;
    href: string;
    cta_portfolio_label: string;
    cta_reservation_label: string;
    cta_reservation_url: string;
    position: number;
    is_visible: boolean;
    created_at: string;
    updated_at: string;
}

export interface AboutStat {
    id: string;
    label: string;
    value: string;
    position: number;
    created_at: string;
    updated_at: string;
}

export interface AboutPartner {
    id: string;
    name: string;
    position: number;
    is_visible: boolean;
    created_at: string;
    updated_at: string;
}

export interface MediaItem {
    id: string;
    cloudinary_public_id: string;
    cloudinary_url: string;
    alt_text: string | null;
    title: string | null;
    category: PortfolioCategory | null;
    section_id: string | null;
    service_id: string | null;
    position: number;
    is_visible: boolean;
    created_at: string;
}
