import { NextRequest, NextResponse } from "next/server";
import { Watchlist } from "../../../database/models/watchlist.model"

export async function POST(request: NextRequest) {
    try {
        const { userId, symbol, company } = await request.json();

        // Error handling
        if (!userId || userId.trim() === "") {
            return NextResponse.json({ error: "No user id found for this stock" }, { status: 404 });
        }
        if (!symbol || symbol.trim() === "") {
            return NextResponse.json({ error: "No symbol found for this stock" }, { status: 404 });
        }
        if (!company || company.trim() === "") {
            return NextResponse.json({ error: "No company name found for this stock" }, { status: 404 });
        }

        // Create a new watchlist item with the stock
        const newWatchlistItem = new Watchlist({
            userId,
            symbol,
            company,
            addedAt: new Date(),
        });

        // Save the item in DB
        await newWatchlistItem.save();

        return NextResponse.json({ message: "Stock added to watchlist" }, { status: 201 });

    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "Failed to add stock to watchlist" }, { status: 500 });
    }
}