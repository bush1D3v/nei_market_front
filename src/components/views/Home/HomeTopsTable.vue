<script setup lang="ts">
import Image from "@/tags/Image.vue";
import RouterLink from "@/tags/RouterLink.vue";
import numberFormatter from "@/utils/numberFormatter";
import type {TrendingCryptoCurrency} from "@/types/CoinGecko/TrendingCryptoCurrency";
import type {Stock} from "@/types/BrapiDev/Stock";
import type {New} from "@/types/Finnhub/New";
import Link from "@/tags/Link.vue";
import Tooltip from "@/components/Tooltip.vue";
import {ChevronUpIcon, ChevronDownIcon, QuestionMarkCircledIcon} from "@radix-icons/vue";
import i18next from "i18next";

interface Props {
	icon: string;
	tableTitle: string;
	redirectTo: "/cryptos" | "/news" | "/stocks";
	tooltipText: string;
	coins?: TrendingCryptoCurrency[];
	stocks?: Stock[];
	news?: New[];
}

const props = defineProps<Props>();
</script>

<template>
    <article>
        <div class="flex justify-between">
            <div class="flex gap-1 items-center">
                <span> {{ props.icon }} </span>
                <h4 v-translate> {{ props.tableTitle }} </h4>
                <Tooltip class="max-w-60">
                    <template #trigger>
                        <QuestionMarkCircledIcon class="ml-2 w-5 h-5 text-text" />
                    </template>
                    <template #content>
                        <p v-translate class="text-text font-bold text-sm">{{ props.tooltipText }}</p>
                    </template>
                </Tooltip>
            </div>
            <RouterLink v-translate :to="props.redirectTo" target="_self" class="text-link hover:underline mt-2 h-fit">
                Ver mais
            </RouterLink>
        </div>
        <hr class="h-[1px] w-full bg-gray-300" />
        <ul class="flex flex-col gap-2">
            <ul class="flex gap-4 -mb-2" v-if="!props.news">
                <li class="flex gap-2 min-w-40 max-w-40 md:min-w-60 md:max-w-60 justify-between items-end">
                    <p v-translate class="text-xs">Nome</p>
                    <p v-translate class="text-xs">Símbolo</p>
                </li>
                <li class="flex gap-2 items-center justify-start mt-1 w-full">
                    <p v-translate class="text-xs">Preço</p>
                    <p v-translate class="text-xs">Variação 24h %</p>
                </li>
            </ul>
            <li v-if="props.coins" v-for="data in props.coins" :key="`crypto ${data.id}`">
                <div class="li-first-container">
                    <div class="flex gap-2">
                        <Image class="rounded-full" :src="data.small" :alt="data.name + ' logo'" width="24"
                            height="24" />
                        <RouterLink :to="`/cryptos/${data.id}`" target="_self" class="hover:underline">
                            <h5 class="line-clamp-1 text-left"> {{ data.name }} </h5>
                            </ RouterLink>
                    </div>
                    <span class="hidden mn:flex text-dark"> {{ data.symbol.toUpperCase() }} </span>
                </div>
                <div class="li-second-container">
                    <span> ${{ numberFormatter(data.data.price) }} </span>
                    <span class="change"
                        :class="{ 'text-positive': data.data.price_change_percentage_24h.usd > 0, 'text-negative': data.data.price_change_percentage_24h.usd < 0 }">
                        <span v-if="data.data.price_change_percentage_24h.usd > 0"> + </span>
                        {{ numberFormatter(data.data.price_change_percentage_24h.usd) }}%&nbsp;
                        <ChevronUpIcon v-if="data.data.price_change_percentage_24h.usd > 0" />
                        <ChevronDownIcon v-else />
                    </span>
                </div>
            </li>
            <li v-else-if="props.stocks" v-for="data in props.stocks" :key="`stock ${data.stock}`">
                <div class="li-first-container">
                    <div class="flex gap-2">
                        <Image class="rounded-full" :src="data.logo" :alt="data.name + ' logo'" width="24"
                            height="24" />
                        <RouterLink :to="`/stocks/${data.stock}`" target="_self" class="hover:underline">
                            <h5 class="line-clamp-1 text-left"> {{ data.name }} </h5>
                            </ RouterLink>
                    </div>
                    <span class="hidden mn:flex text-dark"> {{ data.stock }} </span>
                </div>
                <div class="li-second-container">
                    <span> ${{ numberFormatter(data.close) }} </span>
                    <span class="change"
                        :class="{ 'text-positive': data.change > 0, 'text-negative': data.change < 0 }">
                        <span v-if="data.change > 0"> + </span>
                        {{ numberFormatter(data.change) }}%&nbsp;
                        <ChevronUpIcon v-if="data.change > 0" />
                        <ChevronDownIcon v-else />
                    </span>
                </div>
            </li>
            <li v-else-if="props.news" v-for="data in props.news" :key="`new ${data.id}`" class="flex gap-3">
                <Image :src="data.image" :alt="data.headline + ' logo'" width="82" height="47"
                    class="w-[82px] h-[47px] rounded-lg" />
                <div class="flex flex-col max-h-14 text-left">
                    <Link :href="data.url" target="_blank" class="hover:underline">
                    <h5 class="line-clamp-2 max-w-56 min-w-56 md:max-w-72 md:min-w-72 text-sm">
                        {{ data.headline }}
                    </h5>
                    </Link>
                    <span class="text-xs text-dark">{{ new Date(data.datetime *
                        1000).toLocaleDateString(i18next.language, {
                            month: 'short',
                            day: 'numeric'
                        }) }}</span>
                </div>
            </li>
        </ul>
    </article>
</template>

<style lang="css" scoped>
article {
    @apply flex flex-col justify-around md:justify-center bg-secondaryDarker rounded-lg gap-1 p-2 md:p-3 w-[320px] mn:w-[350px] h-[250px] md:w-[425px] md:h-[250px];
}

.li-first-container {
    @apply flex gap-2 min-w-40 max-w-40 md:min-w-60 md:max-w-60 justify-between items-end;
}

.li-second-container {
    @apply flex gap-2 items-center justify-between ml-2 mt-1 w-full;

    & span {
        @apply text-sm;
    }

    & span.change {
        @apply min-w-12 flex text-right;
    }
}

li {
    @apply flex gap-2 justify-around mn:justify-between text-center;
}

span {
    @apply text-sm md:text-base;
}
</style>
