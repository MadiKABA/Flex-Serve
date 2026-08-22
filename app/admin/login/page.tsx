'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ShieldAlert } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const middlewareError = searchParams.get('error');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(
        middlewareError === 'unauthorized' ? 'Accès non autorisé. Merci de te reconnecter.' : null
    );

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error: signInError } = await supabaseBrowser.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError || !data.user) {
            setError('Identifiants invalides.');
            setLoading(false);
            return;
        }

        const { data: adminRow, error: adminError } = await supabaseBrowser
            .from('admin_users')
            .select('user_id')
            .eq('user_id', data.user.id)
            .maybeSingle();

        if (adminError || !adminRow) {
            await supabaseBrowser.auth.signOut();
            setError('Accès non autorisé.');
            setLoading(false);
            return;
        }

        router.push('/admin');
        router.refresh();
    };

    return (
        <Card className="w-full max-w-md border-none shadow-2xl">
            <CardHeader className="text-center space-y-1">
                <CardTitle className="text-2xl font-semibold text-[#2E4A6F]">FlexServeStudio</CardTitle>
                <CardDescription>Administration — connexion</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <ShieldAlert className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="h-11 px-4"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <PasswordInput
                            id="password"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="h-11 px-4"
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 px-6 bg-[#3d5a7a] hover:bg-[#2d4a6a] text-white"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" /> Connexion…
                            </>
                        ) : (
                            'Se connecter'
                        )}
                    </Button>
                    <Link href="/admin/forgot-password" className="text-sm text-[#3d5a7a] hover:underline">
                        Mot de passe oublié ?
                    </Link>
                </CardFooter>
            </form>
        </Card>
    );
}

export default function AdminLoginPage() {
    return (
        <main className="min-h-screen bg-[#2E4A6F] flex items-center justify-center px-4 py-12">
            <Suspense fallback={null}>
                <LoginForm />
            </Suspense>
        </main>
    );
}
