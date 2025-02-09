<script setup lang="ts">
import type {ChartData} from "@/components/Chart/types/ChartData";
import AreaChart from "@/components/Chart/AreaChart.vue";
import AreaChartSkeleton from "@/components/Skeletons/components/Chart/AreaChart.vue";
import BarChart from "@/components/Chart/BarChart.vue";
import BarChartSkeleton from "@/components/Skeletons/components/Chart/BarChart.vue";
import LineChart from "@/components/Chart/LineChart.vue";
import LineChartSkeleton from "@/components/Skeletons/components/Chart/LineChart.vue";
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
import {CheckIcon} from "@radix-icons/vue";
import {ChartArea, ChartColumn, ChartLine} from "lucide-vue-next";
import {ref} from "vue";

type DataType = "line" | "bar" | "area";
interface Props {
	ticker: string;
	data: {
		treatedMaximumMinimum: ChartData[];
		treatedOpeningClosing: ChartData[];
		treatedVolume: ChartData[];
	};
	isLoading: boolean;
}

function setDatas(
	localStorageName: "stockMaximumMinimus" | "stockOpeningClosing" | "stockVolume",
	type: "line" | "bar" | "area",
): void {
	localStorage.setItem(localStorageName, type);
	switch (localStorageName) {
		case "stockMaximumMinimus":
			stockMaximumMinimus.value = type;
			break;
		case "stockOpeningClosing":
			stockOpeningClosing.value = type;
			break;
		case "stockVolume":
			stockVolume.value = type;
			break;
	}
}

const props = defineProps<Props>();
const stockMaximumMinimus = ref<DataType>(
	(localStorage.getItem("stockMaximumMinimus") as DataType) || "bar",
);
const stockOpeningClosing = ref<DataType>(
	(localStorage.getItem("stockOpeningClosing") as DataType) || "area",
);
const stockVolume = ref<DataType>((localStorage.getItem("stockVolume") as DataType) || "line");
</script>

