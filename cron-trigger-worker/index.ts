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
		return await fetch(env.SVELTEKIT_URL + "/api/run", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${env.CRON_SECRET}`,
			},
		});
	},
};
