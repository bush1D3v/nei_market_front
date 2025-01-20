<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useMagicKeys} from "@vueuse/core";
import {RoutesEnum} from "@/enum/RoutesEnum";
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
import {Coins, BriefcaseBusiness} from "lucide-vue-next";

const inputValue = ref<string>("");
const searchValue = JSON.parse(localStorage.getItem("searchRouteValue") || "[]") as string[];

function saveToLocalStorage(input: string): void {
	const treatedValue = RoutesEnum.findClosestTextMatch(input) as string;
	if (
		!searchValue.includes(treatedValue) &&
		treatedValue !== undefined &&
		treatedValue !== "" &&
		treatedValue !== null
	) {
		if (searchValue.length === 4) {
			searchValue.pop();
		}
		searchValue.unshift(treatedValue);
	}
	localStorage.setItem("searchRouteValue", JSON.stringify(searchValue));
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

onMounted(() => {
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
                <CommandInput :placeholder="t('Pesquisar...')" @input="inputValue = $event.target.value"
                    :icon-text="'light'" name="search" />
            </div>
            <CommandList>
                <CommandGroup :heading="t('Recentes')" v-if="searchValue.length > 0 && inputValue.length === 0">
                    <CommandItem @click="saveToLocalStorage(item)" v-for="item in searchValue" :key="item"
                        :to="RoutesEnum.findClosestRouteMatch(item)" :value="item + ' recent'">
                        <component :is="RoutesEnum.findClosestIconMatch(item)" />
                        <span class="ml-2 text-light">{{ item }}</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandEmpty>
                    <span v-translate>Nenhum resultado encontrado.</span>
                </CommandEmpty>
                <CommandGroup :heading="t('Sugestões')" v-if="inputValue.length === 0">
                    <CommandItem :value="t('Criptomoedas')" to="/cryptos"
                        @click="saveToLocalStorage(t('Criptomoedas'))">
                        <Coins />
                        <span v-translate class="ml-1 text-light">Criptomoedas</span>
                    </CommandItem>
                    <CommandItem :value="t('Ações')" to="/stocks" @click="saveToLocalStorage(t('Ações'))">
                        <BriefcaseBusiness />
                        <span v-translate class="ml-1 text-light">Ações</span>
                    </CommandItem>
                </CommandGroup>
                <CommandGroup :heading="t('Recomendado')" v-if="inputValue.length > 0">
                    <CommandItem v-for="(path, name) in RoutesEnum.getRouteMappings()" :value="name" :to="path"
                        @click="saveToLocalStorage(name as string)" :key="name">
                        <component :is="RoutesEnum.findClosestIconMatch(name as string)" />
                        <span class="text-light">{{ name }}</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    </Command>
</template>
