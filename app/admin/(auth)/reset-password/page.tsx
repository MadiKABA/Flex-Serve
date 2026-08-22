'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

type LinkStatus = 'checking' | 'ready' | 'invalid';

export default function ResetPasswordPage() {
    const router = useRouter();

    const [linkStatus, setLinkStatus] = useState<LinkStatus>('checking');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Le lien reçu par email établit une session de récupération de façon
    // asynchrone (échange du code côté client). On attend cet événement
    // avant d'afficher le formulaire ; si rien n'arrive, le lien est
    // considéré invalide/expiré.
    useEffect(() => {
        let resolved = false;
        const markReady = () => {
            if (!resolved) {
                resolved = true;
                setLinkStatus('ready');
            }
        };

        supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
            if (session) markReady();
        });

        const {
            data: { subscription },
        } = supabaseBrowser.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY' || session) markReady();
        });

        const timeout = setTimeout(() => {
            if (!resolved) setLinkStatus('invalid');
        }, 3000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Les deux mots de passe ne correspondent pas.');
            return;
        }

        setLoading(true);
        const { error: updateError } = await supabaseBrowser.auth.updateUser({ password });
        setLoading(false);

        if (updateError) {
            setError('Impossible de mettre à jour le mot de passe. Réessaie ou redemande un lien.');
            return;
        }

        setSuccess(true);
        await supabaseBrowser.auth.signOut();
        setTimeout(() => router.push('/admin/login'), 2000);
    };

    return (
        <main className="min-h-screen bg-[#2E4A6F] flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md border-none shadow-2xl">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl font-semibold text-[#2E4A6F]">Nouveau mot de passe</CardTitle>
                    <CardDescription>Administration FlexServeStudio</CardDescription>
                </CardHeader>

                {linkStatus === 'checking' && (
                    <CardContent>
                        <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" /> Vérification du lien…
                        </div>
                    </CardContent>
                )}

                {linkStatus === 'invalid' && (
                    <CardContent className="space-y-4">
                        <Alert variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertDescription>
                                Ce lien de réinitialisation est invalide ou a expiré.
                            </AlertDescription>
                        </Alert>
                        <Link href="/admin/forgot-password">
                            <Button className="w-full h-11 px-6 bg-[#3d5a7a] hover:bg-[#2d4a6a] text-white">
                                Redemander un lien
                            </Button>
                        </Link>
                    </CardContent>
                )}

                {linkStatus === 'ready' && !success && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <CardContent className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <XCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="password">Nouveau mot de passe</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    className="h-11 px-4"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                                <PasswordInput
                                    id="confirmPassword"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={loading}
                                    className="h-11 px-4"
                                />
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 px-6 bg-[#3d5a7a] hover:bg-[#2d4a6a] text-white"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" /> Mise à jour…
                                    </>
                                ) : (
                                    'Mettre à jour le mot de passe'
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                )}

                {success && (
                    <CardContent>
                        <Alert>
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>
                                Mot de passe mis à jour. Redirection vers la connexion…
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                )}
            </Card>
        </main>
    );
}
