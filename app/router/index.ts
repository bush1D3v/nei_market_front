import {createRouter, createWebHistory} from "vue-router";
import Home from "@/views/Home.vue";
import AboutUs from "@/views/AboutUs.vue";
import More from "@/views/More.vue";
import NotFound from "@/views/Exceptions/NotFound.vue";
import Cryptos from "@/views/CoinMarketCap/Cryptos.vue";
import CryptoDetail from "@/views/CoinMarketCap/CryptoDetail.vue";
import Stocks from "@/views/BrapiDev/Stocks.vue";
import StockDetail from "@/views/BrapiDev/StockDetail.vue";
import CookiePolicy from "@/views/Policies/CookiePolicy.vue";
import PrivacyPolicy from "@/views/Policies/PrivacyPolicy.vue";
import News from "@/views/Finnhub/News.vue";
const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "Home",
			component: Home,
			meta: {
				title: "Home | NEI Market Analytics",
				description:
					"Welcome to NEI Market Analytics, your source for comprehensive market analysis.",
				keywords: "market analysis, business insights, NEI Market Analytics",
				robots: "index, follow",
				ogTitle: "Home | NEI Market Analytics",
				ogDescription:
					"Welcome to NEI Market Analytics, your source for comprehensive market analysis.",
				ogImage: "/logo.svg",
				ogUrl: "http://localhost:5173/",
			},
		},
		{
			path: "/about-us",
			name: "About Us",
			component: AboutUs,
			meta: {
				title: "About Us | NEI Market Analytics",
				description: "Learn more about NEI Market Analytics and our mission.",
				keywords: "about us, NEI Market Analytics, company information",
				robots: "index, follow",
				ogTitle: "About Us | NEI Market Analytics",
				ogDescription: "Learn more about NEI Market Analytics and our mission.",
				ogImage: "/logo.svg",
				ogUrl: "http://localhost:5173/about-u",
			},
		},
		{
			path: "/more",
			name: "More",
			component: More,
			meta: {
				title: "More | NEI Market Analytics",
				description:
					"See more details about NEI Market Analytics, your policies, contacts, configurations, and more.",
				keywords:
					"more, policies, cookies policy, privacy policy, contacts, configurations, NEI Market Analytics, company information",
				robots: "index, follow",
				ogTitle: "More | NEI Market Analytics",
				ogDescription:
					"See more details about NEI Market Analytics, your policies, contacts, configurations, and more.",
				ogImage: "/logo.svg",
				ogUrl: "http://localhost:5173/about-u",
			},
		},
		{
			path: "/privacy-policy",
			name: "PrivacyPolicy",
			component: PrivacyPolicy,
			meta: {
				title: "Privacy Policy | NEI Market Analytics",
				description: "Learn more about our privacy policy.",
				keywords: "privacy policy, NEI Market Analytics",
				robots: "index, follow",
				ogTitle: "Privacy Policy | NEI Market Analytics",
				ogDescription: "Learn more about our privacy policy.",
				ogImage: "/logo.svg",
				ogUrl: "http://localhost:5173/privacy-policy",
			},
		},
		{
			path: "/cookie-policy",
			name: "CookiePolicy",
			component: CookiePolicy,
			meta: {
				title: "Cookie Policy | NEI Market Analytics",
				description: "Learn more about our cookie policy.",
				keywords: "cookie policy, NEI Market Analytics",
				robots: "index, follow",
				ogTitle: "Cookie Policy | NEI Market Analytics",
				ogDescription: "Learn more about our cookie policy.",
				ogImage: "/logo.svg",
				ogUrl: "http://localhost:5173/cookie-policy",
			},
		},
		{
			path: "/cryptos",
			name: "Cryptos",
			component: Cryptos,
			meta: {
				title: "Crypto | NEI Market Analytics",
				description: "Explore our comprehensive list of crypto assets.",
				keywords: "crypto, crypto assets, NEI Market Analytics",
				robots: "index, follow",
				ogTitle: "Crypto | NEI Market Analytics",
				ogDescription: "Explore our comprehensive list of crypto assets.",
				ogImage: "/logo.svg",
				ogUrl: "http://localhost:5173/cryptos",
			},
		},
		{
			path: "/stocks",
			name: "Stocks",
			component: Stocks,
			meta: {
				title: "Stocks | NEI Market Analytics",
				description: "Explore our comprehensive list of stocks.",
				keywords: "stocks, stock assets, NEI Market Analytics",
				robots: "index, follow",
				ogTitle: "Stocks | NEI Market Analytics",
				ogDescription: "Explore our comprehensive list of stocks.",
				ogImage: "/logo.svg",
				ogUrl: "http://localhost:5173/stocks",
			},
		},
		{
			path: "/news",
			name: "News",
			component: News,
			meta: {
				title: "News | NEI Market Analytics",
				description: "Explore our comprehensive list of News.",
				keywords: "news, news assets, NEI Market Analytics",
				robots: "index, follow",
				ogTitle: "News | NEI Market Analytics",
				ogDescription: "Explore our comprehensive list of news.",
				ogImage: "/logo.svg",
				ogUrl: "http://localhost:5173/news",
			},
		},
		{
			path: "/cryptos/:crypto",
			name: "CryptoDetail",
			component: CryptoDetail,
			meta: {
				description: "Explore our comprehensive crypto.",
				keywords: "crypto, crypto assets, NEI Market Analytics",
				robots: "index, follow",
				ogTitle: "Crypto | NEI Market Analytics",
				ogDescription: "Explore our comprehensive crypto.",
				ogImage: "/logo.svg",
				ogUrl: "http://localhost:5173/cryptos/:crypto",
			},
			props: (route) => ({key: route.params.crypto}),
		},
		{
			path: "/stocks/:stock",
			name: "StockDetail",
			component: StockDetail,
			meta: {
				description: "Explore our comprehensive list of stocks.",
				keywords: "stocks, stock assets, NEI Market Analytics",
				robots: "index, follow",
				ogTitle: "Stocks | NEI Market Analytics",
				ogDescription: "Explore our comprehensive list of stocks.",
				ogImage: "/logo.svg",
				ogUrl: "http://localhost:5173/stocks/:stock",
			},
			props: (route) => ({key: route.params.stock}),
		},
		{
			path: "/:pathMatch(.*)*",
			name: "Not Found",
			component: NotFound,
			meta: {
				title: "404 | NEI Market Analytics",
				description: "Page not found",
				keywords: "404, page not found, NEI Market Analytics",
				robots: "noindex, nofollow",
				ogTitle: "404 | NEI Market Analytics",
				ogDescription: "Page not found",
				ogImage: "/logo.svg",
				ogUrl: "http://localhost:5173/",
			},
		},
	],
});

router.beforeEach((to, _from, next) => {
	document.title = (to.meta.title as string) || "NEI Market Analytics";

	const metaTags = [
		{name: "description", content: to.meta.description as string},
		{name: "keywords", content: to.meta.keywords as string},
		{name: "robots", content: to.meta.robots as string},
		{property: "og:title", content: to.meta.ogTitle as string},
		{
			property: "og:description",
			content: to.meta.ogDescription as string,
		},
		{property: "og:image", content: to.meta.ogImage as string},
		{property: "og:url", content: to.meta.ogUrl as string},
	];

	for (const tag of metaTags) {
		const key = tag.name ? "name" : "property";
		const value = tag.name || tag.property;
		if (!value) continue;

		let element = document.querySelector(`meta[${key}="${value}"]`);
		if (element) {
			element.setAttribute("content", tag.content);
		} else {
			element = document.createElement("meta");
			element.setAttribute(key, value);
			element.setAttribute("content", tag.content);
			document.head.appendChild(element);
		}
	}

	next();
});

export default router;