<template>
    <ul class="flex flex-col gap-20 w-full text-center mt-8">
        <li>
            <div class="flex justify-between items-center">
                <div class="flex flex-col gap-1 justify-start">
                    <span v-translate class="text-sm">Tipo de Gráfico</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button v-translate variant="outline">
                                Selecione
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent class="w-56 absolute -right-[183px]">
                            <DropdownMenuLabel>
                                <span v-translate>
                                    Escolha um Tipo de Gráfico
                                </span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem @click="setDatas('stockMaximumMinimus', 'line')"
                                    class="cursor-pointer flex justify-between items-center">
                                    <div class="flex gap-2 items-center">
                                        <ChartLine class="w-5 h-5" />
                                        <span v-translate>
                                            Linha
                                        </span>
                                    </div>
                                    <CheckIcon v-if="stockMaximumMinimus === 'line'" />
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="setDatas('stockMaximumMinimus', 'area')"
                                    class="cursor-pointer flex justify-between items-center">
                                    <div class="flex gap-2 items-center">
                                        <ChartArea class="w-5 h-5" />
                                        <span v-translate>
                                            Área
                                        </span>
                                    </div>
                                    <CheckIcon v-if="stockMaximumMinimus === 'area'" />
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="setDatas('stockMaximumMinimus', 'bar')"
                                    class="cursor-pointer flex justify-between items-center">
                                    <div class="flex gap-2 items-center">
                                        <ChartColumn class="w-5 h-5" />
                                        <span v-translate>
                                            Barra
                                        </span>
                                    </div>
                                    <CheckIcon v-if="stockMaximumMinimus === 'bar'" />
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <h2 class="mx-auto" v-translate>Valores Máximo e Mínimo do Dia</h2>
            </div>
            <div v-if="stockMaximumMinimus === 'bar'">
                <BarChart v-if="!props.isLoading" :title="ticker" :data="props.data.treatedMaximumMinimum" type="stock"
                    :price="true" />
                <BarChartSkeleton v-else />
            </div>
            <div v-else-if="stockMaximumMinimus === 'area'">
                <AreaChart v-if="!props.isLoading" :title="ticker" :data="props.data.treatedMaximumMinimum" type="stock"
                    :price="true" />
                <AreaChartSkeleton v-else />
            </div>
            <div v-else-if="stockMaximumMinimus === 'line'">
                <LineChart v-if="!props.isLoading" :title="ticker" :data="props.data.treatedMaximumMinimum" type="stock"
                    :price="true" />
                <LineChartSkeleton v-else />
            </div>
        </li>
        <li>
            <div class="flex justify-between items-center">
                <div class="flex flex-col gap-1 justify-start">
                    <span v-translate class="text-sm">Tipo de Gráfico</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button v-translate variant="outline">
                                Selecione
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent class="w-56 absolute -right-[183px]">
                            <DropdownMenuLabel>
                                <span v-translate>
                                    Escolha um Tipo de Gráfico
                                </span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem @click="setDatas('stockOpeningClosing', 'line')"
                                    class="cursor-pointer flex justify-between items-center">
                                    <div class="flex gap-2 items-center">
                                        <ChartLine class="w-5 h-5" />
                                        <span v-translate>
                                            Linha
                                        </span>
                                    </div>
                                    <CheckIcon v-if="stockOpeningClosing === 'line'" />
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="setDatas('stockOpeningClosing', 'area')"
                                    class="cursor-pointer flex justify-between items-center">
                                    <div class="flex gap-2 items-center">
                                        <ChartArea class="w-5 h-5" />
                                        Área
                                    </div>
                                    <CheckIcon v-if="stockOpeningClosing === 'area'" />
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="setDatas('stockOpeningClosing', 'bar')"
                                    class="cursor-pointer flex justify-between items-center">
                                    <div class="flex gap-2 items-center">
                                        <ChartColumn class="w-5 h-5" />
                                        <span v-translate>
                                            Barra
                                        </span>
                                    </div>
                                    <CheckIcon v-if="stockOpeningClosing === 'bar'" />
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <h2 class="mx-auto" v-translate>Preço de Abertura e Fechamento</h2>
            </div>
            <div v-if="stockOpeningClosing === 'bar'">
                <BarChart v-if="!props.isLoading" :title="ticker" :data="props.data.treatedOpeningClosing" type="stock"
                    :price="true" />
                <BarChartSkeleton v-else />
            </div>
            <div v-else-if="stockOpeningClosing === 'area'">
                <AreaChart v-if="!props.isLoading" :title="ticker" :data="props.data.treatedOpeningClosing" type="stock"
                    :price="true" />
                <AreaChartSkeleton v-else />
            </div>
            <div v-else-if="stockOpeningClosing === 'line'">
                <LineChart v-if="!props.isLoading" :title="ticker" :data="props.data.treatedOpeningClosing" type="stock"
                    :price="true" />
                <LineChartSkeleton v-else />
            </div>
        </li>
        <li>
            <div class="flex justify-between items-center">
                <div class="flex flex-col gap-1 justify-start">
                    <span v-translate class="text-sm">Tipo de Gráfico</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button v-translate variant="outline">
                                Selecione
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent class="w-56 absolute -right-[183px]">
                            <DropdownMenuLabel>
                                <span v-translate>
                                    Escolha um Tipo de Gráfico
                                </span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem @click="setDatas('stockVolume', 'line')"
                                    class="cursor-pointer flex justify-between items-center">
                                    <div class="flex gap-2 items-center">
                                        <ChartLine class="w-5 h-5" />
                                        <span v-translate>
                                            Linha
                                        </span>
                                    </div>
                                    <CheckIcon v-if="stockVolume === 'line'" />
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="setDatas('stockVolume', 'area')"
                                    class="cursor-pointer flex justify-between items-center">
                                    <div class="flex gap-2 items-center">
                                        <ChartArea class="w-5 h-5" />
                                        <span v-translate>
                                            Área
                                        </span>
                                    </div>
                                    <CheckIcon v-if="stockVolume === 'area'" />
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="setDatas('stockVolume', 'bar')"
                                    class="cursor-pointer flex justify-between items-center">
                                    <div class="flex gap-2 items-center">
                                        <ChartColumn class="w-5 h-5" />
                                        <span v-translate>
                                            Barra
                                        </span>
                                    </div>
                                    <CheckIcon v-if="stockVolume === 'bar'" />
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <h2 class="mx-auto" v-translate>Volume</h2>
            </div>
            <div v-if="stockVolume === 'bar'">
                <BarChart v-if="!props.isLoading" :title="ticker" :data="props.data.treatedVolume" type="stock" />
                <BarChartSkeleton v-else />
            </div>
            <div v-else-if="stockVolume === 'area'">
                <AreaChart v-if="!props.isLoading" :title="ticker" :data="props.data.treatedVolume" type="stock" />
                <AreaChartSkeleton v-else />
            </div>
            <div v-else-if="stockVolume === 'line'">
                <LineChart v-if="!props.isLoading" :title="ticker" :data="props.data.treatedVolume" type="stock" />
                <LineChartSkeleton v-else />
            </div>
        </li>
    </ul>
</template>
