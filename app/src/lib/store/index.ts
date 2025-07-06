import type { WorkflowHistory, WorkflowHistoryItem } from "$lib/types";

export const store = {
	async appendToHistory(
		platform: Readonly<App.Platform>,
		data: Omit<WorkflowHistoryItem, "timestamp">,
	) {
		const current: WorkflowHistoryItem = {
			...data,
			timestamp: new Date().toISOString(),
		};

		const historyData = await platform.env.KV.get("history");
		if (!historyData) {
			await platform.env.KV.put("history", JSON.stringify([current]));
			return current;
		}

		const history: WorkflowHistory = JSON.parse(historyData);
		await platform.env.KV.put(
			"history",
			JSON.stringify([...history.slice(0, 29), current]),
		);

		return current;
	},

	async getHistory(platform: Readonly<App.Platform>): Promise<WorkflowHistory> {
		const historyData = await platform.env.KV.get("history");
		if (!historyData) {
			return [];
		}

		return JSON.parse(historyData);
	},
};
