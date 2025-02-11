<script setup lang="ts" generic="T extends Record<string, any>">
import type {BaseChartProps} from ".";
import {ChartCrosshair, ChartLegend, defaultColors} from "@/components/ui/chart";
import {cn} from "@/lib/utils";
import {type BulletLegendItemInterface, CurveType} from "@unovis/ts";
import {Axis, Line} from "@unovis/ts";
import {VisAxis, VisLine, VisXYContainer} from "@unovis/vue";
import {useMounted} from "@vueuse/core";
import {type Component, computed, ref} from "vue";

const props = withDefaults(
	defineProps<
		BaseChartProps<T> & {
			/**
			 * Render custom tooltip component.
			 */
			customTooltip?: Component;
			/**
			 * Type of curve
			 */
			curveType?: CurveType;
		}
	>(),
	{
		curveType: CurveType.MonotoneX,
		filterOpacity: 0.2,
		margin: () => ({top: 0, bottom: 0, left: 0, right: 0}),
		showXAxis: true,
		showYAxis: true,
		showTooltip: true,
		showLegend: true,
		showGridLine: true,
	},
);

const emits = defineEmits<{
	legendItemClick: [d: BulletLegendItemInterface, i: number];
}>();

type KeyOfT = Extract<keyof T, string>;
type Data = (typeof props.data)[number];

const index = computed(() => props.index as KeyOfT);
const colors = computed(() =>
	props.colors?.length ? props.colors : defaultColors(props.categories.length),
);

const legendItems = ref<BulletLegendItemInterface[]>(
	props.categories.map((category, i) => ({
		name: category,
		color: colors.value[i],
		inactive: false,
	})),
);

const isMounted = useMounted();

function handleLegendItemClick(d: BulletLegendItemInterface, i: number) {
	emits("legendItemClick", d, i);
}

function cleanNameKey(data) {
	return data.map((item) => {
		const {name, ...rest} = item;

		const dateTimePattern = /^\d{2}\/\d{2} - \d{2}:\d{2}:\d{2}$/;
		const engDateTimePattern = /^\d{2}\/\d{2} - \d{2}:\d{2}:\d{2} [APM]{2}$/;
		if (!dateTimePattern.test(name) && !engDateTimePattern.test(name)) {
			return {...rest, name};
		}

		const [datePart] = name.split(" - ");
		const [day, month] = datePart.split("/").map(Number);

		const date = new Date(new Date().getFullYear(), month - 1, day);

		const locale = navigator.language;
		const formattedName = date.toLocaleDateString(locale, {
			day: "2-digit",
			month: "2-digit",
		});

		return {...rest, name: formattedName};
	});
}

const cleanedData = cleanNameKey(props.data);
</script>

<template>
    <div :class="cn('w-full h-[525px] flex flex-col items-end', $attrs.class ?? '')">
        <ChartLegend v-if="showLegend" v-model:items="legendItems" @legend-item-click="handleLegendItemClick" />

        <VisXYContainer :margin="{ left: 20, right: 20 }" :data="data" :style="{ height: isMounted ? '100%' : 'auto' }">
            <ChartCrosshair v-if="showTooltip" :colors="colors" :items="legendItems" :index="index"
                :custom-tooltip="customTooltip" />

            <template v-for="(category, i) in categories" :key="category">
                <VisLine :x="(d: Data, i: number) => i" :y="(d: Data) => d[ category ]" :curve-type="curveType"
                    :color="colors[ i ]" :attributes="{
                        [ Line.selectors.line ]: {
                            opacity: legendItems.find(item => item.name === category)?.inactive ? filterOpacity : 1,
                        },
                    }" />
            </template>

            <VisAxis v-if="showXAxis" type="x" :tick-format="xFormatter ?? ((v: number) => cleanedData[ v ]?.[ index ])"
                :grid-line="false" :tick-line="false" tick-text-color="var(--text)" />
            <VisAxis v-if="showYAxis" type="y" :tick-line="false" :tick-format="yFormatter" :domain-line="false"
                :grid-line="showGridLine" :attributes="{
                    [ Axis.selectors.grid ]: {
                        class: 'text-text',
                    },
                }" tick-text-color="var(--text)" />

            <slot />
        </VisXYContainer>
    </div>
</template>
