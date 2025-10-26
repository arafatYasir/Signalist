import TradingViewWidget from "@/components/TradingViewWidget"
import { MARKET_OVERVIEW_WIDGET_CONFIG } from "@/lib/constants"

const HomePage = () => {
  const baseScriptUrl = "https://s3.tradingview.com/external-embedding/embed-widget-";

  return (
    <div className="flex min-h-screen home-wrapper">
      <section className="grid w-full gap-8 home-section">
        <div className="md:col-span-1 xl:col-span-1">
          <TradingViewWidget
            title="Market Overview"
            scriptUrl={baseScriptUrl + "market-overview.js"}
            config={MARKET_OVERVIEW_WIDGET_CONFIG}
            className="custom-chart"
            height={600}
          />
        </div>

        <div className="md:col-span-1 xl:col-span-2">
          <TradingViewWidget
            title="Stock Heatmap"
            scriptUrl={baseScriptUrl + "stock-heatmap.js"}
            config={MARKET_OVERVIEW_WIDGET_CONFIG}
            className="custom-chart"
            height={600}
          />
        </div>
      </section>
    </div>
  )
}

export default HomePage