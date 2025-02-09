<script setup lang="ts">
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
import {ref} from "vue";

interface Props {
	localStorageName: string;
	defaultType: "line" | "bar" | "area";
}
const props = defineProps<Props>();

export type DataType = "line" | "bar" | "area";
const dataType = ref<DataType>(localStorage.getItem(props.localStorageName) as DataType);

function setDatas(type: "line" | "bar" | "area"): void {
	dataType.value = type;
	localStorage.setItem(props.localStorageName, type);
}
</script>

<template>
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
                <DropdownMenuItem @click="setDatas('line')" class="cursor-pointer flex justify-between items-center">
                    <div>
                        <span v-html="'&#129689;'"></span>&nbsp;&nbsp;
                        <span v-translate>
                            Linha
                        </span>
                    </div>
                    <CheckIcon v-if="dataType === 'line'" />
                </DropdownMenuItem>
                <DropdownMenuItem @click="setDatas('area')" class="cursor-pointer flex justify-between items-center">
                    <div>
                        <span v-html="'&#128188;'"></span>&nbsp;&nbsp;
                        <span v-translate>
                            Área
                        </span>
                    </div>
                    <CheckIcon v-if="dataType === 'area'" />
                </DropdownMenuItem>
                <DropdownMenuItem @click="setDatas('bar')" class="cursor-pointer flex justify-between items-center">
                    <div>
                        <span v-html="'&#128188;'"></span>&nbsp;&nbsp;
                        <span v-translate>
                            Barra
                        </span>
                    </div>
                    <CheckIcon v-if="dataType === 'bar'" />
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
