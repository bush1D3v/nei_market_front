import {test, expect, describe} from "vitest";
import HoverCard from "src/components/HoverCard.vue";
import {mount} from "@vue/test-utils";
import {HoverCardMock} from "../../mocks/components/HoverCard";

describe("HoverCard Component Tests", () => {
	const wrapper = mount(HoverCard, {props: {...HoverCardMock}});
	const hoverCardComponent = wrapper.findComponent(HoverCard);

	test("Should be able to render the component correctly", async () => {
		expect(hoverCardComponent).toBeDefined();
	});

	test("Should be able to snapshot the component correctly", async () => {
		expect(hoverCardComponent.html()).toMatchSnapshot();
	});

	test("Should be able to render the component with the correct props", async () => {
		expect(hoverCardComponent.text()).toContain(HoverCardMock.title);
	});

	test("Should be able to hover the component", async () => {
		expect(hoverCardComponent.trigger("mouseenter")).toBeDefined();
	});
});
