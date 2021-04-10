import { model, Schema, Document, Model } from 'mongoose';
import DiceFace, { IDiceFace, name as DiceFaceName } from './DiceFace';
import { NoCurrentDiceError, AlreadyStartedCurrentDiceError } from './Errors/DiceError';

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

export type TDiceTimeRangeObject = { face?: IDiceFace; elements: IDiceFaceTime[]; duration: number };

export type TDiceTimeRange = { [faceId: number]: TDiceTimeRangeObject };

// For model
export interface IDiceFaceTimeModel extends Model<IDiceFaceTime> {
	getAll(faceId?: number): Promise<IDiceFace[]>;
	getCalendar(start: Date, end?: Date, faceId?: number): Promise<{ IEventBigCalendar }>;
	getCurrent(): Promise<IDiceFaceTime>;
	getByRange(start: Date, end?: Date, faceId?: number): Promise<TDiceTimeRangeObject[]>;
	start(face: IDiceFace): Promise<IDiceFaceTime>;
	newRange(face: IDiceFace, start: Date, end: Date);
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
			resource: element,
		};
	});

	return convertedElements;
};

DiceFaceTimeSchema.statics.getCurrent = async function () {
	let current = await this.findOne({ current: true }).populate('face');
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

	const sortedDurationResultArray = Object.entries(result)
		.sort(([, a], [, b]) => {
			return b.duration - a.duration;
		})
		.reduce((a, [_, c]) => a.concat(c), []);
	return sortedDurationResultArray;
};

DiceFaceTimeSchema.statics.start = async function (face: IDiceFace): Promise<IDiceFace> {
	try {
		await this.getCurrent();
	} catch (err) {
		if (err instanceof NoCurrentDiceError) {
			const element = new this({
				face,
				faceId: face.faceId,
				start: new Date(),
				current: true,
			});

			return await element.save();
		} else {
			throw new AlreadyStartedCurrentDiceError(name);
		}
	}
};

DiceFaceTimeSchema.statics.newRange = async function (
	face: IDiceFace,
	start: Date,
	end: Date
): Promise<IEventBigCalendar> {
	const element = new this({
		face,
		faceId: face.faceId,
		start,
		end,
		current: false,
	});

	await element.save();

	return {
		start: element.start,
		end: element.end,
		hexColor: element.face.color,
		title: element.face.name,
		resource: element,
	};
};

DiceFaceTimeSchema.statics.stop = async function (): Promise<IDiceFace> {
	const element = await this.getCurrent();
	element.end = new Date();
	element.current = false;

	return await element.save();
};

DiceFaceTimeSchema.statics.deleting = async function (id: string) {
	return await this.deleteOne({ _id: id });
};

DiceFaceTimeSchema.statics.updating = async function (id: string, body: IDiceFaceTimeUpdateBody) {
	let element = await this.findById(id);
	if (!element) throw new NoCurrentDiceError(name);

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
		element.faceId = body.faceId;
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
