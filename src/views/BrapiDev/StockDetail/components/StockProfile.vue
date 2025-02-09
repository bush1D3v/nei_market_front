<script setup lang="ts">
import type {DetailedStock} from "@/types/BrapiDev/DetailedStock";

const props = defineProps<{
	data: DetailedStock["summaryProfile"];
}>();
</script>

<template>
    <ul>
        <li class="flex gap-2 items-end flex-wrap" v-if="props.data?.sector">
            <h4 v-translate>Setor</h4> -
            <span>{{ props.data.sector || 'Outros' }}</span>
        </li>
        <li class="flex gap-2 items-end flex-wrap" v-if="props.data?.industry">
            <h4 v-translate>Indústrias</h4> -
            <span>{{ props.data.industry }}</span>
        </li>
    </ul>
</template>
