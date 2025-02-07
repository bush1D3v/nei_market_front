import type {
	CryptoCompleted,
	CryptoDataDescription,
	CryptoGraphDetail,
} from "@/types/CoinGecko/CryptoDetail";
import type {CryptoCurrency} from "@/types/CoinGecko/CryptoCurrency";
import {bus} from "@/events/coinGeckoEventEmitter";
import {get} from "@/server/HttpClient";
import translate from "@/utils/externalDataTranslator";
import type {SearchCrypto} from "@/types/CoinGecko/SearchCrypto";
import type {TrendingCryptoCurrency} from "@/types/CoinGecko/TrendingCryptoCurrency";

/**
 * @description Handles the request to get the cryptocurrency listing.
 *
 * @param {number} per_page - The limit number of cryptocurrencies to return
 * @param {number} page - The page number of cryptocurrencies to return
 * @returns Promise<CryptoCurrency[] | undefined>
 * @throws {Error} If the request to the proxy fails
 */
export async function listCryptoCurrencies(
	per_page = 12,
	page = 1,
): Promise<CryptoCurrency[] | undefined> {
	const url: string = `/coins/markets?vs_currency=usd&per_page=${per_page}&page=${page}&precision=2`;

	try {
		const response = await get(url);

		if (!response.ok) throw new Error(await response.json());

		const cryptos: CryptoCurrency[] = await response.json();

		bus.emit("getCryptoCurrencies", {cryptos});

		return cryptos;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

/**
 * @description Handles the request to get the cryptocurrency.
 *
 * @param {string} slug - The slug string
 * @returns Promise<CryptoCurrency | undefined>
 * @throws {Error} If the request to the proxy fails
 */
export async function detailCrypto(slug: string): Promise<CryptoCompleted | undefined> {
	const from = new Date();
	const to = new Date();

	from.setDate(from.getDate() - 31);

	let url = `/coins/${slug}/market_chart/range?vs_currency=usd&from=${from.getTime() / 1000}&to=${to.getTime() / 1000}`;

	try {
		const responseGraphDetail = await get(url);

		if (!responseGraphDetail.ok) throw new Error(await responseGraphDetail.json());

		const cryptoGraphData: CryptoGraphDetail = await responseGraphDetail.json();

		url = `/coins/${slug}`;

		const cryptoDetailData = await get(url);

		if (!cryptoDetailData.ok) throw new Error(await cryptoDetailData.json());

		const cryptoDescriptionData: CryptoDataDescription = await cryptoDetailData.json();

		cryptoDescriptionData.description.en = await translate(
			cryptoDescriptionData.description.en,
		);
		if (cryptoDescriptionData?.categories) {
			for (let i = 0; i < cryptoDescriptionData.categories.length; i++) {
				cryptoDescriptionData.categories[i] = await translate(
					cryptoDescriptionData.categories[i],
				);
			}
		}

		const crypto: CryptoCompleted = {
			description: cryptoDescriptionData,
			prices: cryptoGraphData.prices,
			market_caps: cryptoGraphData.market_caps,
			total_volumes: cryptoGraphData.total_volumes,
		};

		bus.emit("getDetailedCrypto", {crypto, slug});

		return crypto;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

/**
 * @description Handles the request to get the cryptocurrency based on the query.
 *
 * @param {string} query - The query string
 * @returns Promise<SearchCrypto[] | undefined>
 * @throws {Error} If the request to the proxy fails
 */
export async function searchCryptos(query: string): Promise<SearchCrypto[] | undefined> {
	const url = `/coins/search?query=${query}`;

	try {
		const response = await get(url);

		if (!response.ok) throw new Error(await response.json());

		const cryptos: SearchCrypto[] = await response.json();

		return cryptos.slice(0, 7);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

type GetTrendingCryptosResponse = [
	{
		item: TrendingCryptoCurrency;
	},
];

/**
 * @description Handles the request to get the trending cryptocurrencies.
 *
 * @returns Promise<SearchCrypto[] | undefined>
 * @throws {Error} If the request to the proxy fails
 */
export async function getTrendingCryptos(): Promise<GetTrendingCryptosResponse | undefined> {
	const url: string = "/coins/search/trending";
	try {
		const response = await get(url);

		if (!response.ok) throw new Error(await response.json());

		const cryptos: GetTrendingCryptosResponse = await response.json();

		bus.emit("getTrendingCrypto", {cryptos: cryptos.slice(0, 5).map((crypto) => crypto.item)});

		return cryptos;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
