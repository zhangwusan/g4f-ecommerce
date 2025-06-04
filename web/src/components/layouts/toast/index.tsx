import { toast } from "@/hooks/use-toast"

export function successToast(message: string) {
  return toast({
    title: "Success",
    description: message,
    className: "bg-green-600 text-white",
  })
}

export function errorToast(message: string) {
  return toast({
    title: "Error",
    description: message,
    className: "bg-red-600 text-white",
  })
}