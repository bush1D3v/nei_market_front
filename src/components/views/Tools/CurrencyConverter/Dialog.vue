<script setup lang="ts">
import {Button} from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@/components/ui/dialog";
import {useCurrencyQuotesStore} from "@/stores/useCurrencyQuotesStore";
import {ref, watch} from "vue";
import {Cross2Icon} from "@radix-icons/vue";
import {CurrencyQuotesDto} from "@/components/Dto/CurrencyQuotesDto";
import {t} from "i18next";
import numberFormatter from "@/utils/numberFormatter";

const currencyQuotesStore = useCurrencyQuotesStore();

const props = defineProps<{result: number | undefined; open: boolean}>();
const emit = defineEmits(["update:open"]);

const isOpen = ref(props.open);

const closeDialog = () => {
	isOpen.value = false;
};

watch(
	() => props.open,
	(newVal) => {
		isOpen.value = newVal;
	},
);

watch(isOpen, (newVal) => {
	emit("update:open", newVal);
});

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
</script>

<template>
    <Dialog :open="isOpen" :result="props.result" role="dialog" aria-labelledby="dialog-title"
        aria-describedby="dialog-description">
        <DialogTrigger as-child>
            <slot name="trigger" />
        </DialogTrigger>
        <DialogContent aria-describedby="dialog-description" class="sm:max-w-[425px]">
            <DialogClose as-child #close-dialog>
                <button @click="closeDialog" aria-label="Close dialog">
                    <Cross2Icon class="w-4 h-4" />
                </button>
            </DialogClose>
            <DialogHeader>
                <DialogTitle id="dialog-title" v-translate>Resultado da Conversão</DialogTitle>
            </DialogHeader>
            <p id="dialog-description">
                {{ t("A conversão de") }}
                <strong>
                    {{ currencyQuotesStore.currency }}
                    {{ currencyQuotesStore.leftCode }}
                </strong>
                {{ t("para") }}
                <strong>
                    {{ t(CurrencyQuotesDto[ currencyQuotesStore.rightCode ]) }}
                </strong>
                {{ t("resulta em") }}
                <strong>
                    {{ numberFormatter(props.result as number) }}
                    {{ currencyQuotesStore.rightCode }}
                </strong>.
            </p>
            <DialogFooter>
                <DialogClose as-child>
                    <Button v-translate @click="closeDialog" aria-label="Conclude">
                        Concluir
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<style lang="css" scoped>
strong {
    @apply text-text;
}
</style>
