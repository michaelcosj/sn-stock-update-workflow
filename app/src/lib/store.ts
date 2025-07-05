import type { StockLevelsSchemaType } from "./actions/agent";

interface WorkflowHistoryItem {
	timestamp: string;
	output: StockLevelsSchemaType;
	attachment: {
		raw: Buffer<ArrayBuffer>;
		filename: string;
		mimetype: string;
	};
}

type WorkflowHistory = WorkflowHistoryItem[];

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

		const history = JSON.parse(historyData) as WorkflowHistory;
		await platform.env.KV.put(
			"history",
			JSON.stringify([...history.slice(0, 29), current]),
		);

		return current;
	},

	async getHistory(platform: Readonly<App.Platform>) {
		const historyData = await platform.env.KV.get("history");
		if (!historyData) {
			return [];
		}

		return JSON.parse(historyData) as WorkflowHistory;
	},
};
