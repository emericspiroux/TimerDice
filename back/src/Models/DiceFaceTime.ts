import { object } from 'joi';
import { model, Schema, Document, Model } from 'mongoose';
import DiceFace, { IDiceFace } from './DiceFace';
import ModelError from './Errors/ModelError';

const DiceFaceTimeSchema = new Schema({
	current: Boolean,
	face: Object,
	start: Date,
	end: Date,
});

export interface IDiceFaceTime extends Document {
	id: string;
	current: boolean;
	face: IDiceFace;
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
	if (!current) throw new ModelError(name, 404, 'no_current', 'No current face time started');
	return current;
};

DiceFaceTimeSchema.statics.getByRange = async function (
	start?: Date,
	end?: Date,
	faceId?: number
): Promise<TDiceTimeRange> {
	let request: any = {};
	if (start) {
		request.end = { $gt: start };
	}
	if (end) {
		request.end = { $lt: end };
	}
	if (faceId) {
		request['face.faceId'] = faceId;
	}
	let elements: IDiceFaceTime[] = await this.find(request);

	let result: TDiceTimeRange = {};

	for (const element of elements) {
		result[element.face.faceId] = result[element.face.faceId] || { elements: [], duration: 0 };
		result[element.face.faceId].elements.push(element);
		result[element.face.faceId].duration += element.duration;
		result[element.face.faceId].face = element.face;
	}

	const sortedDurationResult = Object.entries(result)
		.sort(([, a], [, b]) => b.duration - a.duration)
		.reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

	return sortedDurationResult;
};

DiceFaceTimeSchema.statics.start = async function (face: IDiceFace): Promise<IDiceFace> {
	const element = new this({
		face,
		start: new Date(),
		current: true,
	});

	return await element.save();
};

DiceFaceTimeSchema.statics.stop = async function (): Promise<IDiceFace> {
	const element = await this.getCurrent();
	if (!element) {
		throw new ModelError('DiceFaceTime', 404, 'not_found_started', `No face started`);
	}
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
	return Number(end.toTimeString()) - Number(start.toTimeString());
});

DiceFaceTimeSchema.set('toJSON', { virtuals: true });

export const name = 'DiceFaceTime';

export default model<IDiceFaceTime, IDiceFaceTimeModel>(name, DiceFaceTimeSchema);
