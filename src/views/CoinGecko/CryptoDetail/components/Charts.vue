<script setup lang="ts">
import type { ChartData } from "@/components/Chart/types/ChartData";
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
import { CheckIcon } from "@radix-icons/vue";
import { ref } from "vue";

type DataType = "line" | "bar" | "area";
interface Props {
    crypto: string;
    data: {
        treatedPriceData: ChartData[];
        treatedMarketData: ChartData[];
        treatedVolumeData: ChartData[];
    };
    isLoading: boolean;
}

function setDatas(localStorageName: "cryptoPrice" | "cryptoMarket" | "cryptoVolume", type: "line" | "bar" | "area"): void {
    localStorage.setItem(localStorageName, type);
    switch (localStorageName) {
        case "cryptoPrice":
            cryptoPrice.value = type;
            break;
        case "cryptoMarket":
            cryptoMarket.value = type;
            break;
        case "cryptoVolume":
            cryptoVolume.value = type;
            break;
    }
}

const props = defineProps<Props>();
const cryptoPrice = ref<DataType>(localStorage.getItem("cryptoPrice") as DataType || "bar");
const cryptoMarket = ref<DataType>(localStorage.getItem("cryptoMarket") as DataType || "area");
const cryptoVolume = ref<DataType>(localStorage.getItem("cryptoVolume") as DataType || "line");
</script>

<template>
    <ul class="flex flex-col gap-20 w-full text-center mt-4">
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
                                <DropdownMenuItem @click="setDatas('cryptoPrice', 'line')"
                                    class="cursor-pointer flex justify-between items-center">
                                    <div>
                                        <span v-html="'&#129689;'"></span>&nbsp;&nbsp;
                                        <span v-translate>
                                            Linha
                                        </span>
                                    </div>
                                    <CheckIcon v-if="cryptoPrice === 'line'" />
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="setDatas('cryptoPrice', 'area')"
                                    class="cursor-pointer flex justify-between items-center">
                                    <div>
                                        <span v-html="'&#128188;'"></span>&nbsp;&nbsp;
                                        <span v-translate>
                                            Área
                                        </span>
                                    </div>
                                    <CheckIcon v-if="cryptoPrice === 'area'" />
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="setDatas('cryptoPrice', 'bar')"
                                    class="cursor-pointer flex justify-between items-center">
                                    <div>
                                        <span v-html="'&#128188;'"></span>&nbsp;&nbsp;
                                        <span v-translate>
                                            Barra
                                        </span>
                                    </div>
                                    <CheckIcon v-if="cryptoPrice === 'bar'" />
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <h2 class="mx-auto" v-translate>Preço</h2>
            </div>
            <div v-if="cryptoPrice === 'bar'">
                <BarChart v-if="!props.isLoading" :title="props.crypto" :data="props.data.treatedPriceData" />
                <BarChartSkeleton v-else />
            </div>
            <div v-else-if="cryptoPrice === 'area'">
                <AreaChart v-if="!props.isLoading" :title="props.crypto" :data="props.data.treatedPriceData" />
                <AreaChartSkeleton v-else />
            </div>
            <div v-else-if="cryptoPrice === 'line'">
                <LineChart v-if="!props.isLoading" :title="props.crypto" :data="props.data.treatedPriceData" />
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
                                <DropdownMenuItem @click="setDatas('cryptoMarket', 'line')"
                                    class="cursor-pointer flex justify-between items-center">
                                    <div>
                                        <span v-html="'&#129689;'"></span>&nbsp;&nbsp;
                                        <span v-translate>
                                            Linha
                                        </span>
                                    </div>
                                    <CheckIcon v-if="cryptoMarket === 'line'" />
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="setDatas('cryptoMarket', 'area')"
                                    class="cursor-pointer flex justify-between items-center">
                                    <div>
                                        <span v-html="'&#128188;'"></span>&nbsp;&nbsp;
                                        <span v-translate>
                                            Área
                                        </span>
                                    </div>
                                    <CheckIcon v-if="cryptoMarket === 'area'" />
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="setDatas('cryptoMarket', 'bar')"
                                    class="cursor-pointer flex justify-between items-center">
                                    <div>
                                        <span v-html="'&#128188;'"></span>&nbsp;&nbsp;
                                        <span v-translate>
                                            Barra
                                        </span>
                                    </div>
                                    <CheckIcon v-if="cryptoMarket === 'bar'" />
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <h2 class="mx-auto" v-translate>Capitalização de Mercado</h2>
            </div>
            <div v-if="cryptoMarket === 'bar'">
                <BarChart v-if="!props.isLoading" :title="props.crypto" :data="props.data.treatedMarketData" />
                <BarChartSkeleton v-else />
            </div>
            <div v-else-if="cryptoMarket === 'area'">
                <AreaChart v-if="!props.isLoading" :title="props.crypto" :data="props.data.treatedMarketData" />
                <AreaChartSkeleton v-else />
            </div>
            <div v-else-if="cryptoMarket === 'line'">
                <LineChart v-if="!props.isLoading" :title="props.crypto" :data="props.data.treatedMarketData" />
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
                                <DropdownMenuItem @click="setDatas('cryptoVolume', 'line')"
                                    class="cursor-pointer flex justify-between items-center">
                                    <div>
                                        <span v-html="'&#129689;'"></span>&nbsp;&nbsp;
                                        <span v-translate>
                                            Linha
                                        </span>
                                    </div>
                                    <CheckIcon v-if="cryptoVolume === 'line'" />
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="setDatas('cryptoVolume', 'area')"
                                    class="cursor-pointer flex justify-between items-center">
                                    <div>
                                        <span v-html="'&#128188;'"></span>&nbsp;&nbsp;
                                        <span v-translate>
                                            Área
                                        </span>
                                    </div>
                                    <CheckIcon v-if="cryptoVolume === 'area'" />
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="setDatas('cryptoVolume', 'bar')"
                                    class="cursor-pointer flex justify-between items-center">
                                    <div>
                                        <span v-html="'&#128188;'"></span>&nbsp;&nbsp;
                                        <span v-translate>
                                            Barra
                                        </span>
                                    </div>
                                    <CheckIcon v-if="cryptoVolume === 'bar'" />
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <h2 class="mx-auto" v-translate>Volume</h2>
            </div>
            <div v-if="cryptoVolume === 'bar'">
                <BarChart v-if="!props.isLoading" :title="props.crypto" :data="props.data.treatedVolumeData" />
                <BarChartSkeleton v-else />
            </div>
            <div v-else-if="cryptoVolume === 'area'">
                <AreaChart v-if="!props.isLoading" :title="props.crypto" :data="props.data.treatedVolumeData" />
                <AreaChartSkeleton v-else />
            </div>
            <div v-else-if="cryptoVolume === 'line'">
                <LineChart v-if="!props.isLoading" :title="props.crypto" :data="props.data.treatedVolumeData" />
                <LineChartSkeleton v-else />
            </div>
        </li>
    </ul>
</template>
