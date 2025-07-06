import { store } from "$lib/store";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getStockLevelDataFromEmail } from "$lib/workflow/gmail";
import { processStockLevelData } from "$lib/workflow/model";
import { sendDataAsSlackMessage } from "$lib/workflow/slack";

export const POST: RequestHandler = async ({ platform, request }) => {
	try {
		if (!platform) {
			error(500, "no platform for worker kv");
		}

		// check request is from our worker
		const authHeader = request.headers.get("Authorization");
		if (
			!authHeader ||
			authHeader?.split(" ").pop() !== platform.env.CRON_SECRET
		) {
			error(401);
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
