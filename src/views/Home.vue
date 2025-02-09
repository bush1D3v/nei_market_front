<script setup lang="ts">
import HomeTopsTable from "@/components/views/Home/HomeTopsTable.vue";
import HomeTopsTableSkeleton from "@/components/Skeletons/components/views/Home/HomeTopsTable.vue";
import HomeDatasTable from "@/components/views/Home/HomeDatasTable.vue";
import {getTrendingCryptos} from "@/services/CoinGecko";
import {useCryptoCurrencyStore} from "@/stores/useCryptoCurrencyStore";
import {listCompanyNews} from "@/services/Finnhub";
import {listStocks} from "@/services/BrapiDev";
import {useStocksCurrencyStore} from "@/stores/useStocksCurrencyStore";
import {useNewsStore} from "@/stores/useNewsStore";
import BitcoinNotebook from "@/assets/images/bitcoin-notebook.png";
import BitcoinRocket from "@/assets/images/bitcoin-rocket.png";
import BitcoinEscudo from "@/assets/images/bitcoin-escudo.png";
import Card from "@/components/ui/card/Card.vue";
import Image from "@/tags/Image.vue";
import {useQuery} from "@tanstack/vue-query";

const cryptoCurrencyStore = useCryptoCurrencyStore();
const newsStore = useNewsStore();
const stocksCurrencyStore = useStocksCurrencyStore();

const {isLoading: onNewsLoading} = useQuery({
	queryKey: ["news", "homeTops"],
	queryFn: async () => await listCompanyNews(),
	enabled: !newsStore.news.company.length,
});

const {isLoading: onCryptoLoading} = useQuery({
	queryKey: ["cryptos", "homeTops"],
	queryFn: async () => await getTrendingCryptos(),
	enabled: !cryptoCurrencyStore.homeTopsTableCryptoCurrencies.length,
});

const {isLoading: onStocksLoading} = useQuery({
	queryKey: ["stocks", "homeTops"],
	queryFn: async () => await listStocks(5, 1, "change", "desc"),
	enabled: !stocksCurrencyStore.homeTopsTableStockCurrencies.length,
});
</script>

<template>
    <section class="container flex flex-col items-center justify-center gap-8">
        <ul class="flex gap-4 flex-wrap justify-center">
            <li v-if="!onCryptoLoading">
                <HomeTopsTable icon="🪙" table-title="Moedas em Alta" redirect-to="/cryptos"
                    :coins="cryptoCurrencyStore.homeTopsTableCryptoCurrencies"
                    tooltip-text="Criptomoedas mais pesquisadas pelos usuários nas últimas 24 horas" />
            </li>
            <HomeTopsTableSkeleton v-else type="cryptos" />
            <li v-if="!onStocksLoading">
                <HomeTopsTable icon="📈" table-title="Ações em Alta" redirect-to="/stocks"
                    :stocks="stocksCurrencyStore.homeTopsTableStockCurrencies"
                    tooltip-text="Ações com maior variação de preço nas últimas 24 horas" />
            </li>
            <HomeTopsTableSkeleton v-else type="stocks" />
            <li v-if="!onNewsLoading">
                <HomeTopsTable icon="📰" table-title="Do nosso Blog" redirect-to="/news"
                    :news="newsStore.news.company.slice(0, 3)"
                    tooltip-text="Notícias do nosso Blog e fontes externas" />
            </li>
            <HomeTopsTableSkeleton v-else type="news" />
        </ul>
        <HomeDatasTable />
        <article class="flex flex-col gap-4">
            <p v-translate class="text-text text-xl md:text-2xl text-center xl:text-start">Novo no Mundo Financeiro
                Digital? <strong class="text-2xl">Comece aqui!</strong></p>
            <ul class="flex flex-wrap gap-8 justify-center">
                <li>
                    <Card class="flex flex-col items-center gap-4 p-4 md:p-7 bg-purple h-[500px] max-w-[400px]">
                        <Image :src="BitcoinNotebook" alt="Hello" width="225" height="225" />
                        <h4 v-translate class="w-full">Conhecendo o Digital</h4>
                        <p v-translate class="text-gray-200 font-semibold leading-5">
                            O NEI Market Analytics oferece uma plataforma abrangente para explorar e entender o mundo
                            dos criptoativos e ações digitais, e ao utilizá-lo, você pode expandir seu conhecimento
                            sobre o ecossistema digital, tomar decisões informadas e aproveitar melhor as oportunidades
                            neste espaço em constante evolução.
                        </p>
                    </Card>
                </li>
                <li>
                    <Card class="flex flex-col items-center gap-4 p-4 md:p-7 bg-medium h-[500px] max-w-[400px]">
                        <Image :src="BitcoinRocket" alt="Hello" width="225" height="225" />
                        <h4 v-translate class="w-full">Começando a Investir</h4>
                        <p v-translate class="text-gray-200 font-semibold leading-5">
                            O NEI Market Analytics oferece ferramentas essenciais para iniciantes em investimentos
                            digitais: Análises simplificadas de criptoativos e ações - Artigos relacionados com o
                            mercado - Nossa I.A integrada para poder te ajudar com o que precisar. Com o NEI, você ganha
                            confiança para dar seus primeiros passos no universo dos investimentos digitais!
                        </p>
                    </Card>
                </li>
                <li>
                    <Card class="flex flex-col items-center gap-4 p-4 md:p-7 bg-primary h-[500px] max-w-[400px]">
                        <Image :src="BitcoinEscudo" alt="Hello" width="225" height="225" />
                        <h4 v-translate class="w-full">Ferramentas NEI Market</h4>
                        <p v-translate class="text-gray-200 font-semibold leading-5">
                            Nossa plataforma oferece: Dados em tempo real sobre criptomoedas e ações digitais - Análise
                            técnica detalhada para tomada de decisões informadas - Conversor de moedas - Visualizações
                            interativas para compreender tendências de mercado - Ranking de criptoativos e ações com
                            maior valorização/desvalorização.
                        </p>
                    </Card>
                </li>
            </ul>
        </article>
    </section>
</template>
