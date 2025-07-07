import { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } from "$env/static/private";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import * as xlsx from "xlsx";

const SUBJECT = "Stock-On-Hand";
const ATTACHMENT = "MainchainStockOnHand";

async function getGmailClient() {
	const oAuthClient = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);
	oAuthClient.setCredentials({
		refresh_token: REFRESH_TOKEN,
	});

	return google.gmail({ version: "v1", auth: oAuthClient });
}

export async function getStockLevelDataFromEmail() {
	try {
		const client = await getGmailClient();
		const result = await client.users.messages.list({
			userId: "me",
			labelIds: ["INBOX"],
			q: `from:help@heysynth.com newer_than:1d subject:"${SUBJECT}"`,
			maxResults: 1,
		});

		const messages = result.data.messages ?? [];
		if (messages.length === 0) {
			console.log("No message found");
			return null;
		}

		const message = await client.users.messages.get({
			userId: "me",
			id: messages[0].id ?? undefined,
			format: "full",
		});

		let attachmentMetadata: {
			id: string;
			subject?: string;
			filename: string;
			mimetype: string;
		} | null = null;

		for (const part of message.data.payload?.parts ?? []) {
			// must be an attachment
			if (!part.filename) continue;

			// must be mainchain stock on hand file
			if (!part.filename.match(new RegExp(ATTACHMENT, "i"))) continue;

			// must be an excel sheet
			if (
				part.mimeType !== "application/vnd.ms-excel" &&
				part.mimeType !==
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
			)
				continue;

			if (part.body?.attachmentId) {
				console.log(`Found attachment ${part.filename}`);

				const subject =
					message.data.payload?.headers?.find(
						(header) => header.name === "Subject",
					)?.value ?? undefined;

				attachmentMetadata = {
					id: part.body.attachmentId,
					mimetype: part.mimeType,
					filename: part.filename,
					subject,
				};

				break;
			}
		}

		if (!attachmentMetadata) {
			console.log("No attachment found in message");
			return null;
		}

		const attachment = await client.users.messages.attachments.get({
			userId: "me",
			id: attachmentMetadata.id,
			messageId: message.data.id!,
		});

		const buffer = Buffer.from(
			attachment.data.data?.replace(/-/g, "+").replace(/_/g, "/") ?? "",
			"base64",
		);

		const sheet = xlsx.read(buffer);
		const data = xlsx.utils.sheet_to_csv(sheet.Sheets[sheet.SheetNames[0]]);

		return {
			csv: data,
			attachment: {
				raw: buffer,
				filename: attachmentMetadata.filename,
				mimetype: attachmentMetadata.mimetype,
				subject: attachmentMetadata.subject,
			},
		};
	} catch (error) {
		console.error("An error occurred", error);
	}
}
