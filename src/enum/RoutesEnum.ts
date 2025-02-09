import router from "@/router";
import * as Lucid from "lucide-vue-next";
import type {FunctionalComponent} from "vue";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class RoutesEnum {
	private static getRouteNames() {
		const routeNames: {[key: string]: string} = {};
		for (const route of router.getRoutes()) {
			if (route.meta?.title) {
				routeNames[route.meta.title as string] = route.name as string;
			}
		}
		return routeNames;
	}

	public static getRouteMappings() {
		const routeMappings: {[key: string]: string} = {};
		for (const route of router.getRoutes()) {
			if (route.name && route.path && !route.path.includes(":")) {
				routeMappings[route.name as string] = route.path;
			}
		}
		return routeMappings;
	}

	private static getRouteIcon() {
		const routeIcons: {[key: string]: string} = {};
		for (const route of router.getRoutes()) {
			if (route.meta?.icon) {
				routeIcons[route.name as string] = route.meta.icon as string;
			}
		}
		return routeIcons;
	}

	public static findClosestTextMatch(input: string): string | undefined {
		let closestMatch = undefined;
		let closestMatchLength = Number.POSITIVE_INFINITY;
		let highestSimilarityScore = -1;

		if (input === "" || input === undefined || input === null) {
			return "";
		}

		for (const text of Object.values(RoutesEnum.getRouteNames())) {
			const lowerCaseText = text.toLowerCase();
			const lowerCaseInput = input.toLowerCase();

			let similarityScore = 0;
			let searchPosition = 0;
			for (const char of lowerCaseInput) {
				const foundPosition = lowerCaseText.indexOf(char, searchPosition);
				if (foundPosition !== -1) {
					similarityScore++;
					searchPosition = foundPosition + 1;
				} else {
					break;
				}
			}

			const lengthDifference = Math.abs(input.length - text.length);
			if (
				similarityScore > highestSimilarityScore ||
				(similarityScore === highestSimilarityScore &&
					lengthDifference < closestMatchLength)
			) {
				closestMatch = text;
				closestMatchLength = lengthDifference;
				highestSimilarityScore = similarityScore;
			}
		}

		return closestMatch;
	}

	public static findClosestRouteMatch(input: string): string {
		const closestTextMatch = RoutesEnum.findClosestTextMatch(input);

		return RoutesEnum.getRouteMappings()[closestTextMatch as string];
	}

	public static findClosestIconMatch(
		input: string,
	): FunctionalComponent<Lucid.LucideProps, {}, any, {}> {
		const closestTextMatch = RoutesEnum.findClosestTextMatch(input);
		return Lucid[`${RoutesEnum.getRouteIcon()[closestTextMatch as string]}`];
	}
}
