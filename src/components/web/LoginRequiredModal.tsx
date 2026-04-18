"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface LoginRequiredModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginRequiredModal({
  open,
  onClose,
}: LoginRequiredModalProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader>
          <DialogTitle>Please login first</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600 mb-6">
          You must be logged in to purchase a subscription plan.
        </p>

        <div className="flex gap-3">
          <Button
            className="w-full bg-[#31B8FA] hover:bg-[#2BA5D6]/90 text-white"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/auth")}
          >
            Register
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
