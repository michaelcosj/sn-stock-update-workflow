import readline from "readline";
import { OAuth2Client } from "google-auth-library";

const CLIENT_ID = "";
const CLIENT_SECRET = "";
const REDIRECT_URI = "";

async function main() {
	const oAuth2 = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

	const authUrl = oAuth2.generateAuthUrl({
		access_type: "offline",
		prompt: "consent",
		scope: ["https://www.googleapis.com/auth/gmail.readonly"],
	});
	console.log("1) Go to:", authUrl);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question("2) Enter the code here: ", async (code) => {
		rl.close();
		const { tokens } = await oAuth2.getToken(code.trim());
		console.log("Save these in your .env or secret store:");
		console.log(JSON.stringify(tokens, null, 2));
	});
}

main().catch(console.error);
