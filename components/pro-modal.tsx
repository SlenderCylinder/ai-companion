"use client";

import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { userProModal } from "@/hooks/use-pro-model";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import axios from "axios";

export const ProModal = () => {
    const ProModal = userProModal();
    const {toast} = useToast();

    const [loading, setLoading] = useState(false);

    const onSubscribe = async() => {
        try {
            setLoading(true);
            const response = await axios.get("/api/stripe");

            window.location.href = response.data.url;

        } catch (error) {
            toast({
                variant: "destructive",
                description: `Something went wrong: ${error}`
            })

        } finally {
            setLoading(false);
        }
    }
    return (
        <Dialog open = {ProModal.isOpen} onOpenChange={ProModal.onclose}>
            <DialogContent>
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-center">
                        Upgrade to Pro
                    </DialogTitle>
                    <DialogDescription className="text-center space-y-2">
                        Create <span className="text-sky-500 mx-1 font-medium">
                            Cusom AI
                        </span> Companions!
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <div className="flex justify-between"><p className="text-2xl font-medium">$9<span className="text-sm font-normal">.99/mo</span></p>
                <Button variant="premium" onClick={onSubscribe} disabled={loading}>
                    Subscribe
                </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};