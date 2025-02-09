<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import EntityCardSkeleton from "@/components/Skeletons/components/EntityCard.vue";
import EntityCard from "@/components/EntityCard.vue";
import InternalServerError from "@/views/Exceptions/InternalServerError.vue";
import {listStocks} from "@/services/BrapiDev";
import {useStocksCurrencyStore} from "@/stores/useStocksCurrencyStore";
import {useInfiniteQuery} from "@tanstack/vue-query";
import {t} from "i18next";

const {stocksCurrencies} = useStocksCurrencyStore();

const {error, fetchNextPage, isLoading, isFetchingNextPage} = useInfiniteQuery({
	queryKey: ["stocks"],
	queryFn: async ({pageParam}) => await listStocks(12, pageParam),
	getNextPageParam: (_lastPage, allPages) => allPages.length + 1,
	enabled: stocksCurrencies.length === 0,
	initialPageParam: stocksCurrencies.length / 12 + 1,
});
</script>

<template>
    <section class="container justify-center my-4">
        <ul v-if="!error" class="flex gap-4 flex-wrap justify-center">
            <li v-if="!isLoading || stocksCurrencies.length !== 0" v-for="(stockCurrency, index) in stocksCurrencies"
                :key="index">
                <EntityCard type="stock" :image="stockCurrency.logo" :name="stockCurrency.name"
                    :symbol="stockCurrency.stock" :id="stockCurrency.type" :circulating_supply="stockCurrency.volume"
                    :price="stockCurrency.close" :market_cap="stockCurrency.market_cap || 0"
                    :router-link-to="`/stocks/${stockCurrency.stock}`" />
            </li>
            <EntityCardSkeleton v-else v-for="i in 12" :key="i" />
        </ul>
        <div v-if="!error" class="flex justify-center mt-4">
            <Button @click="async () => await fetchNextPage()" :disabled="isLoading || isFetchingNextPage">
                <span>{{ isFetchingNextPage ? t('Carregando...') : t('Carregar Mais') }}</span>
            </Button>
        </div>
        <InternalServerError v-if="error" />
    </section>
</template>
