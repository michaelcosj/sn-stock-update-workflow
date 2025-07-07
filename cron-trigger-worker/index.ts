import type {
	ExecutionContext,
	ScheduledController,
} from "@cloudflare/workers-types";

export default {
	async scheduled(
		_controller: ScheduledController,
		env: { CRON_SECRET: string; SVELTEKIT_URL: string },
		_ctx: ExecutionContext,
	) {
		const endpoint = `${env.SVELTEKIT_URL}/api/run`;
		console.log(`sending request to ${endpoint}`);

		const response = await fetch(endpoint, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${env.CRON_SECRET}`,
			},
		});
		console.log("api responded with: ", response.status, response.statusText);
	},
};
