import { supabase } from '@/lib/supabase/client';
import type { MediaItem, Service } from '@/lib/types/content';

export interface ServiceWithMedia extends Service {
    media: MediaItem[];
}

/**
 * Lecture publique (client anon, respecte RLS) des services visibles,
 * triés par position, avec leurs media_items (service_id) triés par position.
 */
export async function getServicesData(): Promise<ServiceWithMedia[]> {
    const { data: services } = await supabase
        .from('services')
        .select('*')
        .eq('is_visible', true)
        .order('position')
        .returns<Service[]>();

    if (!services || services.length === 0) return [];

    const serviceIds = services.map((s) => s.id);
    const { data: media } = await supabase
        .from('media_items')
        .select('*')
        .in('service_id', serviceIds)
        .order('position')
        .returns<MediaItem[]>();

    const mediaByService = new Map<string, MediaItem[]>();
    for (const item of media ?? []) {
        if (!item.service_id) continue;
        const list = mediaByService.get(item.service_id) ?? [];
        list.push(item);
        mediaByService.set(item.service_id, list);
    }

    return services.map((service) => ({ ...service, media: mediaByService.get(service.id) ?? [] }));
}
