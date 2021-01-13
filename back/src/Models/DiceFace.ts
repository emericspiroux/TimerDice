import { model, Schema, Document, Model } from 'mongoose';
import { DiceFaceNotFoundError } from './Errors/DiceError';

const DiceFaceSchema = new Schema({
	enabled: Boolean,
	isSetting: Boolean,
	faceId: Number,
	name: String,
	color: String,
	slackStatus: {
		text: String,
		emoji: String,
	},
	createdAt: Date,
	updatedAt: Date,
});

export interface IDiceFaceUpdateBody {
	name?: string;
	color?: string;
	slackStatus?: {
		text?: String;
		emoji?: String;
	};
}

export interface IDiceFace extends Document {
	id: string;
	enabled: boolean;
	isSetting: boolean;
	faceId: number;
	name: string;
	color: string;
	slackStatus?: {
		text?: String;
		emoji?: String;
	};
	createdAt: Date;
	updatedAt: Date;
}

// For model
export interface IDiceFaceModel extends Model<IDiceFace> {
	getFace(faceId: number): Promise<IDiceFace>;
	getAll(): Promise<IDiceFace[]>;
	updating(id: string, body: IDiceFaceUpdateBody): Promise<IDiceFace>;
	getCurrentSettings(): Promise<IDiceFace | undefined>;
	setCurrentSettings(face: number): Promise<IDiceFace>;
	stopCurrentSettings(): Promise<void>;
	define(
		enabled: boolean,
		faceId: number,
		name: string,
		color: string,
		slackStatus?: {
			text?: String;
			emoji?: String;
		}
	): Promise<IDiceFace>;
	deleting(faceId: number);
	toJSON(): IDiceFace;
}

// Static methods

DiceFaceSchema.statics.getAll = async function () {
	return await this.find().exec();
};

DiceFaceSchema.statics.getFace = async function (faceId: number) {
	return await this.findOne({ faceId });
};

DiceFaceSchema.statics.define = async function (
	enabled: boolean,
	faceId: number,
	name: string,
	color: string,
	slackStatus?: {
		text?: String;
		emoji?: String;
	}
): Promise<IDiceFace> {
	let element: IDiceFace = await this.findOne({ faceId });
	if (!element)
		element = new this({
			createdAt: new Date(),
		});

	element.slackStatus = slackStatus;
	element.enabled = enabled;
	element.faceId = faceId;
	element.name = name;
	element.color = color;
	element.updatedAt = new Date();
	return await element.save();
};

DiceFaceSchema.statics.setCurrentSettings = async function (faceId: number): Promise<IDiceFace> {
	const diceFace = await this.findOne({ faceId });
	if (!diceFace) throw new DiceFaceNotFoundError('DiceFace');
	diceFace.isSetting = true;
	return await diceFace.save();
};

DiceFaceSchema.statics.stopCurrentSettings = async function (): Promise<void> {
	const diceFaces = await this.find({ isSetting: true });
	for (const diceFace of diceFaces) {
		diceFace.isSetting = false;
		await diceFace.save();
	}
};

DiceFaceSchema.statics.updating = async function (id: string, body: IDiceFaceUpdateBody) {
	let element = await this.findById(id);
	if (!element) throw new DiceFaceNotFoundError(name);

	if (body.name) {
		element.name = body.name;
	}

	if (body.color) {
		element.color = body.color;
	}

	if (!element.slackStatus && body.slackStatus) {
		element.slackStatus = {};
	}

	if (body.slackStatus && body.slackStatus.emoji) {
		element.slackStatus.emoji = body.slackStatus.emoji;
	}

	if (body.slackStatus && body.slackStatus.text) {
		element.slackStatus.text = body.slackStatus.text;
	}

	return await element.save();
};

DiceFaceSchema.statics.getCurrentSettings = async function (): Promise<IDiceFace | undefined> {
	return await this.findOne({ isSetting: true });
};

DiceFaceSchema.statics.deleting = async function (faceId: number) {
	return await this.deleteOne({ faceId });
};

DiceFaceSchema.set('toJSON', { virtuals: true });

export const name = 'DiceFace';

export default model<IDiceFace, IDiceFaceModel>(name, DiceFaceSchema);
