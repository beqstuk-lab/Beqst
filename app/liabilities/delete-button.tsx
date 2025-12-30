'use client'

import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function LiabilityDeleteButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this liability?")) return

        setIsDeleting(true)
        try {
            await fetch(`/api/liabilities?id=${id}`, { method: "DELETE" })
            router.refresh()
        } catch (error) {
            console.error("Failed to delete:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
        >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
    )
}
