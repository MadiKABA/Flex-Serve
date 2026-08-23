import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/server';
import ServiceRowControls from '@/components/admin/services/ServiceRowControls';
import type { MediaItem, Service } from '@/lib/types/content';

export default async function AdminServicesPage() {
    const { data: services, error } = await supabaseAdmin
        .from('services')
        .select('*')
        .order('position')
        .returns<Service[]>();

    const serviceList = services ?? [];
    const serviceIds = serviceList.map((s) => s.id);
    const mediaByService = new Map<string, MediaItem[]>();

    if (serviceIds.length > 0) {
        const { data: media } = await supabaseAdmin
            .from('media_items')
            .select('*')
            .in('service_id', serviceIds)
            .order('position')
            .returns<MediaItem[]>();

        for (const item of media ?? []) {
            if (!item.service_id) continue;
            const list = mediaByService.get(item.service_id) ?? [];
            list.push(item);
            mediaByService.set(item.service_id, list);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-[#2E4A6F]">Services</h1>
                <p className="text-sm text-muted-foreground">
                    Gère les prestations affichées sur la page Services publique.
                </p>
            </div>

            {error && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    Erreur de chargement : {error.message}
                </p>
            )}

            {!error && serviceList.length === 0 && (
                <div className="rounded-xl border border-dashed border-[#2E4A6F]/20 bg-[#2E4A6F]/[0.03] px-8 py-16 text-center">
                    <p className="text-sm text-muted-foreground">Aucun service.</p>
                </div>
            )}

            {!error && serviceList.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-border bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-sm">
                            <thead className="border-b border-border bg-[#F5F2E8]/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                    <th className="px-5 py-3 font-medium">Photos</th>
                                    <th className="px-5 py-3 font-medium">Nom</th>
                                    <th className="px-5 py-3 font-medium">Tag</th>
                                    <th className="px-5 py-3 font-medium">Ordre / Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {serviceList.map((service, index) => {
                                    const media = mediaByService.get(service.id) ?? [];
                                    return (
                                        <tr
                                            key={service.id}
                                            className="border-b border-border last:border-b-0 hover:bg-[#2E4A6F]/[0.03]"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex gap-1.5">
                                                    {[0, 1].map((position) => {
                                                        const item = media.find((m) => m.position === position);
                                                        return (
                                                            <div
                                                                key={position}
                                                                className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-[#F5F2E8]/40"
                                                            >
                                                                {item && (
                                                                    // eslint-disable-next-line @next/next/no-img-element
                                                                    <img
                                                                        src={item.cloudinary_url}
                                                                        alt={item.alt_text ?? ''}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <Link
                                                    href={`/admin/services/${service.slug}`}
                                                    className="font-medium text-[#2E4A6F] hover:underline"
                                                >
                                                    {service.name}
                                                </Link>
                                            </td>
                                            <td className="px-5 py-4 text-muted-foreground">{service.tag || '—'}</td>
                                            <td className="px-5 py-4">
                                                <ServiceRowControls
                                                    serviceId={service.id}
                                                    initialVisible={service.is_visible}
                                                    isFirst={index === 0}
                                                    isLast={index === serviceList.length - 1}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
