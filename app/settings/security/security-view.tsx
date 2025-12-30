'use client'

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { generateTwoFactorSecret, verifyAndEnableTwoFactor, disableTwoFactor } from "../actions"
// We'll dynamically import qrcode to avoid server-side issues or just use it if available
import QRCode from "qrcode"

export function SecurityView({ isEnabled }: { isEnabled: boolean }) {
    const [isPending, startTransition] = useTransition()
    const [setupStep, setSetupStep] = useState<'idle' | 'qr' | 'verify'>('idle')
    const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
    const [verificationCode, setVerificationCode] = useState("")
    const [error, setError] = useState("")

    const handleStartSetup = () => {
        setError("")
        startTransition(async () => {
            const result = await generateTwoFactorSecret()
            if (result.error) {
                setError(result.error)
                return
            }
            if (result.otpauth) {
                try {
                    const url = await QRCode.toDataURL(result.otpauth)
                    setQrCodeUrl(url)
                    setSetupStep('qr')
                } catch (err) {
                    setError("Failed to generate QR code")
                }
            }
        })
    }

    const handleVerify = () => {
        setError("")
        startTransition(async () => {
            const result = await verifyAndEnableTwoFactor(verificationCode)
            if (result.error) {
                setError(result.error)
            } else {
                setSetupStep('idle')
                // The parent page will re-render with isEnabled=true due to the server action revalidating path
            }
        })
    }

    const handleDisable = () => {
        if (!confirm("Are you sure you want to disable 2FA?")) return
        startTransition(async () => {
            await disableTwoFactor()
        })
    }

    if (isEnabled) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
                    <div>
                        <h4 className="font-medium text-green-900">Two-factor authentication is enabled</h4>
                        <p className="text-sm text-green-700">Your account is secure.</p>
                    </div>
                    <Button variant="destructive" onClick={handleDisable} disabled={isPending}>
                        Disable 2FA
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4 max-w-lg">
            <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Two-factor Authentication</h4>
                    {setupStep === 'idle' && (
                        <Button onClick={handleStartSetup} disabled={isPending}>
                            Enable 2FA
                        </Button>
                    )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account by requiring a code from your authenticator app.
                </p>

                {setupStep === 'qr' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-center p-4 bg-white rounded-lg border">
                            {qrCodeUrl && <img src={qrCodeUrl} alt="2FA QR Code" width={200} height={200} />}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Verify Code</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder="123456"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                                <Button onClick={handleVerify} disabled={isPending || verificationCode.length !== 6}>
                                    Verify
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <p className="text-sm text-red-600 mt-2">{error}</p>
                )}
            </div>
        </div>
    )
}
