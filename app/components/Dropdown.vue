<script lang="ts" setup>
import RouterLink from "@/tags/RouterLink.vue";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "@/tags/Image.vue";
import type {HTMLAttributes} from "vue";

export interface SubContent {
	/**
	 * Imagem referente ao subItem
	 */
	logo: string;
	title: string;
	link: string;
}

export interface Menu {
	titleRepresentation?: {
		type: "emoji" | "image";
		value: string;
	};
	title: string;
	link?: string;
	subContent?: SubContent[];
}

export interface DropdownProps {
	class?: HTMLAttributes["class"];
	buttonTile: string;
	label: string;
	menu: Menu[];
}

const props = defineProps<DropdownProps>();
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button v-translate variant="outline" data-testid="Dropdown" :class="cn(props.class)">
                {{ props.buttonTile }}
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56 absolute -right-44" :class="cn(props.class)">
            <DropdownMenuLabel>
                <span v-translate>
                    {{ props.label }}
                </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <template v-for="menu in props.menu">
                    <RouterLink v-if="!menu.subContent && menu.link" :to="menu.link">
                        <DropdownMenuItem class="group cursor-pointer flex gap-3">
                            <span v-if="menu.titleRepresentation?.type === 'emoji'" v-html="menu.titleRepresentation.value"></span>
                            <Image v-if="menu.titleRepresentation?.type === 'image'" :src="menu.titleRepresentation.value" alt="Logo" width="20" height="20" />
                            <span v-translate>{{ menu.title }}</span>
                        </DropdownMenuItem>
                    </RouterLink>
                    <DropdownMenuItem v-if="!menu.link" class="group cursor-pointer flex gap-3">
                        <span v-if="menu.titleRepresentation?.type === 'emoji'" v-html="menu.titleRepresentation.value"></span>
                        <Image v-if="menu.titleRepresentation?.type === 'image'" :src="menu.titleRepresentation.value" alt="Logo" width="20" height="20" />
                        <span v-translate>{{ menu.title }}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSub v-if="menu.subContent">
                        <RouterLink v-if="menu.link" :to="menu.link">
                            <DropdownMenuSubTrigger class="group cursor-pointer flex gap-3">
                                <span v-if="menu.titleRepresentation?.type === 'emoji'" v-html="menu.titleRepresentation.value"></span>
                            <Image v-if="menu.titleRepresentation?.type === 'image'" :src="menu.titleRepresentation.value" alt="Logo" width="20" height="20" />
                                <span v-translate>{{ menu.title }}</span>
                            </DropdownMenuSubTrigger>
                        </RouterLink>
                        <DropdownMenuSubTrigger v-if="!menu.link" class="group cursor-pointer flex gap-3">
                            <span v-if="menu.titleRepresentation?.type === 'emoji'" v-html="menu.titleRepresentation.value"></span>
                            <Image v-if="menu.titleRepresentation?.type === 'image'" :src="menu.titleRepresentation.value" alt="Logo" width="20" height="20" />
                            <span v-translate>{{ menu.title }}</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <template v-for="subContent in menu.subContent">
                                    <RouterLink :to="subContent.link">
                                        <DropdownMenuItem class="group cursor-pointer gap-3">
                                            <Image :src="subContent.logo" alt="Logo" width="20" height="20" />
                                            <span>{{ subContent.title }}</span>
                                        </DropdownMenuItem>
                                    </RouterLink>
                                </template>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </template>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<style scoped>
span {
    @apply group-hover:text-primary;
}
</style>
