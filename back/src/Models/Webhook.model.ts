import { model, Schema, Document, Model } from 'mongoose';
import { WebhookNotFoundError } from './Errors/WebhookError';

const WebhookSchema = new Schema({
	url: String,
	createdAt: Date,
	updatedAt: Date,
});

export interface IWebhookUpdateBody {
	url: string;
}

export interface IWebhook extends Document {
	id: string;
	url: string;
	createdAt: Date;
	updatedAt: Date;
}

// For model
export interface IWebhookModel extends Model<IWebhook> {
	getAll(): Promise<IWebhook[]>;
	getOne(_id: string): Promise<IWebhook | undefined>;

	adding(url: string): Promise<IWebhook>;
	deleting(id: string);

	toJSON(): IWebhook;
}

// Static methods

WebhookSchema.statics.getAll = async function () {
	return await this.find().exec();
};

WebhookSchema.statics.getOne = async function (_id: string): Promise<IWebhook | undefined> {
	return await this.findOne({ _id }).exec();
};

WebhookSchema.statics.adding = async function (url: string): Promise<IWebhook> {
	let element = new this({
		url,
	});
	element.createdAt = new Date();
	element.updatedAt = new Date();
	return await element.save();
};

WebhookSchema.statics.delete = async function (faceId: number): Promise<IWebhook> {
	const Webhook = await this.findOne({ faceId });
	if (!Webhook) throw new WebhookNotFoundError('Webhook');
	Webhook.isSetting = true;
	return await Webhook.save();
};

WebhookSchema.statics.stopCurrentSettings = async function (): Promise<void> {
	const Webhooks = await this.find({ isSetting: true });
	for (const Webhook of Webhooks) {
		Webhook.isSetting = false;
		await Webhook.save();
	}
};

WebhookSchema.statics.deleting = async function (id: string) {
	return await this.deleteOne({ _id: id });
};

WebhookSchema.set('toJSON', { virtuals: true });

export const name = 'Webhook';

export default model<IWebhook, IWebhookModel>(name, WebhookSchema);
