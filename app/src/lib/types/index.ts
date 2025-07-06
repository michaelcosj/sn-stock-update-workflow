import z from "zod";

// use structured output to get the data
export const StockLevelsSchema = z
	.array(
		z
			.object({
				stock: z
					.string()
					.describe("The total stock on hand level of a product"),
				sku: z.string().describe("The sku of the product"),
			})
			.describe("The stock on hand level of a sku"),
	)
	.describe("An array of the product skus and stock levels");

export type StockLevelsSchemaType = z.infer<typeof StockLevelsSchema>;

export interface WorkflowHistoryItem {
	timestamp: string;
	output: StockLevelsSchemaType;
	attachment: {
		raw: Buffer<ArrayBuffer>;
		filename: string;
		mimetype: string;
		subject: string | undefined;
	};
}

export type WorkflowHistory = WorkflowHistoryItem[];
