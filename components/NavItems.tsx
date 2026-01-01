"use client";

import { NAV_ITEMS } from "@/lib/constants"
import Link from "next/link"
import { usePathname } from "next/navigation"
import SearchCommand from "./SearchCommand";

const NavItems = ({ initialStocks }: { initialStocks: StockWithWatchlistStatus[] }) => {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === "/") {
            return pathname === "/";
        }

        return pathname.startsWith(path);
    }

    return (
        <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
            {
                NAV_ITEMS.map((item, index) => {
                    if (item.label === "Search") {
                        return (
                            <SearchCommand key="search-command" label="Search" renderAs="text" initialStocks={initialStocks} />
                        )
                    }

                    return (
                        <li key={index}>
                            <Link
                                href={item.href}
                                className={`hover:text-yellow-500 transition-colors ${isActive(item.href) ? "text-gray-100" : ""}`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default NavItems