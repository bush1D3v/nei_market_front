<script setup lang="ts">
import {ref, watch} from "vue";
import CurrencySelect from "@/components/views/Tools/CurrencyConverter/CurrencySelect.vue";
import ValueSelect from "@/components/views/Tools/CurrencyConverter/ValueSelect.vue";
import Dialog from "@/components/views/Tools/CurrencyConverter/Dialog.vue";
import Tooltip from "@/components/Tooltip.vue";
import type {Rates} from "@/types/CurrencyQuotes/Rates";
import {DoubleArrowRightIcon} from "@radix-icons/vue";
import {useCurrencyQuotesStore} from "@/stores/useCurrencyQuotesStore";
import {listCurrencyQuotes} from "@/services/CurrencyQuotes";
import {Button} from "@/components/ui/button";
import {CurrencyQuotesDtoValues} from "@/components/Dto/CurrencyQuotesDtoValues";
import {useQuery} from "@tanstack/vue-query";

const currencyQuotesStore = useCurrencyQuotesStore();

const isModalOpen = ref(false);
const crossRateResult = ref<number>();

const {data} = useQuery({
	queryKey: ["currencyQuotes"],
	queryFn: async () => await listCurrencyQuotes(),
	enabled: !currencyQuotesStore.currencyQuotes,
});

async function calculateCrossRate(): Promise<void> {
	let rates: Rates;

	if (currencyQuotesStore.currencyQuotes?.rates) {
		rates = currencyQuotesStore.currencyQuotes.rates;
	} else {
		if (data.value) {
			rates = data.value?.rates;
		} else {
			rates = CurrencyQuotesDtoValues;
		}
	}

	const rightRate = rates[currencyQuotesStore.rightCode as keyof typeof rates];
	const leftRate = rates[currencyQuotesStore.leftCode as keyof typeof rates];

	crossRateResult.value = (rightRate / leftRate) * currencyQuotesStore.currency;
	isModalOpen.value = true;
}

watch(
	() => currencyQuotesStore.leftCode,
	(value) => {
		currencyQuotesStore.leftCode = value;
	},
);

watch(
	() => currencyQuotesStore.rightCode,
	(value) => {
		currencyQuotesStore.rightCode = value;
	},
);

watch(
	() => currencyQuotesStore.currency,
	(value) => {
		currencyQuotesStore.currency = value;
	},
);
</script>

<template>
    <section class="max-w-5xl h-[80dvh] flex flex-col justify-center m-auto py-2 px-4">
        <div>
            <div class="flex items-center justify-between space-x-4">
                <h4 v-translate class="text-base md:text-xl lg:text-2xl pr-28">
                    Conversor de Moedas
                </h4>
            </div>
            <div class="space-y-2 flex flex-col gap-4">
                <div class="flex justify-between mt-2">
                    <div>
                        <p v-translate class="text-text">De</p>
                        <CurrencySelect direction="left" />
                    </div>
                    <div>
                        <p v-translate class="text-text">Para</p>
                        <CurrencySelect direction="right" />
                    </div>
                </div>
                <div class="w-full flex justify-between items-center">
                    <hr class="h-[1px] w-5/12" />
                    <Tooltip>
                        <template #trigger>
                            <Button variant="default" class="w-9 h-9 p-0 rounded-full"
                                @click="currencyQuotesStore.invertCodes">
                                <DoubleArrowRightIcon>
                                    revert
                                </DoubleArrowRightIcon>
                            </Button>
                        </template>
                        <template #content>
                            <p v-translate class="text-text">Inverter</p>
                        </template>
                    </Tooltip>
                    <hr class="h-[1px] w-5/12" />
                </div>
                <div class="flex justify-center">
                    <ValueSelect :currency="currencyQuotesStore.leftCode" direction="left" />
                </div>
                <Dialog v-model:open="isModalOpen" :result="crossRateResult">
                    <template #trigger>
                        <Button v-translate class="w-full" @click="calculateCrossRate">
                            Converter
                        </Button>
                    </template>
                </Dialog>
            </div>
        </div>
    </section>
</template>
