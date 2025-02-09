<script setup lang="ts">
import type {ChartData} from "./types/ChartData";
import {AreaChart} from "@/components/ui/chart-area";
import dataTreat from "./treats/dataTreat";
import numberFormatter from "@/utils/numberFormatter";

const props = defineProps<{data: ChartData[]; type: "stock" | "crypto"; price?: boolean}>();
const categories: "name"[] = props.data[0].dynamicParams as "name"[];
const colors = props.data[0].colors ?? ["#25faa4", "#eb3434"];
const data = dataTreat(props.data);
const yFormatter = (tick: number | string, _i: number): string => {
	if (typeof tick === "number") {
		if (props.type === "stock" && props.price) {
			return `R$${numberFormatter(tick)}`;
		}
		if (props.type === "crypto" && props.price) {
			return `$${numberFormatter(tick)}`;
		}
		return numberFormatter(tick);
	}
	return tick as string;
};
</script>

<template>
    <AreaChart :data="data" index="name" :categories="categories" :colors="colors" :filter-opacity="0.5"
        :rounded-corners="4" :margin="{ top: 0, bottom: 0, left: 0, right: 0 }" :y-formatter="yFormatter" />
</template>
