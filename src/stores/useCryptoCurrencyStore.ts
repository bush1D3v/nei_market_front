import {ref} from "vue";
import {defineStore} from "pinia";
import type {CryptoCurrency} from "@/types/CoinGecko/CryptoCurrency";
import type {CryptoCompleted} from "@/types/CoinGecko/CryptoDetail";
import type {TrendingCryptoCurrency} from "@/types/CoinGecko/TrendingCryptoCurrency";

export const useCryptoCurrencyStore = defineStore("cryptoCurrency", () => {
	const cryptoCurrencies = ref<CryptoCurrency[]>([]);
	const homeTopsTableCryptoCurrencies = ref<TrendingCryptoCurrency[]>([]);
	const cryptosDetails = ref<Record<string, CryptoCompleted>>({});

	function addCryptoDetails(cryptoDetail: CryptoCompleted, slug: string): void {
		cryptosDetails.value[slug] = cryptoDetail;
	}

	function getCryptoDetail(slug: string): CryptoCompleted | null {
		return cryptosDetails.value[slug] || null;
	}

	function setCryptoDetail(slug: string, cryptoDetail: CryptoCompleted): void {
		cryptosDetails.value[slug] = cryptoDetail;
	}

	function setHomeTopsTableCryptoCurrencies(cryptoCurrencyArray: TrendingCryptoCurrency[]): void {
		homeTopsTableCryptoCurrencies.value = cryptoCurrencyArray;
	}

	function getHomeTopsTableCryptoCurrency(id: string): TrendingCryptoCurrency | null {
		return homeTopsTableCryptoCurrencies.value.find((crypto) => crypto.id === id) || null;
	}

	function addCryptoCurrencies(cryptoCurrencyArray: CryptoCurrency[]): void {
		cryptoCurrencies.value.push(...cryptoCurrencyArray);
	}

	function getCryptoCurrency(id: string): CryptoCurrency | null {
		return cryptoCurrencies.value.find((crypto) => crypto.id === id) || null;
	}

	return {
		cryptoCurrencies,
		homeTopsTableCryptoCurrencies,
		cryptosDetails,
		addCryptoDetails,
		setCryptoDetail,
		getCryptoDetail,
		setHomeTopsTableCryptoCurrencies,
		addCryptoCurrencies,
		getCryptoCurrency,
		getHomeTopsTableCryptoCurrency,
	};
});
