import ModelError from './ModelError';

export class WebhookNotFoundError extends ModelError {
	constructor(modelName: string) {
		super(modelName, 404, 'webhook_no_found', 'Webhook not found');
	}
}
