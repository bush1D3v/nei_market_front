<script setup lang="ts">
import {RouterView} from "vue-router";
import {onMounted} from "vue";
import {t} from "i18next";
import Footer from "@/components/Layout/Footer.vue";
import Header from "@/components/Layout/Header.vue";
import Sonner from "@/components/ui/sonner/Sonner.vue";
import Toaster from "@/components/ui/toast/Toaster.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import GenerativeAI from "@/components/GenerativeAI.vue";
import router from "./router";

onMounted(() => {
	for (const route of router.getRoutes()) {
		route.name = t(route.name as string);
	}

	const language = navigator.language.split("-")[0];
	document.documentElement.lang = language;
});
</script>

<template>
    <Header />
    <main class="min-h-[95dvh] mb-[72px] lg:mb-0 py-4 md:py-8 relative px-2 md:px-4">
        <Breadcrumb />
        <RouterView />
        <Toaster />
        <Sonner />
        <GenerativeAI />
    </main>
    <Footer />
</template>
