<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import EntityCardSkeleton from "@/components/Skeletons/components/EntityCard.vue";
import EntityCard from "@/components/EntityCard.vue";
import InternalServerError from "@/views/Exceptions/InternalServerError.vue";
import {listCryptoCurrencies} from "@/services/CoinGecko";
import {useCryptoCurrencyStore} from "@/stores/useCryptoCurrencyStore";
import {useInfiniteQuery} from "@tanstack/vue-query";
import {t} from "i18next";

const {cryptoCurrencies} = useCryptoCurrencyStore();

const {error, fetchNextPage, isLoading, isFetchingNextPage} = useInfiniteQuery({
	queryKey: ["cryptos"],
	queryFn: async ({pageParam}) => await listCryptoCurrencies(12, pageParam),
	getNextPageParam: (_lastPage, allPages) => allPages.length + 1,
	enabled: cryptoCurrencies.length === 0,
	initialPageParam: cryptoCurrencies.length / 12 + 1,
});
</script>

<template>
    <section class="container justify-center my-4">
        <ul v-if="!error" class="flex gap-4 flex-wrap justify-center">
            <li v-if="!isLoading || cryptoCurrencies.length !== 0" v-for="data in cryptoCurrencies" :key="data.id">
                <EntityCard type="crypto" :image="data.image" :name="data.name" :symbol="data.symbol" :id="data.id"
                    :circulating_supply="data.total_volume" :price="data.current_price" :market_cap="data.market_cap"
                    :router-link-to="`/cryptos/${data.id}`" />
            </li>
            <EntityCardSkeleton v-else v-for="i in 12" :key="i" />
        </ul>
        <div v-if="!error" class="flex justify-center mt-4">
            <Button @click="async () => await fetchNextPage()" :disabled="isFetchingNextPage || isLoading">
                {{ isFetchingNextPage ? t('Carregando...') : t('Carregar Mais') }}
            </Button>
        </div>
        <InternalServerError v-if="error" />
    </section>
</template>
