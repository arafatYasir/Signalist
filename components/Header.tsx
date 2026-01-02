import Image from "next/image"
import Link from "next/link"
import NavItems from "./NavItems"
import UserDropdown from "./UserDropdown"
import { getWatchlistItems, searchStocks } from "@/lib/actions/finnhub.actions"

const Header = async ({ user }: { user: User }) => {
  // Fetching inital stocks to show on search command component
  const initialStocks = await searchStocks();

  // Fetching watchlist items
  const watchlistItems = await getWatchlistItems(user.id);

  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/">
          <Image src="/assets/icons/logo.svg" alt="logo" width={140} height={32} className="h-8 w-auto cursor-pointer" />
        </Link>

        <nav className="hidden sm:block">
          {/* ---- Nav Items ---- */}
          <NavItems initialStocks={initialStocks} userId={user.id} watchlistItems={watchlistItems} />
        </nav>

        {/* ---- User Dropdown ---- */}
        <UserDropdown user={user} initialStocks={initialStocks} watchlistItems={watchlistItems} />
      </div>
    </header>
  )
}

export default Header