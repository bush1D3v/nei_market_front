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
import type {Stock} from "@/types/BrapiDev/Stock";
import {useStocksCurrencyStore} from "@/stores/useStocksCurrencyStore";
import {listStocks} from "@/services/BrapiDev";
import Image from "@/tags/Image.vue";
import ChatDots from "../Loading/ChatDots.vue";

const {stocksCurrencies} = useStocksCurrencyStore();

const inputValue = ref<string>("");
const loading = ref<boolean>(false);
const error = ref<boolean>(false);
const searchResponse = ref<Stock[]>([]);

const searchValue = JSON.parse(localStorage.getItem("searchStockValue") || "[]") as Stock[];

let debounceTimeout: NodeJS.Timeout;

async function searchStock(input: string): Promise<void> {
	if (input.length === 0) return;

	try {
		const data = (await listStocks(6, 1, undefined, undefined, input)) as Stock[];
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
		searchStock(input);
	}, 500);
}

function saveToLocalStorage(searchStock: Stock): void {
	if (!searchValue.some((item) => item.stock === searchStock.stock)) {
		if (searchValue.length === 4) {
			searchValue.pop();
		}
		searchValue.unshift(searchStock);
	}
	localStorage.setItem("searchStockValue", JSON.stringify(searchValue));
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
                    <CommandItem @click="saveToLocalStorage(item)" v-for="item in searchValue" :key="item.stock"
                        :to="`/stocks/${item.stock}`" :value="`${item.name} recent`">
                        <Image :alt="`${item.name} image`" :src="item.logo" width="25.7" height="25.7"
                            class="rounded-full" />
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
                    <CommandItem v-for="(data) in stocksCurrencies.slice(0, 2)" :key="data.stock" :value="data.name"
                        :to="`/stocks/${data.stock}`" @click="saveToLocalStorage(data)">
                        <Image :alt="`${data.name} image`" :src="data.logo" width="25.7" height="25.7"
                            class="rounded-full" />
                        <span class="ml-1 text-light">{{ data.name }}</span>
                    </CommandItem>
                </CommandGroup>
                <CommandGroup :heading="t('Recomendado')" v-if="inputValue.length > 0">
                    <CommandItem v-if="!loading" v-for="data in searchResponse" :value="data.name"
                        :to="`/stocks/${data.stock}`" @click="saveToLocalStorage(data)" :key="data.stock">
                        <Image :alt="`${data.name} image`" :src="data.logo" width="25.7" height="25.7"
                            class="rounded-full" />
                        <span class="ml-1 text-light">{{ data.name }}</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    </Command>
</template>
