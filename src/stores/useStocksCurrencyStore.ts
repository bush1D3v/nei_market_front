import {ref} from "vue";
import {defineStore} from "pinia";
import type {Stock} from "@/types/BrapiDev/Stock";
import type {DetailedStock} from "@/types/BrapiDev/DetailedStock";

export const useStocksCurrencyStore = defineStore("stocksCurrency", () => {
	const stocksCurrencies = ref<Stock[]>([]);
	const homeTopsTableStockCurrencies = ref<Stock[]>([]);
	const stocksDetails = ref<Record<string, DetailedStock>>({});

	function setDetailedStock(stockDetail: DetailedStock): void {
		stocksDetails.value[stockDetail.symbol] = stockDetail;
	}

	function getDetailedStock(symbol: string): DetailedStock | null {
		return stocksDetails.value[symbol] || null;
	}

	function setHomeTopsTableStockCurrencies(stockCurrencyArray: Stock[]): void {
		homeTopsTableStockCurrencies.value = stockCurrencyArray;
	}

	function addStocksCurrencies(stockCurrencyArray: Stock[]): void {
		stocksCurrencies.value.push(...stockCurrencyArray);
	}

	function detailStocksCurrency(name: string): Stock | null {
		const stocksCurrency = stocksCurrencies.value.find(
			(stocksCurrency) => stocksCurrency.name === name,
		);
		if (!stocksCurrency) {
			return null;
		}
		return stocksCurrency;
	}

	return {
		stocksCurrencies,
		homeTopsTableStockCurrencies,
		stocksDetails,
		setDetailedStock,
		getDetailedStock,
		setHomeTopsTableStockCurrencies,
		addStocksCurrencies,
		detailStocksCurrency,
	};
});
