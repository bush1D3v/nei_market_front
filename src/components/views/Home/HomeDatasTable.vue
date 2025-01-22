<script setup lang="ts">
import numberFormatter from "@/utils/numberFormatter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import HomeDatasTableSkeleton from "@/components/Skeletons/components/views/Home/HomeDatasTableSkeleton.vue";
import Button from "@/components/ui/button/Button.vue";
import Image from "@/tags/Image.vue";
import { listStocks } from "@/services/BrapiDev";
import { listCryptoCurrencies } from "@/services/CoinGecko";
import { useCryptoCurrencyStore } from "@/stores/useCryptoCurrencyStore";
import { useStocksCurrencyStore } from "@/stores/useStocksCurrencyStore";
import { ref, onMounted, watch } from "vue";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-icons/vue";
import type { Stock } from "@/types/BrapiDev/Stock";
import type { CryptoCurrency } from "@/types/CoinGecko/CryptoCurrency";

const stocksStore = useStocksCurrencyStore();
const cryptoStore = useCryptoCurrencyStore();

const isLoading = ref<boolean>(true);
const isLoadingMore = ref<boolean>(false);
const cryptoStart = ref<number>(1);
const stocksPage = ref<number>(1);
const error = ref<boolean>(false);
const tableData = ref<Stock[] | CryptoCurrency[]>([]);
const initialTableData = ref<Stock[] | CryptoCurrency[]>([]);

interface TableCellsOrdination {
    price: "default" | "asc" | "desc";
    percentage: "default" | "asc" | "desc";
    volume: "default" | "asc" | "desc";
    market_cap: "default" | "asc" | "desc";
}

const sortOrder = ref<TableCellsOrdination>({
    price: "default",
    percentage: "default",
    volume: "default",
    market_cap: "default",
});

function reorderTableCell(cell: keyof TableCellsOrdination, order: "default" | "asc" | "desc") {
    if (order === "default") {
        tableData.value = [ ...initialTableData.value ];
        return;
    }
    let cellToReorder: keyof TableCellsOrdination | "current_price" | "price_change_24h" | "total_volume" | "close" | "change" = cell;

    sortOrder.value = {
        price: "default",
        percentage: "default",
        volume: "default",
        market_cap: "default",
    };

    sortOrder.value[ cell ] = order;

    if (cell === "price" && dataType.value === "cryptos") {
        cellToReorder = "current_price";
    } else if (cell === "price" && dataType.value === "stocks") {
        cellToReorder = "close";
    }

    if (cell === "percentage" && dataType.value === "cryptos") {
        cellToReorder = "price_change_24h"
    } else if (cell === "percentage" && dataType.value === "stocks") {
        cellToReorder = "change";
    }

    if (cell === "volume" && dataType.value === "cryptos") {
        cellToReorder = "total_volume";
    }

    tableData.value.sort((a, b) => {
        if (order === "asc") {
            return a[ cellToReorder ] - b[ cellToReorder ];
        }
        return b[ cellToReorder ] - a[ cellToReorder ];
    });
}

const dataType = ref<"cryptos" | "stocks">(
    (localStorage.getItem("dataType") as "cryptos" | "stocks" | null) ?? "stocks",
);

async function dataTypeLoader(type: "cryptos" | "stocks") {
    if (type === "cryptos") {
        await listCryptoCurrencies(12, cryptoStart.value);

    } else {
        await listStocks(12, stocksPage.value);
    }

    localStorage.setItem("dataType", type);
}

async function loadMoreDatas(type: "cryptos" | "stocks") {
    isLoadingMore.value = true;

    if (type === "cryptos") {
        cryptoStart.value += 12;
    } else {
        stocksPage.value++;
    }

    try {
        await dataTypeLoader(type);
    } catch (err) {
        console.error(err);
        error.value = true;
    }

    isLoadingMore.value = false;
}

onMounted(async () => {
    isLoading.value = true;
    const localDataType: "cryptos" | "stocks" | null = localStorage.getItem("dataType") as
        | "cryptos"
        | "stocks"
        | null;
    const useType = localDataType ?? dataType.value;
    if (
        (useType === "cryptos" && cryptoStore.cryptoCurrencies.length === 0) ||
        (useType === "stocks" && stocksStore.stocksCurrencies.length === 0)
    ) {
        try {
            await dataTypeLoader(useType);
        } catch (err) {
            console.error(err);
            error.value = true;
        }
    }
    initialTableData.value = useType === "cryptos" ? [ ...cryptoStore.cryptoCurrencies ] : [ ...stocksStore.stocksCurrencies ];
    tableData.value = useType === "cryptos" ? [ ...cryptoStore.cryptoCurrencies ] : [ ...stocksStore.stocksCurrencies ];
    isLoading.value = false;
});

