import axios from 'axios';
import { IDiceFaceTime } from '../../Models/DiceFaceTime';
import WebhookModel, { IWebhook } from '../../Models/Webhook.model';

export default class WebhookEngine {
	static shared = new WebhookEngine();
	private timeout?: NodeJS.Timeout;

	async execute(diceTime?: IDiceFaceTime) {
		if (this.timeout) clearTimeout(this.timeout);
		this.timeout = setTimeout(async () => {
			const webhooks = await WebhookModel.getAll();
			for (const webhook of webhooks) {
				this.send(webhook, diceTime);
			}
		}, 1000);
	}

	async clean() {
		this.execute();
	}

	async send(webhook: IWebhook, diceTime?: IDiceFaceTime) {
		return await axios.post(webhook.url, diceTime);
	}
}
