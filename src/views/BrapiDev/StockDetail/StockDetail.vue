<script setup lang="ts">
import InternalServerError from "@/views/Exceptions/InternalServerError.vue";
import numberFormatter from "@/utils/numberFormatter";
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";
import transformDate from "@/utils/transformDate";
import type { DetailedStock } from "@/types/BrapiDev/DetailedStock";
import { stockDetail } from "@/services/BrapiDev";
import { useStocksCurrencyStore } from "@/stores/useStocksCurrencyStore";
import { useRoute } from "vue-router";
import type { ChartData } from "@/components/Chart/types/ChartData";
import Image from "@/tags/Image.vue";
import ValuesList from "./components/ValuesList.vue";
import Link from "@/tags/Link.vue";
import { HomeIcon } from "@radix-icons/vue";
import StockProfile from "./components/StockProfile.vue";
import Charts from "./components/Charts.vue";
import ArticleSkeleton from "@/components/Skeletons/components/views/BrapiDev/StockDetail/ArticleDescription.vue";
import { useQuery } from "@tanstack/vue-query";
import { t } from "i18next";

const { params } = useRoute();
const ticker = String(params.ticker);
document.title = `${capitalizeFirstLetter(ticker)} | NEI Market Analytics`;
const stocksCurrencyStore = useStocksCurrencyStore();

const { error, isLoading, data } = useQuery({
    queryKey: [ "stock", ticker ],
    queryFn: async () => {
        const stock = (await stockDetail(ticker)) as DetailedStock;
        const treatedMaximumMinimum = mapToTreatedMaximumMinimumData(stock);
        const treatedOpeningClosing = mapToTreatedOpeningClosingData(stock);
        const treatedVolume = mapToTreatedVolumeData(stock);
        return {
            stock,
            treatedMaximumMinimum,
            treatedOpeningClosing,
            treatedVolume,
        };
    },
    enabled: !stocksCurrencyStore.getDetailedStock(ticker),
});

function mapToTreatedMaximumMinimumData(detailedStock: DetailedStock): ChartData[] {
    return detailedStock.historicalDataPrice.map((data) => ({
        dynamicParams: [ t("Máximo"), t("Mínimo") ],
        chartData: [ numberFormatter(data.high), numberFormatter(data.low) ],
        name: capitalizeFirstLetter(transformDate(data.date)),
    }));
}

function mapToTreatedOpeningClosingData(detailedStock: DetailedStock): ChartData[] {
    return detailedStock.historicalDataPrice.map((data) => ({
        dynamicParams: [ t("Abertura"), t("Fechamento") ],
        chartData: [ data.open, data.close ],
        name: capitalizeFirstLetter(transformDate(data.date)),
    }));
}

function mapToTreatedVolumeData(detailedStock: DetailedStock): ChartData[] {
    return detailedStock.historicalDataPrice.map((data) => ({
        dynamicParams: [ t("Volume") ],
        chartData: [ data.volume ],
        name: capitalizeFirstLetter(transformDate(data.date)),
    }));
}
</script>

<template>
    <section class="container justify-center mb-9">
        <article v-if="!isLoading && !error" class="flex flex-col gap-4 w-full">
            <div class="flex flex-col items-center md:flex-row justify-between gap-4">
                <div class="flex flex-col md:flex-row justify-between gap-2 w-full">
                    <div class="flex flex-col items-start gap-2">
                        <div class="flex items-end gap-2">
                            <Image :src="data?.stock?.logourl || ''"
                                :alt="`${data?.stock?.shortName || data?.stock?.longName || data?.stock?.symbol} Logo`"
                                width="50" height="50" class="rounded-full" />
                            <h1>{{ data?.stock?.shortName || data?.stock?.longName || '' }}</h1>
                            <h2>- {{ data?.stock?.symbol || '' }}</h2>
                        </div>
                        <Link v-if="data?.stock?.summaryProfile?.website" :href="data?.stock.summaryProfile.website"
                            target="_blank" class="flex items-center gap-2 ml-1">
                        <HomeIcon class="w-5 h-5" />
                        </Link>
                    </div>
                    <ValuesList :data="data?.stock" />
                </div>
            </div>
            <p v-if="data?.stock?.summaryProfile?.longBusinessSummary"
                class="line-clamp-4 md:line-clamp-6 lg:line-clamp-none"
                v-html="data?.stock.summaryProfile.longBusinessSummary" />
            <StockProfile :data="data?.stock?.summaryProfile" />
        </article>
        <ArticleSkeleton v-if="isLoading && !error" />
        <Charts v-if="!error" :ticker="ticker" :data="data" :isLoading="isLoading" />
        <InternalServerError v-if="error" />
    </section>
</template>
