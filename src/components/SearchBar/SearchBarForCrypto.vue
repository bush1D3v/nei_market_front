<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useMagicKeys} from "@vueuse/core";
import {t} from "i18next";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandDialog,
} from "@/components/ui/command";
import {useCryptoCurrencyStore} from "@/stores/useCryptoCurrencyStore";
import type {SearchCrypto} from "@/types/CoinGecko/SearchCrypto";
import {listCryptoCurrencies, searchCryptos} from "@/services/CoinGecko";
import Image from "@/tags/Image.vue";
import type {CryptoCurrency} from "@/types/CoinGecko/CryptoCurrency";
import ChatDots from "../Loading/ChatDots.vue";

interface StorageSearchCrypto {
	id: string;
	name: string;
	thumb: string;
	api_symbol?: string;
	symbol?: string;
	market_cap_rank?: number;
	large?: string;
}

const {cryptoCurrencies} = useCryptoCurrencyStore();

const inputValue = ref<string>("");
const loading = ref<boolean>(false);
const error = ref<boolean>(false);
const searchResponse = ref<SearchCrypto[]>([]);

const searchValue = JSON.parse(
	localStorage.getItem("searchCryptoValue") || "[]",
) as StorageSearchCrypto[];

let debounceTimeout: NodeJS.Timeout;

async function getCryptosToRecommend(): Promise<void> {
	if (cryptoCurrencies.length >= 2) return;

	loading.value = true;
	try {
		(await listCryptoCurrencies()) as CryptoCurrency[];
	} catch (err) {
		console.error(err);
		error.value = true;
	} finally {
		loading.value = false;
	}
}

async function searchCrypto(input: string): Promise<void> {
	if (input.length === 0) return;

	try {
		const data = (await searchCryptos(input)) as SearchCrypto[];
		searchResponse.value = data;
	} catch (err) {
		console.error(err);
		error.value = true;
	} finally {
		loading.value = false;
	}
}

function debounceSearch(input: string): void {
	inputValue.value = input;
	loading.value = true;

	clearTimeout(debounceTimeout);
	debounceTimeout = setTimeout(() => {
		searchCrypto(input);
	}, 500);
}

function saveToLocalStorage(searchCrypto: StorageSearchCrypto): void {
	if (!searchValue.some((item) => item.id === searchCrypto.id)) {
		if (searchValue.length === 4) {
			searchValue.pop();
		}
		searchValue.unshift(searchCrypto);
	}
	localStorage.setItem("searchCryptoValue", JSON.stringify(searchValue));
	inputValue.value = "";
	blur();
}

const isFocused = ref<boolean>(false);

function focus() {
	inputValue.value = "";
	isFocused.value = true;
}
function blur() {
	isFocused.value = false;
}
function handleOpenChange() {
	isFocused.value = !isFocused.value;
}

const {Meta_K, Ctrl_K} = useMagicKeys({
	passive: false,
	onEventFired(e) {
		if (e.key === "k" && (e.metaKey || e.ctrlKey)) e.preventDefault();
	},
});

watch([Meta_K, Ctrl_K], (v) => {
	if (v[0] || v[1]) handleOpenChange();
});

onMounted(async () => {
	await getCryptosToRecommend();
	blur();
});
</script>

<template>
    <Command class="group rounded-lg border shadow-md max-w-80 md:max-w-[450px] mx-0 z-50 relative duration-300">
        <div class="w-full" cmdk-input-wrapper>
            <CommandInput @click="focus" :icon-text="'dark'" :placeholder="t('Pesquisar...')" class="w-full"
                name="fake-search" @keydown.prevent />
        </div>
        <kbd
            class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium text-text opacity-100 absolute top-[10px] right-4 bg-transparent my-0">
            <span class="text-xs">⌘</span>K
        </kbd>
        <CommandDialog v-model:open="isFocused" :title="t('Pesquisar')">
            <div class="flex items-center border-b bg-darkAlt pl-4" cmdk-input-wrapper>
                <CommandInput :placeholder="t('Pesquisar...')" @input="debounceSearch($event.target.value)"
                    :icon-text="'light'" name="search" />
            </div>
            <CommandList>
                <CommandGroup :heading="t('Recentes')" v-if="searchValue.length > 0 && inputValue.length === 0">
                    <CommandItem @click="saveToLocalStorage(item)" v-for="item in searchValue" :key="item.id"
                        :to="`/cryptos/${item.id}`" :value="`${item.name} recent`">
                        <Image :alt="`${item.name} image`" :src="item.thumb" width="24" height="24" />
                        <span class="ml-1 text-light">{{ item.name }}</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandEmpty>
                    <span v-if="!loading && !error" v-translate>Nenhum resultado encontrado.</span>
                    <ChatDots v-if="loading && !error" />
                    <span v-if="error" v-translate>Erro Interno do Servidor</span>
                </CommandEmpty>
                <CommandGroup :heading="t('Sugestões')" v-if="inputValue.length === 0">
                    <CommandItem v-for="(data) in cryptoCurrencies.slice(0, 2)" :key="data.id" :value="data.name"
                        :to="`/cryptos/${data.id}`"
                        @click="saveToLocalStorage({ id: data.id, name: data.name, thumb: data.image })">
                        <Image :alt="`${data.name} image`" :src="data.image" width="24" height="24" />
                        <span class="ml-1 text-light">{{ data.name }}</span>
                    </CommandItem>
                </CommandGroup>
                <CommandGroup :heading="t('Recomendado')" v-if="inputValue.length > 0">
                    <CommandItem v-if="!loading" v-for="data in searchResponse" :value="data.name"
                        :to="`/cryptos/${data.id}`" @click="saveToLocalStorage(data)" :key="data.id">
                        <Image :alt="`${data.name} image`" :src="data.thumb" width="24" height="24" />
                        <span class="ml-1 text-light">{{ data.name }}</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    </Command>
</template>
