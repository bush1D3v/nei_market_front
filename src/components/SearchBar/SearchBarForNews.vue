<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useMagicKeys } from "@vueuse/core";
import { t } from "i18next";
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
import Image from "@/tags/Image.vue";
import ChatDots from "../Loading/ChatDots.vue";
import { useNewsStore } from "@/stores/useNewsStore";
import type { New } from "@/types/Finnhub/New";
import { listMarketNews } from "@/services/Finnhub";

const newsStore = useNewsStore();

const inputValue = ref<string>("");
const loading = ref<boolean>(false);
const error = ref<boolean>(false);
const searchResponse = ref<New[]>([]);

const searchValue = JSON.parse(
    localStorage.getItem("searchNewValue") || "[]",
) as New[];

let debounceTimeout: NodeJS.Timeout;

async function getNewsToRecommend(): Promise<void> {
    if (newsStore.news.crypto.length >= 2) return;

    loading.value = true;
    try {
        await listMarketNews();
    } catch (err) {
        console.error(err);
        error.value = true;
    } finally {
        loading.value = false;
    }
}

function searchCrypto(input: string): void {
    if (input.length === 0) return;

    try {
        const data = newsStore.searchNews(input) as New[];
        searchResponse.value = data.slice(0, 7);
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

function saveToLocalStorage(searchCrypto: New): void {
    if (!searchValue.some((item) => item.id === searchCrypto.id)) {
        if (searchValue.length === 4) {
            searchValue.pop();
        }
        searchValue.unshift(searchCrypto);
    }
    localStorage.setItem("searchNewValue", JSON.stringify(searchValue));
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

const { Meta_K, Ctrl_K } = useMagicKeys({
    passive: false,
    onEventFired(e) {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) e.preventDefault();
    },
});

watch([ Meta_K, Ctrl_K ], (v) => {
    if (v[ 0 ] || v[ 1 ]) handleOpenChange();
});

onMounted(async () => {
    await getNewsToRecommend();
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
                        :to="item.url" :value="`${item.headline} recent`" target="_blank">
                        <Image :alt="`${item.headline} image`" :src="item.image" width="28" height="28"
                            class="object-contain" />
                        <span class="ml-1 text-light line-clamp-1">{{ item.headline }}</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandEmpty>
                    <span v-if="!loading && !error" v-translate>Nenhum resultado encontrado.</span>
                    <ChatDots v-if="loading && !error" />
                    <span v-if="error" v-translate>Erro Interno do Servidor</span>
                </CommandEmpty>
                <CommandGroup :heading="t('Sugestões')" v-if="inputValue.length === 0">
                    <CommandItem v-for="(data) in newsStore.news.crypto.slice(0, 2)" :key="data.id"
                        :value="data.headline" :to="data.url" @click="saveToLocalStorage(data)" target="_blank">
                        <Image :alt="`${data.headline} image`" :src="data.image" width="28" height="28"
                            class="object-contain" />
                        <span class="ml-1 text-light line-clamp-1">{{ data.headline }}</span>
                    </CommandItem>
                </CommandGroup>
                <CommandGroup :heading="t('Recomendado')" v-if="inputValue.length > 0">
                    <CommandItem v-if="!loading" v-for="data in searchResponse" :value="data.headline" :to="data.url"
                        @click="saveToLocalStorage(data)" :key="data.id" target="_blank">
                        <Image :alt="`${data.headline} image`" :src="data.image" width="28" height="28"
                            class="object-contain" />
                        <span class="ml-1 text-light line-clamp-1">{{ data.headline }}</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    </Command>
</template>
