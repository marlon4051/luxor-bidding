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

export function EditBidDialog({
  bid,
  bids,
  setBids,
}: {
  bid: Bid;
  collectionId: string;
  userId: string;
  userName: string;
  bids: Bid[];
  setBids: () => void;
}) {
  const highestBid = bids.length > 0 ? Math.max(...bids.map((b) => b.price)) : 0;

  const [newBidAmount, setNewBidAmount] = useState(highestBid);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newBidAmount <= highestBid) {
      alert("Your bid must be higher than the current highest bid.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/bids/${bid.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: newBidAmount,
          status: BidStatus.pending,
        }),
      });

      if (response.ok) {
        await response.json();
        setBids();
        setIsOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Edit Bid</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Your Bid</DialogTitle>
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
                value={newBidAmount}
                onChange={(e) => setNewBidAmount(Number(e.target.value))}
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
