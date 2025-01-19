
import { House, Newspaper, BriefcaseBusiness, Coins, Ellipsis } from "lucide-vue-next";
import type { FunctionalComponent, HTMLAttributes, VNodeProps } from "vue";

interface FooterDto {
    title: string;
    path: string;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    icon: FunctionalComponent<HTMLAttributes & VNodeProps, {}, any, {}>;
}

export const FooterDto: FooterDto[] = [
    {
        title: "Explorar",
        path: "/",
        icon: House,
    },
    {
        title: "Notícias",
        path: "/news",
        icon: Newspaper,
    },
    {
        title: "Ações",
        path: "/stocks",
        icon: BriefcaseBusiness,
    },
    {
        title: "Cripto",
        path: "/cryptos",
        icon: Coins,
    },
    {
        title: "Mais",
        path: "/more",
        icon: Ellipsis,
    },
];
