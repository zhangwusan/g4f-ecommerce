"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "../../ui/button"

export function BackButton({
  children = "Back",
  ...props
}: React.ComponentProps<typeof Button>) {
  const router = useRouter()

  return (
    <Button variant="outline" onClick={() => router.back()} {...props}>
      <ArrowLeft className="mr-2" />
      {children}
    </Button>
  )
}