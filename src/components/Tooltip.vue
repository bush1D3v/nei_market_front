<script setup lang="ts">
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import type {HTMLAttributes} from "vue";

const props = defineProps<{
	class?: HTMLAttributes["class"];
}>();
</script>

<template>
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger as-child>
                <slot name="trigger" />
            </TooltipTrigger>
            <TooltipContent :class="props.class">
                <slot name="content" />
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
</template>
