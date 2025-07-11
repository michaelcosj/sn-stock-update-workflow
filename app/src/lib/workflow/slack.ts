import { SLACK_TOKEN, SLACK_USER_ID } from "$env/static/private";
import type { StockLevelsSchemaType } from "$lib/types";

async function getChannelId() {
	const response = await fetch("https://slack.com/api/conversations.open", {
		method: "post",
		body: JSON.stringify({ users: SLACK_USER_ID }),
		headers: {
			Authorization: `Bearer ${SLACK_TOKEN}`,
			"Content-Type": "application/json",
		},
	});

	const json = await response.json();
	if (!json.ok) throw new Error(json.error);

	return json.channel.id as string;
}

async function getFileUploadUrl(fileLength: number) {
	const formattedDate = new Date()
		.toLocaleDateString("en-GB")
		.replace(/\//g, "-");
	const fileName = `stock-on-hand_${formattedDate}.json`;

	const form = new FormData();
	form.append("filename", fileName);
	form.append("length", String(fileLength));
	form.append("snippet_type", "json");

	const response = await fetch(
		"https://slack.com/api/files.getUploadURLExternal",
		{
			method: "post",
			body: form,
			headers: {
				Authorization: `Bearer ${SLACK_TOKEN}`,
			},
		},
	);

	const json = await response.json();
	if (!json.ok) throw new Error(json.error);

	return {
		uploadUrl: json.upload_url as string,
		fileId: json.file_id as string,
	};
}

async function uploadSnippet(uploadUrl: string, data: Buffer) {
	const form = new FormData();
	form.append("file", new Blob([data], { type: "application/json" }));

	const response = await fetch(uploadUrl, {
		method: "post",
		body: form,
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Upload failed: ${response.status} ${text}`);
	}
}

async function completeSnippetUpload(
	fileId: string,
	channelId: string,
	subject: string | undefined,
) {
	const response = await fetch(
		"https://slack.com/api/files.completeUploadExternal",
		{
			method: "post",
			body: JSON.stringify({
				files: [
					{ id: fileId, title: subject ?? "Sienna Naturals Stock Levels" },
				],
				channel_id: channelId,
			}),
			headers: {
				Authorization: `Bearer ${SLACK_TOKEN}`,
				"Content-Type": "application/json",
			},
		},
	);

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Upload failed: ${response.status} ${text}`);
	}
}

export async function sendDataAsSlackMessage(
	data: StockLevelsSchemaType,
	subject: string | undefined,
) {
	try {
		const channelId = await getChannelId();

		// upload data as text snippet
		const dataBuffer = Buffer.from(JSON.stringify(data, null, 2), "utf-8");

		console.log("Getting file upload url");
		const { uploadUrl, fileId } = await getFileUploadUrl(dataBuffer.byteLength);

		console.log(`Uploading snippet with fileId ${fileId}`);
		await uploadSnippet(uploadUrl, dataBuffer);
		await completeSnippetUpload(fileId, channelId, subject);

		console.log("Snippet uploaded");
	} catch (error) {
		console.log("Error sending slack message");
		throw error;
	}
}
