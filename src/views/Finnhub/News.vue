<script setup lang="ts">
import InternalServerError from "@/views/Exceptions/InternalServerError.vue";
import NewsCard from "@/components/NewsCard.vue";
import NewsCardSkeleton from "@/components/Skeletons/components/NewsCard.vue";
import {listMarketNews} from "@/services/Finnhub";
import {useNewsStore} from "@/stores/useNewsStore";
import {useQuery} from "@tanstack/vue-query";

const newStore = useNewsStore();

const {error, isLoading} = useQuery({
	queryKey: ["news", "crypto"],
	queryFn: async () => await listMarketNews(),
	enabled: newStore.news.crypto.length === 0,
});
</script>

<template>
    <section class="container md:px-4 justify-center my-10">
        <ul v-if="!error" class="flex gap-10 flex-wrap justify-center">
            <li class="w-full 2xl:max-w-max" v-if="!isLoading" v-for="news in newStore.news.crypto" :key="news.id">
                <NewsCard :id="news.id" :datetime="news.datetime" :headline="news.headline" :url="news.url"
                    :source="news.source" :summary="news.summary" :image="news.image" />
            </li>
            <NewsCardSkeleton v-else v-if="isLoading" v-for="i in 12" :key="i" />
        </ul>
        <InternalServerError v-if="error" />
    </section>
</template>
