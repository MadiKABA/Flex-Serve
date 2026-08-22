'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        await supabaseBrowser.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/admin/reset-password`,
        });

        // Message générique dans tous les cas : on ne révèle jamais si l'email existe.
        setSent(true);
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-[#2E4A6F] flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md border-none shadow-2xl">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl font-semibold text-[#2E4A6F]">Mot de passe oublié</CardTitle>
                    <CardDescription>Administration FlexServeStudio</CardDescription>
                </CardHeader>

                {sent ? (
                    <CardContent className="space-y-4">
                        <Alert>
                            <Mail className="h-4 w-4" />
                            <AlertDescription>
                                Si ce compte existe, un email de réinitialisation a été envoyé.
                            </AlertDescription>
                        </Alert>
                        <Link
                            href="/admin/login"
                            className="flex items-center gap-2 text-sm text-[#3d5a7a] hover:underline"
                        >
                            <ArrowLeft className="h-4 w-4" /> Retour à la connexion
                        </Link>
                    </CardContent>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
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
                                />
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#3d5a7a] hover:bg-[#2d4a6a] text-white"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" /> Envoi…
                                    </>
                                ) : (
                                    'Envoyer le lien'
                                )}
                            </Button>
                            <Link
                                href="/admin/login"
                                className="flex items-center gap-2 text-sm text-[#3d5a7a] hover:underline"
                            >
                                <ArrowLeft className="h-4 w-4" /> Retour à la connexion
                            </Link>
                        </CardFooter>
                    </form>
                )}
            </Card>
        </main>
    );
}
