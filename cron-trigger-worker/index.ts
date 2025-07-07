import type {
	ExecutionContext,
	ScheduledController,
	Service,
} from "@cloudflare/workers-types";

interface Env {
	CRON_SECRET: string;
	WORKFLOW_URL: string;
	WORKFLOW: Service;
}

export default {
	async scheduled(
		_controller: ScheduledController,
		env: Env,
		_ctx: ExecutionContext,
	) {
		const endpoint = `${env.WORKFLOW_URL}/api/run`;
		console.log(`sending request to ${endpoint}`);

		const response = await env.WORKFLOW.fetch(endpoint, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${env.CRON_SECRET}`,
			},
		});

		console.log("api responded with: ", response.status, response.statusText);
	},
};
