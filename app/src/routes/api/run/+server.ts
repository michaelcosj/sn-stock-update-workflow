import { processStockLevelData } from "$lib/actions/agent";
import { getStockLevelDataFromEmail } from "$lib/actions/gmail";
import { sendDataAsSlackMessage } from "$lib/actions/slack";
import { store } from "$lib/store";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ platform }) => {
	try {
		if (!platform) {
			error(500, "no platform for worker kv");
		}

		const data = await getStockLevelDataFromEmail();
		if (!data) {
			error(404, "Stock level data from email not found");
		}

		const output = await processStockLevelData(data.csv);
		console.log("Model generated output: ", output);

		await sendDataAsSlackMessage(output, data.attachment.subject);
		console.log("Sent data to slack successfully");

		await store.appendToHistory(platform, {
			output,
			attachment: data.attachment,
		});
	} catch (err) {
		error(400, `An error occured: ${err}`);
	}

	return json({ status: "success" });
};
