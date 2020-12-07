import { number, object, string } from 'joi';
import { model, Schema, Document, Model } from 'mongoose';
import { start } from 'repl';
import DiceFace, { IDiceFace, name as DiceFaceName } from './DiceFace';
import { NoCurrentDiceError, WrongStartEndDiceError } from './Errors/DiceError';
import ModelError from './Errors/ModelError';

const DiceFaceTimeSchema = new Schema({
	current: Boolean,
	face: { type: Schema.Types.ObjectId, ref: DiceFaceName },
	faceId: Number,
	start: Date,
	end: Date,
	description: String,
});

export interface IDiceFaceTimeUpdateBody {
	faceId?: number;
	start?: Date;
	end?: Date;
	description?: string;
}

export interface IDiceFaceTime extends Document {
	id: string;
	current: boolean;
	face: IDiceFace;
	faceId: number;
	start: Date;
	end?: Date;
	duration: number;
	description?: string;
}

export interface IEventBigCalendar {
	title: string;
	start: Date;
	hexColor: string;
	end: Date;
	allDay?: boolean;
	resource?: any;
}

export type TDiceTimeRange = { [faceId: number]: { face?: IDiceFace; elements: IDiceFaceTime[]; duration: number } };

// For model
export interface IDiceFaceTimeModel extends Model<IDiceFaceTime> {
	getAll(faceId?: number): Promise<IDiceFace[]>;
	getCalendar(start: Date, end?: Date, faceId?: number): Promise<{ IEventBigCalendar }>;
	getCurrent(): Promise<IDiceFaceTime>;
	getByRange(start: Date, end?: Date, faceId?: number): Promise<{ [faceId: number]: IDiceFaceTime[] }>;
	start(face: IDiceFace): Promise<IDiceFaceTime>;
	stop(): Promise<IDiceFaceTime>;
	updating(id: string, body: IDiceFaceTimeUpdateBody);
	deleting(id: string): any;
	toJSON(): IDiceFace;
}

// Static methods

DiceFaceTimeSchema.statics.getAll = async function (faceId?: number) {
	return await this.getByRange(null, null, faceId);
};

DiceFaceTimeSchema.statics.getCalendar = async function (
	start?: Date,
	end?: Date,
	faceId?: number
): Promise<IEventBigCalendar[]> {
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

	const convertedElements: IEventBigCalendar[] = elements.map((element: IDiceFaceTime) => {
		return {
			start: element.start,
			end: element.end,
			hexColor: element.face.color,
			title: element.face.name,
			resource: {
				id: element.id,
			},
		};
	});

	return convertedElements;
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

DiceFaceTimeSchema.statics.updating = async function (id: string, body: IDiceFaceTimeUpdateBody) {
	let element = await this.findById(id);
	if (!element) throw new NoCurrentDiceError(name);

	if (body.start && body.end && new Date(body.end) <= new Date(body.start)) {
		throw new WrongStartEndDiceError(name);
	}

	if (body.start) {
		element.start = new Date(body.start);
	}

	if (body.end) {
		element.end = new Date(body.end);
	}

	if (body.description) {
		element.description = body.description;
	}

	if (body.faceId) {
		const face = await DiceFace.getFace(body.faceId);
		element.faceId = face.id;
		element.face = face;
	}

	const newElement = await element.save();
	return await newElement.populate('face').execPopulate();
};

DiceFaceTimeSchema.virtual('duration').get(function () {
	const start = new Date(this.start);
	const end = new Date(this.end);
	return end.valueOf() - start.valueOf();
});

DiceFaceTimeSchema.set('toJSON', { virtuals: true });

export const name = 'DiceFaceTime';

export default model<IDiceFaceTime, IDiceFaceTimeModel>(name, DiceFaceTimeSchema);
