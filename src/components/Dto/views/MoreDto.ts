interface IExploreDto {
    emoji: string;
    title: string;
    href: string;
}

export const ExploreDto: IExploreDto[] = [
    {
        emoji: "🪙",
        title: "Criptomoedas",
        href: "/cryptos",
    },
    {
        emoji: "📊",
        title: "Ações",
        href: "/stocks",
    },
    {
        emoji: "📰",
        title: "Notícias",
        href: "/news",
    },
    // TODO: top moedas
    // {
    //     emoji: '🔥',
    //     title: 'Top Moedas',
    //     href: '/cryptos?sort=percent_change_24h'
    // },
    // TODO: top ações
    // {
    //     emoji: '📈',
    //     title: 'Top Ações',
    //     href: '/stocks?sortBy=change&sortOrder=desc'
    // }
];

import { Repeat } from "lucide-vue-next";
import type { FunctionalComponent, HTMLAttributes, VNodeProps } from "vue";

interface IToolsDto {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    icon: FunctionalComponent<HTMLAttributes & VNodeProps, {}, any, {}>;
    title: string;
    href: string;
}

export const ToolsDto: IToolsDto[] = [
    {
        icon: Repeat,
        title: "Conversor de Moedas",
        href: "/currency-converter",
    },
];

import { Cookie, Lock } from "lucide-vue-next";
import { GithubLogoIcon } from "@radix-icons/vue";
import { Info } from "lucide-vue-next";

interface IInfoDto {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    icon: FunctionalComponent<HTMLAttributes & VNodeProps, {}, any, {}>;
    title: string;
    href: string;
}

export const InfoDto: IInfoDto[] = [
    {
        icon: Info,
        title: "Sobre Nós",
        href: "/about-us",
    },
    {
        icon: Lock,
        title: "Política de Privacidade",
        href: "/privacy-policy",
    },
    {
        icon: Cookie,
        title: "Política de Cookies",
        href: "/cookie-policy",
    },
    {
        icon: GithubLogoIcon,
        title: "Ver no GitHub",
        href: "https://github.com/bush1D3v/NEI_market_analytics/tree/dev",
    },
    // TODO: feedback
    // {
    //     icon: LoopIcon,
    //     title: 'Enviar feedback',
    //     href: '/'
    // },
];
