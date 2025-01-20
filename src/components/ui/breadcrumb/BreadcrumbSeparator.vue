<script lang="ts" setup>
import type {HTMLAttributes} from "vue";
import {cn} from "@/lib/utils";
import {ChevronRightIcon} from "@radix-icons/vue";

const props = defineProps<{
	class?: HTMLAttributes["class"];
}>();
</script>

<template>
    <li role="presentation" :class="cn('[&>svg]:size-3.5', props.class)">
        <slot>
            <ChevronRightIcon />
        </slot>
    </li>
</template>
