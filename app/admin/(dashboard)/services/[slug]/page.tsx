import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase/server';
import ServiceEditor from '@/components/admin/services/ServiceEditor';
import ServiceTwoImages from '@/components/admin/services/ServiceTwoImages';
import { getServiceUploadFolder } from '@/lib/utils/cloudinary-paths';
import type { MediaItem, Service } from '@/lib/types/content';

export default async function AdminServiceEditorPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const { data: service, error: serviceError } = await supabaseAdmin
        .from('services')
        .select('*')
        .eq('slug', slug)
        .maybeSingle<Service>();

    if (serviceError) {
        return (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                Erreur de chargement : {serviceError.message}
            </p>
        );
    }
    if (!service) {
        notFound();
    }

    const { data: media, error: mediaError } = await supabaseAdmin
        .from('media_items')
        .select('*')
        .eq('service_id', service.id)
        .order('position')
        .returns<MediaItem[]>();

    if (mediaError) {
        return (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                Erreur de chargement : {mediaError.message}
            </p>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <Link
                    href="/admin/services"
                    className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#2E4A6F]"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Services
                </Link>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">/{service.slug}</p>
                <h1 className="text-2xl font-semibold text-[#2E4A6F]">{service.name}</h1>
            </div>

            <div className="space-y-6 rounded-xl border border-border bg-white p-6">
                <ServiceEditor service={service} />
            </div>

            <div className="space-y-4 rounded-xl border border-border bg-white p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Images (exactement 2)
                </p>
                <ServiceTwoImages
                    serviceId={service.id}
                    serviceSlug={service.slug}
                    uploadFolder={getServiceUploadFolder(service.slug)}
                    media={media ?? []}
                />
            </div>
        </div>
    );
}
