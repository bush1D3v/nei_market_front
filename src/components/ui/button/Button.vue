<script setup lang="ts">
import type {HTMLAttributes} from "vue";
import {Primitive, type PrimitiveProps} from "radix-vue";
import {type ButtonVariants, buttonVariants} from ".";
import {cn} from "@/lib/utils";

export interface Props extends PrimitiveProps {
	variant?: ButtonVariants["variant"];
	size?: ButtonVariants["size"];
	class?: HTMLAttributes["class"];
	default?: string;
}

const props = withDefaults(defineProps<Props>(), {
	as: "button",
});
</script>

<template>
    <Primitive :as="as" :as-child="asChild" :class="cn(buttonVariants({ variant, size }), props.class)">
        <slot />
        {{ props.default }}
    </Primitive>
</template>
