export default function ComingSoon({ title }: { title: string }) {
    return (
        <div className="rounded-xl border border-dashed border-[#2E4A6F]/20 bg-[#2E4A6F]/[0.03] px-8 py-16 text-center">
            <h1 className="text-xl font-semibold text-[#2E4A6F]">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Cette section sera bientôt disponible.</p>
        </div>
    );
}
