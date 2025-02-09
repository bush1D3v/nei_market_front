import {bus} from "@/events/brapiDevEventEmitter";
import {get} from "@/server/HttpClient";
import type {DetailedStock} from "@/types/BrapiDev/DetailedStock";
import type {SortBy} from "@/types/BrapiDev/SortBy";
import type {SortOrder} from "@/types/BrapiDev/SortOrder";
import type {Stock} from "@/types/BrapiDev/Stock";
import type {ValidIntervals} from "@/types/BrapiDev/ValidIntervals";
import type {ValidRanges} from "@/types/BrapiDev/ValidRanges";
import translate from "@/utils/externalDataTranslator";

/**
 * @description Handles the request to get the list of currency quotes.
 *
 * @param {number} limit - The limit number of cryptocurrencies to return
 * @param {number} page - The page number of cryptocurrencies to return
 * @param {SortBy} sortBy - The field to sort by
 * @param {SortOrder} sortOrder - The order to sort by
 * @param {string} search - The search query
 * @returns Promise<Stock[] | undefined>
 * @throws {Error} If the request to the proxy fails
 */
export async function listStocks(
	limit = 12,
	page = 1,
	sortBy?: SortBy,
	sortOrder?: SortOrder,
	search?: string,
): Promise<Stock[] | undefined> {
	let url: string;

	const searchQuery = search ? `search=${search}&` : "";

	if (sortBy && sortOrder) {
		url = `/quote/list?${searchQuery}limit=${limit}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
	} else {
		url = `/quote/list?${searchQuery}limit=${limit}&page=${page}`;
	}

	try {
		const response = await get(url);

		if (!response.ok) throw new Error(await response.json());

		const stocks: Stock[] = await response.json();

		if (!sortBy && !sortOrder) {
			bus.emit("getCurrencyStocks", {stocks});
		} else {
			bus.emit("getHomeCurrencyStocks", {stocks});
		}

		return stocks;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

/**
 * @description Handles the request to get the currency quotes.
 *
 * @param {string} ticker - The ticker of the currency
 * @param {ValidRanges} range - The range of the currency quotes
 * @param {ValidIntervals} interval - The interval of the currency quotes
 * @returns Promise<DetailedStock | undefined>
 * @throws {Error} If the request to the proxy fails
 */
export async function stockDetail(
	ticker: string,
	range: ValidRanges = "1mo",
	interval: ValidIntervals = "1d",
): Promise<DetailedStock | undefined> {
	const url = `/quote/${ticker}?range=${range}&interval=${interval}&modules=summaryProfile`;
	try {
		const response = await get(url);

		if (!response.ok) throw new Error(await response.json());

		const detailedStock: DetailedStock = await response.json();

		if (detailedStock.historicalDataPrice.length > 0) {
			if (detailedStock.summaryProfile?.longBusinessSummary) {
				detailedStock.summaryProfile.longBusinessSummary = await translate(
					detailedStock.summaryProfile.longBusinessSummary,
				);
			}

			if (detailedStock.summaryProfile?.sector) {
				detailedStock.summaryProfile.sector = await translate(
					detailedStock.summaryProfile.sector,
				);
			}

			if (detailedStock.summaryProfile?.industry) {
				detailedStock.summaryProfile.industry = await translate(
					detailedStock.summaryProfile.industry,
				);
			}

			bus.emit("getDetailedStock", {detailedStock});
		}

		return detailedStock;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
