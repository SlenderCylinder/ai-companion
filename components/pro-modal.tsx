"use client";

import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { userProModal } from "@/hooks/use-pro-model";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";

export const ProModal = () => {
    const ProModal = userProModal();
    return (
        <Dialog open = {ProModal.isOpen} onOpenChange={ProModal.onclose}>
            <DialogContent>
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-center">
                        Upgrade to Pro
                    </DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}