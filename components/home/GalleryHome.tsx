
import { motion } from 'framer-motion';
import PortraitGallery from './portraitPhotos';
import EventsGallery from './eventPhotos';
import WeddingGallery from './WeddingGallery';
import WeddingCTA from './WeddingCTA';
export default function GalleryHome() {
    return (
        <main className="pb-12 min-h-screen bg-[#2E4A6F]/75">

            <PortraitGallery />
            <EventsGallery />
            <WeddingGallery />
            <WeddingCTA />
        </main>
    );
}