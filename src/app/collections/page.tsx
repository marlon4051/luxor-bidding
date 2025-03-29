"use client";
import { Collection } from "@/models/collection";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { UserSession } from "@/models/user";
import { EditCollectionDialog } from "@/components/editCollectionDialog";
import { AddCollectionDialog } from "@/components/newCollectionDialog";
import { PlaceBidDialog } from "@/components/placeBidDialog";
import { Bid } from "@/models/bids";
import { EditBidDialog } from "@/components/editBidDialog";

const Collections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [currentUser, setCurrentUser] = useState<UserSession>({
    userId: "",
    userName: "",
  });
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const fetchData = async () => {
    const [userRes, collectionsRes] = await Promise.all([
      fetch("/api/auth/me"),
      fetch("/api/collections"),
    ]);

    if (userRes.ok) {
      const user = await userRes.json();
      setCurrentUser(user);
    }

    if (collectionsRes.ok) {
      setCollections(await collectionsRes.json());
    }
  };
  useEffect(() => {
    async function loadData() {
      try {
        await fetchData();
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleUpdateCollection = async () => {
    await fetchData();
  };
  const handleAddCollection = async () => {
    await fetchData();
  };
  const handleUpdateBidPrice = async () => {
    await fetchData();
  };

  const handleDeleteCollection = async (collectionId: string) => {
    try {
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchData();
      } else {
        console.error("Error deleting collection");
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  const handleUpdateBid = (
    newBid: Bid,
    collectionId: string,
    userId: string,
    userName: string
  ) => {
    setCollections(
      collections.map((col) => {
        if (col.id === collectionId) {
          newBid.userId = userId;
          newBid.user = {
            id: userId,
            name: userName,
            email: "",
          };
          col.bids.push(newBid);
        }
        return col;
      })
    );
  };


  const handleCancelBid = async (bidId: string, collectionId: string) => {
    try {
      const response = await fetch(`/api/bids/${bidId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCollections((prevCollections) =>
          prevCollections.map((col) => {
            if (col.id === collectionId) {
              col.bids = col.bids.filter((bid) => bid.id !== bidId);
            }
            return col;
          })
        );
      } else {
        console.error("Error canceling bid");
      }
    } catch (error) {
      console.error("Error canceling bid:", error);
    }
  };

  const handleAcceptBid = async (bidId: string, collectionId: string) => {
    try {

      const acceptResponse = await fetch(`/api/bids/${bidId}/accept`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collectionId: collectionId || "" }),
      });
  
      if (acceptResponse.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error accepting bid:', error);
    }
  };

  const handleRejectBid = async (bidId: string, collectionId: string) => {
    try {
      const response = await fetch(`/api/bids/${bidId}/reject`, {
        method: 'PATCH',
      });
  
      if (response.ok) {
        setCollections(prevCollections =>
          prevCollections.map(collection => {
            if (collection.id === collectionId) {
              return {
                ...collection,
                bids: collection.bids.map(bid => {
                  if (bid.id === bidId) {
                    return { ...bid, status: 'rejected' };
                  }
                  return bid;
                })
              };
            }
            return collection;
          })
        );
      }
    } catch (error) {
      console.error('Error rejecting bid:', error);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  const indexOfLastCollection = currentPage * itemsPerPage;
  const indexOfFirstCollection = indexOfLastCollection - itemsPerPage;
  const currentCollections = collections.slice(
    indexOfFirstCollection,
    indexOfLastCollection
  );

  const totalPages = Math.ceil(collections.length / itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Collections</h1>

      <AddCollectionDialog
        onAdd={handleAddCollection}
        userId={currentUser?.userId}
      />

      {currentCollections.map((collection) => {
        const isOwner = collection.userId === currentUser?.userId;

        return (
          <Card key={collection.id} className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{collection.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Stocks: {collection.stocks} | Price: $
                  {collection.price.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {collection.description}
                </p>
              </div>
              {isOwner ? (
                <div className="flex gap-2">
                  <EditCollectionDialog
                    collection={collection}
                    onUpdate={handleUpdateCollection}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCollection(collection.id)}
                  >
                    Delete
                  </Button>
                </div>
              ) : (
                <PlaceBidDialog
                  collectionId={collection.id}
                  userId={currentUser?.userId}
                  userName={currentUser?.userName}
                  bids={collection?.bids}
                  setBids={handleUpdateBid}
                />
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Bid Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collection?.bids.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-sm text-muted-foreground"
                      >
                        No bids available
                      </TableCell>
                    </TableRow>
                  ) : (
                    collection?.bids.map((bid: Bid) => {
                      const isBidOwner = bid.userId === currentUser?.userId;

                      return (
                        <TableRow key={bid.id} className="hover:bg-muted/50">
                          <TableCell>{bid.user.name}</TableCell>
                          <TableCell>${bid.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                bid.status === "accepted"
                                  ? "default"
                                  : bid.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {bid.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {isOwner ? (
                              <div className="flex gap-2 justify-end">
                                <form>
                                  <Button
                                    variant={
                                      bid.status === "accepted"
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    disabled={bid.status === "accepted" || bid.status === "rejected"}
                                    onClick={() => handleAcceptBid(bid.id, collection.id)}
                                  >
                                    Accept
                                  </Button>
                                </form>
                                <form>
                                  <Button
                                    variant={
                                      bid.status === "rejected"
                                        ? "destructive"
                                        : "outline"
                                    }
                                    size="sm"
                                    disabled={bid.status === "rejected"}
                                    onClick={() => handleRejectBid(bid.id, collection.id)}
                                  >
                                    Reject
                                  </Button>
                                </form>
                              </div>
                            ) : isBidOwner ? (
                              <div className="flex gap-2 justify-end">
                                {isBidOwner && (
                                  <EditBidDialog
                                    bid={bid}
                                    collectionId={collection.id}
                                    userId={currentUser?.userId}
                                    userName={currentUser?.userName}
                                    bids={collection.bids}
                                    setBids={handleUpdateBidPrice}
                                  />
                                )}
                                <form>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleCancelBid(bid.id, collection.id)
                                    }
                                  >
                                    Cancel
                                  </Button>
                                </form>
                              </div>
                            ) : null}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}

      <div className="flex justify-center mt-4">
        <Button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index}
            onClick={() => goToPage(index + 1)}
            variant={currentPage === index + 1 ? "default" : "outline"}
            className="mx-2"
          >
            {index + 1}
          </Button>
        ))}

        <Button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Collections;
