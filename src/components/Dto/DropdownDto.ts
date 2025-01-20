import type {Menu} from "../Dropdown.vue";
import Ethereum from "@/assets/images/ethereum.png";
import Bitcoin from "@/assets/images/bitcoin.png";
import Dogecoin from "@/assets/images/dogecoin.png";
import Vale from "@/assets/images/logo-vale.jpg";
import Wege from "@/assets/images/logo-wege.png";
import Petrobras from "@/assets/images/logo-petra.jpg";
export const DropdownDto: Menu[] = [
	{
		titleRepresentation: {
			type: "emoji",
			value: "&#129689;",
		},
		title: "Criptomoedas",
		link: "/cryptos",
		subContent: [
			{
				title: "Bitcoin",
				link: "/cryptos/bitcoin",
				logo: Bitcoin,
			},
			{
				title: "Ethereum",
				link: "/cryptos/ethereum",
				logo: Ethereum,
			},
			{
				title: "Dogecoin",
				link: "/cryptos/dogecoin",
				logo: Dogecoin,
			},
		],
	},
	{
		titleRepresentation: {
			type: "emoji",
			value: "&#128188;",
		},
		title: "Bolsa de Valores",
		link: "/stocks",
		subContent: [
			{
				title: "Petrobras",
				link: "/stocks/PETR3",
				logo: Petrobras,
			},
			{
				title: "Vale",
				link: "/stocks/VALE3",
				logo: Vale,
			},
			{
				title: "Weg",
				link: "/stocks/WEGE3",
				logo: Wege,
			},
		],
	},
];
