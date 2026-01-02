"use client";

import { cn } from "@/lib/utils";
import { Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SearchItem = ({ stock, handleSelectStock, userId, watchlistItems }: { stock: StockWithWatchlistStatus; handleSelectStock: () => void; userId: string; watchlistItems: WatchListItem[] | [] }) => {
    // States
    const [addedToWatchlist, setAddedToWatchlist] = useState(false);

    useEffect(() => {
        if (watchlistItems.length > 0) {
            const isAdded = watchlistItems.find(item => (item.symbol === stock.symbol) && (item.company === stock.name));

            if (isAdded) setAddedToWatchlist(true);
            else setAddedToWatchlist(false);
        }
    }, [watchlistItems]);

    // Functions
    const handleToggleWatchlist = async () => {
        try {
            if (addedToWatchlist === false) {
                // Add to watchlist
                await handleAddToWatchlist();
            }
            else {
                // Remove from watchlist
                await handleRemoveFromWatchlist();
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleAddToWatchlist = async () => {
        try {
            setAddedToWatchlist(true);

            const res: Response = await fetch("/api/watchlist", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    userId,
                    symbol: stock.symbol,
                    company: stock.name,
                })
            });
            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
            }
            else {
                toast.error(data.error);
                setAddedToWatchlist(false);
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to add stock to watchlist");
            setAddedToWatchlist(false);
        }
    }

    const handleRemoveFromWatchlist = async () => {
        try {
            setAddedToWatchlist(false);

            const res: Response = await fetch("/api/watchlist", {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    userId,
                    symbol: stock.symbol,
                    company: stock.name,
                })
            });
            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
            }
            else {
                toast.error(data.error);
                setAddedToWatchlist(true);
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to remove from watchlist");
            setAddedToWatchlist(true);
        }
    }

    return (
        <li key={stock.symbol} className="search-item relative">
            <Link
                href={`/stocks/${stock.symbol}`}
                onClick={handleSelectStock}
                className="search-item-link"
            >
                <TrendingUp className="h-4 w-4 text-green-500 mt-1.5" />

                <div className="flex-1">
                    <div className="search-item-name">
                        {stock.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">
                        {stock.symbol} &nbsp;•&nbsp; {stock.exchange} &nbsp;•&nbsp; {stock.type}
                    </div>
                </div>
            </Link>

            {/* ---- Star Icon ---- */}
            <div
                onClick={handleToggleWatchlist}
                className="absolute z-10 right-4 top-1/2 -translate-y-1/2 bg-gray-600 p-1.5 rounded-full cursor-pointer"
            >
                <Star size={16} fill={addedToWatchlist ? "#e8ba40" : "none"} className={cn("text-gray-400", addedToWatchlist && "text-yellow-500")} />
            </div>
        </li>
    )
}

export default SearchItem