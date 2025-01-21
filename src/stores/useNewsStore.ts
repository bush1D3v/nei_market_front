import { ref } from "vue";
import { defineStore } from "pinia";
import type { New } from "@/types/Finnhub/New";
import type { Category } from "@/types/Finnhub/Category";

type CategoriesNews = {
    [ key in Category ]: New[];
};

export const useNewsStore = defineStore("news", () => {
    const news = ref<CategoriesNews>({
        crypto: [],
        forex: [],
        general: [],
        merger: [],
        company: [],
    });

    function addNews(data: New[], category: Category): void {
        news.value[ category ].push(...data);
    }

    function searchNews(search: string): New[] {
        const allNews: New[] = [];
        for (const category in news.value) {
            allNews.push(...news.value[ category as Category ]);
        }
        allNews.filter((news) => news.headline.toLowerCase().includes(search.toLowerCase()));
        if (allNews.length > 0) {
            return allNews;
        }

        for (const category in news.value) {
            allNews.push(...news.value[ category as Category ]);
        }
        return allNews.filter((news) => news.summary.toLowerCase().includes(search.toLowerCase()));
    }

    return {
        news,
        addNews,
        searchNews,
    };
});
