import { number, object } from 'joi';
import { model, Schema, Document, Model } from 'mongoose';
import DiceFace, { IDiceFace, name as DiceFaceName } from './DiceFace';
import NoCurrentDiceError from './Errors/DiceError';
import ModelError from './Errors/ModelError';

const DiceFaceTimeSchema = new Schema({
	current: Boolean,
	face: { type: Schema.Types.ObjectId, ref: DiceFaceName },
	faceId: Number,
	start: Date,
	end: Date,
});

export interface IDiceFaceTime extends Document {
	id: string;
	current: boolean;
	face: IDiceFace;
	faceId: number;
	start: Date;
	end?: Date;
	duration: number;
}

export type TDiceTimeRange = { [faceId: number]: { face?: IDiceFace; elements: IDiceFaceTime[]; duration: number } };

// For model
export interface IDiceFaceTimeModel extends Model<IDiceFaceTime> {
	getAll(faceId?: number): Promise<IDiceFace[]>;
	getCurrent(): Promise<IDiceFaceTime>;
	getByRange(start: Date, end?: Date, faceId?: number): Promise<{ [faceId: number]: IDiceFaceTime[] }>;
	start(face: IDiceFace): Promise<IDiceFaceTime>;
	stop(): Promise<IDiceFaceTime>;
	deleting(id: string): any;
	toJSON(): IDiceFace;
}

// Static methods

DiceFaceTimeSchema.statics.getAll = async function (faceId?: number) {
	return await this.getByRange(null, null, faceId);
};

DiceFaceTimeSchema.statics.getCurrent = async function () {
	let current = await this.findOne({ current: true });
	if (!current) throw new NoCurrentDiceError(name);
	return current;
};

DiceFaceTimeSchema.statics.getByRange = async function (
	start?: Date,
	end?: Date,
	faceId?: number
): Promise<TDiceTimeRange> {
	let request: any = { current: false };
	if (start) {
		request.end = { $gt: start };
	}
	if (end) {
		request.end = { $lt: end };
	}
	if (faceId) {
		request['face.faceId'] = faceId;
	}
	let elements: IDiceFaceTime[] = await this.find(request).populate('face');

	let result: TDiceTimeRange = {};

	for (const element of elements) {
		result[element.face.faceId] = result[element.face.faceId] || { elements: [], duration: 0 };
		result[element.face.faceId].elements.push(element);
		result[element.face.faceId].duration += element.duration;
		result[element.face.faceId].face = await DiceFace.getFace(element.face.faceId);
	}

	const sortedDurationResult = Object.entries(result)
		.sort(([, a], [, b]) => b.duration - a.duration)
		.reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

	return sortedDurationResult;
};

DiceFaceTimeSchema.statics.start = async function (face: IDiceFace): Promise<IDiceFace> {
	const element = new this({
		face,
		faceId: face.faceId,
		start: new Date(),
		current: true,
	});

	return await element.save();
};

DiceFaceTimeSchema.statics.stop = async function (): Promise<IDiceFace> {
	const element = await this.getCurrent();
	element.end = new Date();
	element.current = false;

	return await element.save();
};

DiceFaceTimeSchema.statics.deleting = async function (id: string) {
	return await this.deleteOne({ id });
};

DiceFaceTimeSchema.virtual('duration').get(function () {
	const start = new Date(this.start);
	const end = new Date(this.end);
	return end.valueOf() - start.valueOf();
});

DiceFaceTimeSchema.set('toJSON', { virtuals: true });

export const name = 'DiceFaceTime';

export default model<IDiceFaceTime, IDiceFaceTimeModel>(name, DiceFaceTimeSchema);
