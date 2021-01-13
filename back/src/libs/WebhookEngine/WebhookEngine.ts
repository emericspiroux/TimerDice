import axios from 'axios';
import { IDiceFaceTime } from '../../Models/DiceFaceTime';
import WebhookModel, { IWebhook } from '../../Models/Webhook.model';

export default class WebhookEngine {
	static shared = new WebhookEngine();

	async execute(diceTime: IDiceFaceTime | undefined) {
		const webhooks = await WebhookModel.getAll();
		for (const webhook of webhooks) {
			this.send(webhook, diceTime);
		}
	}

	async clean() {
		const webhooks = await WebhookModel.getAll();
		for (const webhook of webhooks) {
			this.send(webhook);
		}
	}

	async send(webhook: IWebhook, diceTime?: IDiceFaceTime) {
		return await axios.post(webhook.url, diceTime);
	}
}