watch(dataType, async (newVal) => {
    sortOrder.value = {
        price: "default",
        percentage: "default",
        volume: "default",
        market_cap: "default",
    };

    if (
        (newVal === "cryptos" && cryptoStore.cryptoCurrencies.length === 0) ||
        (newVal === "stocks" && stocksStore.stocksCurrencies.length === 0)
    ) {
        isLoading.value = true;
        await dataTypeLoader(newVal);
        isLoading.value = false;
    }

    initialTableData.value = newVal === "cryptos" ? [ ...cryptoStore.cryptoCurrencies ] : [ ...stocksStore.stocksCurrencies ];
    tableData.value = newVal === "cryptos" ? [ ...cryptoStore.cryptoCurrencies ] : [ ...stocksStore.stocksCurrencies ];

    localStorage.setItem("dataType", newVal);
});
</script>

<template>
    <ul class="w-full flex gap-2 -mb-6">
        <li class="flex flex-col gap-1">
            <span v-translate class="text-sm">Tipo de Dado</span>
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button v-translate variant="outline" :disabled="isLoading">
                        Selecione
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-56 absolute -right-[183px]">
                    <DropdownMenuLabel>
                        <span v-translate>
                            Escolha um Tipo de Dado
                        </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem @click="dataType = 'cryptos'"
                            class="cursor-pointer flex justify-between items-center">
                            <div>
                                <span v-html="'&#129689;'"></span>&nbsp;&nbsp;
                                <span v-translate>
                                    Criptomoedas
                                </span>
                            </div>
                            <CheckIcon v-if="dataType === 'cryptos'" />
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="dataType = 'stocks'"
                            class="cursor-pointer flex justify-between items-center">
                            <div>
                                <span v-html="'&#128188;'"></span>&nbsp;&nbsp;
                                <span v-translate>
                                    Ações
                                </span>
                            </div>
                            <CheckIcon v-if="dataType === 'stocks'" />
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </li>
    </ul>
    <Table v-if="!isLoading">
        <TableHeader>
            <TableRow>
                <TableHead>
                    <div class="w-52 flex gap-2 items-center">
                        <span v-translate>Nome</span>
                    </div>
                </TableHead>
                <TableHead>
                    <div class="w-24 flex gap-2 items-center">
                        <span v-translate>Preço</span>
                        <div>
                            <ChevronUpIcon
                                @click="reorderTableCell('price', sortOrder.price === 'asc' ? 'default' : 'asc')"
                                class="cursor-pointer hover:bg-accent bg-opacity-50 duration-150 rounded-full"
                                :class="(sortOrder.price === 'asc' ? 'bg-accent' : (sortOrder.price === 'default' ? '' : ''))" />
                            <ChevronDownIcon
                                @click="reorderTableCell('price', sortOrder.price === 'desc' ? 'default' : 'desc')"
                                class="cursor-pointer hover:bg-accent bg-opacity-50 duration-150 rounded-full"
                                :class="(sortOrder.price === 'desc' ? 'bg-accent' : (sortOrder.price === 'default' ? '' : ''))" />
                        </div>
                    </div>
                </TableHead>
                <TableHead>
                    <div class="w-20 flex gap-2 items-center">
                        <span>24h %</span>
                        <div>
                            <ChevronUpIcon
                                @click="reorderTableCell('percentage', sortOrder.percentage === 'asc' ? 'default' : 'asc')"
                                class="cursor-pointer hover:bg-accent bg-opacity-50 duration-150 rounded-full"
                                :class="(sortOrder.percentage === 'asc' ? 'bg-accent' : (sortOrder.price === 'default' ? '' : ''))" />
                            <ChevronDownIcon
                                @click="reorderTableCell('percentage', sortOrder.percentage === 'desc' ? 'default' : 'desc')"
                                class="cursor-pointer hover:bg-accent bg-opacity-50 duration-150 rounded-full"
                                :class="(sortOrder.percentage === 'desc' ? 'bg-accent' : (sortOrder.price === 'default' ? '' : ''))" />
                        </div>
                    </div>
                </TableHead>
                <TableHead>
                    <div class="w-20 flex gap-2 items-center">
                        <span v-translate>Volume</span>
                        <div>
                            <ChevronUpIcon
                                @click="reorderTableCell('volume', sortOrder.volume === 'asc' ? 'default' : 'asc')"
                                class="cursor-pointer hover:bg-accent bg-opacity-50 duration-150 rounded-full"
                                :class="(sortOrder.volume === 'asc' ? 'bg-accent' : (sortOrder.price === 'default' ? '' : ''))" />
                            <ChevronDownIcon
                                @click="reorderTableCell('volume', sortOrder.volume === 'desc' ? 'default' : 'desc')"
                                class="cursor-pointer hover:bg-accent bg-opacity-50 duration-150 rounded-full"
                                :class="(sortOrder.volume === 'desc' ? 'bg-accent' : (sortOrder.price === 'default' ? '' : ''))" />
                        </div>
                    </div>
                </TableHead>
                <TableHead>
                    <div class="w-40 flex gap-2 items-center">
                        <span v-translate>Capitalização de Mercado</span>
                        <div>
                            <ChevronUpIcon
                                @click="reorderTableCell('market_cap', sortOrder.market_cap === 'asc' ? 'default' : 'asc')"
                                class="cursor-pointer hover:bg-accent bg-opacity-50 duration-150 rounded-full"
                                :class="(sortOrder.market_cap === 'asc' ? 'bg-accent' : (sortOrder.price === 'default' ? '' : ''))" />
                            <ChevronDownIcon
                                @click="reorderTableCell('market_cap', sortOrder.market_cap === 'desc' ? 'default' : 'desc')"
                                class="cursor-pointer hover:bg-accent bg-opacity-50 duration-150 rounded-full"
                                :class="(sortOrder.market_cap === 'desc' ? 'bg-accent' : (sortOrder.price === 'default' ? '' : ''))" />
                        </div>
                    </div>
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody v-if="dataType === 'cryptos'">
            <TableRow v-for="(data, index) in (tableData as CryptoCurrency[])" :key="index">
                <TableCell>
                    <div class="flex gap-2 items-center w-40 md:w-52">
                        <Image class="rounded-full" :src="data.image" alt="Logo" width="27" height="27" />
                        <RouterLink class="cursor-pointer hover:underline" :to="`/${dataType}/${data.id}`">
                            <h5 class="text-sm md:text-lg lg:text-xl font-semibold line-clamp-1">{{ data.name }}</h5>
                        </RouterLink>
                    </div>
                </TableCell>
                <TableCell>${{ numberFormatter(data.current_price) }}</TableCell>
                <TableCell
                    :class="{ 'text-positive': data.price_change_percentage_24h > 0, 'text-negative': data.price_change_percentage_24h < 0 }">
                    {{ data.price_change_percentage_24h > 0 ? "+" : "" }}{{
                        numberFormatter(data.price_change_percentage_24h) }}%
                </TableCell>
                <TableCell>{{ numberFormatter(data.circulating_supply) }}</TableCell>
                <TableCell>{{ numberFormatter(data.market_cap) }}</TableCell>
            </TableRow>
        </TableBody>
        <TableBody v-if="dataType === 'stocks'">
            <TableRow v-for="(data, index) in (tableData as Stock[])" :key="index">
                <TableCell>
                    <div class="flex gap-2 items-center w-40 md:w-52">
                        <Image class="rounded-full" :src="data.logo" alt="Logo" width="27" height="27" />
                        <RouterLink class="cursor-pointer hover:underline" :to="`/${dataType}/${data.stock}`">
                            <h5 class="text-sm md:text-lg lg:text-xl font-semibold line-clamp-1">{{ data.name }}</h5>
                        </RouterLink>
                    </div>
                </TableCell>
                <TableCell>R${{ numberFormatter(data.close) }}</TableCell>
                <TableCell :class="{ 'text-positive': data.change > 0, 'text-negative': data.change < 0 }">
                    {{ data.change > 0 ? "+" : "" }}{{ numberFormatter(data.change) }}%
                </TableCell>
                <TableCell>{{ numberFormatter(data.volume) }}</TableCell>
                <TableCell>{{ numberFormatter(data.market_cap ?? 0) }}</TableCell>
            </TableRow>
        </TableBody>
    </Table>
    <HomeDatasTableSkeleton v-else />
    <Button class="-mt-4" @click="loadMoreDatas(dataType)" :disabled="isLoadingMore || isLoading">
        {{ isLoadingMore ? "Carregando..." : "Ver mais" }}
    </Button>
</template>
