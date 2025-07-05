import { store } from "$lib/store";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform }) => {
	if (!platform) {
		error(500, "No platform in environment");
	}

	const workflowHistory = await store.getHistory(platform);
	return {
		workflowHistory,
	};
};
