
import PortraitGallery from './portraitPhotos';
import EventsGallery from './eventPhotos';
import WeddingGallery from './WeddingGallery';
import WeddingCTA from './WeddingCTA';
import type { MediaItem } from '@/lib/types/content';

export default function GalleryHome({
    weddingStoryTitle,
    weddingStoryBody,
    weddingStoryMedia,
    weddingCtaTitle,
    weddingCtaSubtitle,
    weddingCtaBody,
    weddingCtaLabel,
    weddingCtaUrl,
    weddingCtaMedia,
}: {
    weddingStoryTitle?: string | null;
    weddingStoryBody?: string | null;
    weddingStoryMedia: MediaItem[];
    weddingCtaTitle?: string | null;
    weddingCtaSubtitle?: string | null;
    weddingCtaBody?: string | null;
    weddingCtaLabel?: string | null;
    weddingCtaUrl?: string | null;
    weddingCtaMedia: MediaItem[];
}) {
    return (
        <main className="pb-12 min-h-screen bg-[#2E4A6F]/75">

            <EventsGallery />
            <WeddingGallery title={weddingStoryTitle} body={weddingStoryBody} media={weddingStoryMedia} />
            <WeddingCTA
                title={weddingCtaTitle}
                subtitle={weddingCtaSubtitle}
                body={weddingCtaBody}
                ctaLabel={weddingCtaLabel}
                ctaUrl={weddingCtaUrl}
                media={weddingCtaMedia}
            />
        </main>
    );
}
