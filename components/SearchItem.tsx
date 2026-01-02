"use client";

import { cn } from "@/lib/utils";
import { Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react";

const SearchItem = ({ stock, handleSelectStock }: { stock: StockWithWatchlistStatus; handleSelectStock: () => void }) => {
    const [addedToWatchlist, setAddedToWatchlist] = useState(false);

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
                    <div className="text-sm text-gray-500">
                        {stock.symbol} | {stock.exchange} | {stock.type}
                    </div>
                </div>
            </Link>

            {/* ---- Star Icon ---- */}
            <div
                onClick={() => setAddedToWatchlist(prev => !prev)}
                className="absolute z-10 right-4 top-1/2 -translate-y-1/2 bg-gray-600 p-1.5 rounded-full cursor-pointer"
            >
                <Star size={16} fill={addedToWatchlist ? "#e8ba40" : "none"} className={cn("text-gray-400", addedToWatchlist && "text-yellow-500")} />
            </div>
        </li>
    )
}

export default SearchItem