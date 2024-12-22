<script setup lang="ts">
import numberFormatter from "@/utils/numberFormatter";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Button from "@/components/ui/button/Button.vue";
import Image from "@/tags/Image.vue";
import {listStocks} from "@/services/BrapiDev";
import {listCryptoCurrencies} from "@/services/CoinGecko";
import {useCryptoCurrencyStore} from "@/stores/useCryptoCurrencyStore";
import {useStocksCurrencyStore} from "@/stores/useStocksCurrencyStore";
import {ref, onMounted, watch} from "vue";
import { CheckIcon } from "@radix-icons/vue";

const {stocksCurrencies} = useStocksCurrencyStore();
const {cryptoCurrencies} = useCryptoCurrencyStore();

interface HomeDatasTableData {
    id: string;
    name: string;
    image: string;
    price: number;
    change: number;
    volume: number;
    market_cap: number;
}

function formatData(type: "cryptos" | "stocks"): HomeDatasTableData[] {
    if (type === "cryptos") {
        if (cryptoCurrencies.length === 0) {
            return [];
        }

        return cryptoCurrencies.map((crypto) => ({
            id: crypto.id,
            name: crypto.name,
            image: crypto.image,
            price: crypto.current_price,
            change: crypto.price_change_percentage_24h,
            volume: crypto.circulating_supply,
            market_cap: crypto.market_cap,
        }));
    }

    if (stocksCurrencies.length === 0) {
        return [];
    }

    return stocksCurrencies.map((stock) => ({
        id: stock.stock,
        name: stock.name,
        image: stock.logo,
        price: stock.close,
        change: stock.change,
        volume: stock.volume,
        market_cap: stock.market_cap ?? 0,
    }));
}

const isLoading = ref<boolean>(true);
const isLoadingMore = ref<boolean>(false);
const cryptoStart = ref<number>(1);
const stocksPage = ref<number>(1);
const error = ref<boolean>(false);
const dataType = ref<"cryptos" | "stocks">(localStorage.getItem("dataType") as "cryptos" | "stocks" | null ?? "stocks");
const tableDatas = ref<HomeDatasTableData[]>([]);

async function dataTypeLoader(type: "cryptos" | "stocks") {
	if (type === "cryptos") {
		await listCryptoCurrencies(12, cryptoStart.value);
	} else {
		await listStocks(12, stocksPage.value);
	}

    tableDatas.value = formatData(type);
    localStorage.setItem("dataType", type);
}

async function loadMoreDatas(type: "cryptos" | "stocks") {
    if (type === "cryptos") {
        cryptoStart.value += 12;
    } else {
        stocksPage.value ++;
    }

	isLoadingMore.value = true;

	try {
		await dataTypeLoader(type);
	} catch (err) {
		console.error(err);
		error.value = true;
	}

	isLoadingMore.value = false;
}

onMounted(async () => {
	if (tableDatas.value.length === 0) {
		isLoading.value = true;

        const localDataType: "cryptos" | "stocks" | null = localStorage.getItem("dataType") as "cryptos" | "stocks" | null;

		try {
			await dataTypeLoader(localDataType ?? dataType.value);
		} catch (err) {
			console.error(err);
			error.value = true;
		}

		isLoading.value = false;
	}
});

watch(dataType, async (newVal) => {
    tableDatas.value = formatData(newVal);
    if (tableDatas.value.length === 0) {
        await dataTypeLoader(newVal);
    }

    localStorage.setItem("dataType", newVal);
});
</script>

<template>
    <ul class="w-full flex gap-2 -mb-6">
        <li class="flex flex-col gap-1">
            <span v-translate class="text-sm">Tipo de Dado</span>
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button v-translate variant="outline">
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
                        <DropdownMenuItem @click="dataType = 'cryptos'" class="cursor-pointer flex justify-between items-center">
                            <div>
                                <span v-html="'&#129689;'"></span>&nbsp;&nbsp;
                                <span v-translate>
                                    Cripto moedas
                                </span>
                            </div>
                            <CheckIcon v-if="dataType === 'cryptos'" />
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="dataType = 'stocks'" class="cursor-pointer flex justify-between items-center">
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
    <Table>
        <TableCaption>Listagem das suas {{ dataType === "cryptos" ? "criptomoedas" : "ações" }}.</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead class="w-52"><span v-translate>Nome</span></TableHead>
                <TableHead class="w-24"><span v-translate>Preço</span></TableHead>
                <TableHead class="w-20"><span>24h %</span></TableHead>
                <TableHead class="w-20"><span v-translate>Volume</span></TableHead>
                <TableHead class="w-40"><span v-translate>Capitalização de Mercado</span></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="(data, index) in tableDatas" :key="index">
                <TableCell>
                    <div class="flex gap-2 items-center">
                        <Image class="rounded-full" :src="data.image" alt="Logo" width="27" height="27" />
                        <RouterLink class="cursor-pointer hover:underline" :to="`/${dataType}/${data.id}`">
                            <h5>{{ data.name }}</h5>
                        </RouterLink>
                    </div>
                </TableCell>
                <TableCell>{{ dataType === "cryptos" ? "$" : "R$" }}{{ numberFormatter(data.price) }}</TableCell>
                <TableCell :class="{ 'text-positive': data.change > 0, 'text-negative': data.change < 0 }">
                    {{ data.change > 0 ? "+" : "" }}{{ numberFormatter(data.change) }}%
                </TableCell>
                <TableCell>{{ numberFormatter(data.volume) }}</TableCell>
                <TableCell>{{ numberFormatter(data.market_cap) }}</TableCell>
            </TableRow>
        </TableBody>
    </Table>
    <Button class="-mt-4" @click="loadMoreDatas(dataType)">Ver mais</Button>
</template>
