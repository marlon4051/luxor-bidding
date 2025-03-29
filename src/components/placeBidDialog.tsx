"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bid } from "@/models/bids";
import { BidStatus } from "@prisma/client";
import { useState } from "react";

export function PlaceBidDialog({
  collectionId,
  userId,
  userName,
  bids,
  setBids,
}: {
  collectionId: string;
  userId: string;
  userName: string;
  bids: Bid[];
  setBids: (bid: Bid, collectionId: string, userId: string, userName: string) => void;
}) {
  const highestBid = bids.length > 0 ? Math.max(...bids.map((b) => b.price)) : 0;

  const [bidAmount, setBidAmount] = useState(highestBid  + 1);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collectionId,
          price: bidAmount,
          status: BidStatus.pending,
          userId: userId,
        }),
      });

      if (response.ok) {
        const newBid = await response.json();
        setBids(newBid, collectionId, userId, userName);
        setIsOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Place Bid</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Place New Bid</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Your Bid
              </Label>
              <Input
                id="price"
                type="number"
                min={highestBid + 1}
                step="0.01"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Bid"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
