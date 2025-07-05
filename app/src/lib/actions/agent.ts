import { GEMINI_API_KEY } from "$env/static/private";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import z from "zod";

const SYSTEM_PROMPT = `
  Extract the product and it's stock level from the csv data. 
  Use the code as the sku and the total stock on hand as the stock level.
  The following are the available skus. The output skus should match these.

  box-MiniHairRitual, MiniDCG, CurlGelee, K-Juneteenth25Bundle, 6ozCurlMousse
  A-Towel, S-HapiShamp, CMP-DISC-minidcg, CMP-BTL-minidcg, CMP-DISC-CURLGELEE, 
  CMP-BTL-CURLGELEE, BOX-LOCKSEAL, BOX-CurlGelee, MiniPPMask, MiniDewMagic
  MiniUntangled, MiniHAPIShamp, MiniPP, MiniHS1.5, MiniHS, MiniDM, MiniUT
  MiniDCM, MiniHAPI, box-dailyelix, box-DNASerum, Lockseal, CurlMousse
  CurlCream, HapiShamp, A-BaobabCheckScarf, K-growit, K-RepairIt, K-HydrateIt
  K-DNABundle, DNASerum, k-sweetdreams, K-RootedinReal, K-ScarfPillow, A-PillowCase
  A-Mirror, A-Claw, A-PickComb, A-PromoSprayBottle, K-MiniWDR, A-Spraybottle
  K-DreamTeam, K-DCMousse, K-EarthOceanAccessories, K-HAPIHairFull, K-DCCWDR
  K-CCSetRefreshLaunch, A-DMDecal, A-DMTote, K-MaintainG, K-CleanseH, K-StrengthR
  K-MoistureD, Scalpscrub, K-Washday, A-ScrunchDG, A-ScrunchB, K-IssaWDR, PPMask
  Untangled, Curlelix, Dewmagic, Dailyelix
`;

// use structured output to get the data
const StockLevelsSchema = z
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

const model = new ChatGoogleGenerativeAI({
	model: "gemini-2.5-pro",
	maxOutputTokens: 2048 * 5,
	apiKey: GEMINI_API_KEY,
}).withStructuredOutput(StockLevelsSchema);

export async function processStockLevelData(data: string) {
	console.log("Sending data to model for processing");

	return model.invoke([
		new SystemMessage(SYSTEM_PROMPT),
		new HumanMessage(data),
	]);
}
