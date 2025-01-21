<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import type { ComboboxItemEmits, ComboboxItemProps } from "radix-vue";
import { ComboboxItem, useForwardPropsEmits } from "radix-vue";
import { cn } from "@/lib/utils";
import RouterLink from "@/tags/RouterLink.vue";
import Link from "@/tags/Link.vue";

const props = defineProps<
    ComboboxItemProps & {
        class?: HTMLAttributes[ "class" ];
        to?: string;
        target?: "_blank" | "_self" | "_parent" | "_top";
    }
>();
const emits = defineEmits<ComboboxItemEmits>();

const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;
    return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <ComboboxItem v-bind="forwarded"
        :class="cn('relative flex cursor-default select-none items-center rounded-sm text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50', props.class)">
        <template v-if="props.to && props.target !== '_blank'">
            <RouterLink :to="props.to"
                class="w-full h-full flex items-center gap-2 px-2 py-1.5 hover:opacity-75 focus:opacity-75 focus:bg-accent">
                <slot />
            </RouterLink>
        </template>
        <template v-else-if="props.to && props.target === '_blank'">
            <Link :href="props.to" target="_blank"
                class="w-full h-full flex items-center gap-2 px-2 py-1.5 hover:opacity-75 focus:opacity-75 focus:bg-accent">
            <slot />
            </Link>
        </template>
        <template v-else>
            <slot />
        </template>
    </ComboboxItem>
</template>
