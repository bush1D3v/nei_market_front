<script setup lang="ts">
import ArticleSkeleton from "@/components/Skeletons/components/views/CoinGecko/CryptoDetail/ArticleDescription.vue";
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";
import InternalServerError from "@/views/Exceptions/InternalServerError.vue";
import { useRoute } from "vue-router";
import { useCryptoCurrencyStore } from "@/stores/useCryptoCurrencyStore";
import { detailCrypto } from "@/services/CoinGecko";
import type { CryptoGraphDetail, CryptoCompleted } from "@/types/CoinGecko/CryptoDetail";
import type { ChartData } from "@/components/Chart/types/ChartData";
import Image from "@/tags/Image.vue";
import LinksList from "./components/LinksList.vue";
import ValuesList from "./components/ValuesList.vue";
import Charts from "./components/Charts.vue";
import { t } from "i18next";
import { useQuery } from "@tanstack/vue-query";

const { params } = useRoute();
const crypto = String(params.crypto);
document.title = `${capitalizeFirstLetter(crypto)} | NEI Market Analytics`;
const cryptoCurrencyStore = useCryptoCurrencyStore();

const { error, isLoading, data } = useQuery({
    queryKey: [ "crypto", crypto ],
    queryFn: async () => {
        const currency = (await detailCrypto(crypto)) as CryptoCompleted;
        const treatedPriceData = mapToTreatedPriceData(currency);
        const treatedVolumeData = mapToTreatedVolumeData(currency);
        const treatedMarketData = mapToTreatedMarketData(currency);

        return {
            crypto: currency.description,
            treatedPriceData,
            treatedVolumeData,
            treatedMarketData,
        };
    },
    enabled: !cryptoCurrencyStore.getCryptoDetail(crypto),
});

function mapToTreatedPriceData(detailedCrypto: CryptoGraphDetail): ChartData[] {
    const locale = navigator.language;
    return detailedCrypto.prices.map((data) => ({
        dynamicParams: [ "Price" ],
        chartData: [ data[ 1 ] ],
        name: capitalizeFirstLetter(
            new Date(data[ 0 ])
                .toLocaleString(locale, {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })
                .replace(",", " -"),
        ),
    }));
}

function mapToTreatedVolumeData(detailedCrypto: CryptoGraphDetail): ChartData[] {
    const locale = navigator.language;
    return detailedCrypto.total_volumes.map((data) => ({
        dynamicParams: [ "Volume" ],
        chartData: [ data[ 1 ] ],
        name: capitalizeFirstLetter(
            new Date(data[ 0 ])
                .toLocaleString(locale, {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })
                .replace(",", " -"),
        ),
    }));
}

function mapToTreatedMarketData(detailedCrypto: CryptoGraphDetail): ChartData[] {
    const locale = navigator.language;
    return detailedCrypto.market_caps.map((data) => ({
        dynamicParams: [ "Market" ],
        chartData: [ data[ 1 ] ],
        name: capitalizeFirstLetter(
            new Date(data[ 0 ])
                .toLocaleString(locale, {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })
                .replace(",", " -"),
        ),
    }));
}
</script>

<template>
    <section class="container justify-center mb-9">
        <article v-if="!isLoading && !error" class="flex flex-col gap-4">
            <div class="flex flex-col items-center md:flex-row justify-between gap-4">
                <div class="flex flex-col justify-between gap-2">
                    <div class="flex items-end gap-2">
                        <Image :src="data?.crypto?.image.small || ''" :alt="data?.crypto?.name + ' Logo' || ''"
                            width="50" height="50" />
                        <h1>{{ data?.crypto?.name || '' }}</h1>
                        <h2>- {{ data?.crypto?.symbol || '' }}</h2>
                    </div>
                    <LinksList :links="data?.crypto?.links" />
                </div>
                <ValuesList :marketCapRank="data?.crypto?.market_cap_rank" :marketData="data?.crypto?.market_data" />
            </div>
            <p class="line-clamp-4 md:line-clamp-6 lg:line-clamp-none"
                v-html="data?.crypto?.description.en || t('Sem Descrição')"></p>
            <ul class="flex gap-2 items-center flex-wrap">
                <h4 v-translate>Categorias</h4>
                <li v-for="(item, index) in data?.crypto?.categories" :key="item">
                    <span>{{ item }}</span>
                    &nbsp;<span v-if="index < (data?.crypto?.categories.length || 0) - 1">|</span>
                </li>
            </ul>
        </article>
        <ArticleSkeleton v-if="isLoading && !error" />
        <Charts v-if="!error" :crypto="crypto" :data="data" :isLoading="isLoading" />
        <InternalServerError v-if="error" />
    </section>
</template>
