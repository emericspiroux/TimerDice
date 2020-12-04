import { model, Schema, Document, Model } from 'mongoose';

const DiceFaceSchema = new Schema({
	enabled: Boolean,
	faceId: Number,
	name: String,
	color: String,
});

export interface IDiceFace extends Document {
	enabled: boolean;
	faceId: number;
	name: string;
	color: string;
}

// For model
export interface IDiceFaceModel extends Model<IDiceFace> {
	getFace(faceId: number): Promise<IDiceFace>;
	getAll(): Promise<IDiceFace[]>;
	define(enabled: boolean, faceId: number, name: string, color: string): Promise<IDiceFace>;
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
	color: string
): Promise<IDiceFace> {
	let element: IDiceFace = await this.findOne({ faceId });
	if (!element) element = new this();

	element.enabled = enabled;
	element.faceId = faceId;
	element.name = name;
	element.color = color;
	return await element.save();
};

DiceFaceSchema.statics.deleting = async function (faceId: number) {
	return await this.deleteOne({ faceId });
};

DiceFaceSchema.set('toJSON', { virtuals: true });

export const name = 'DiceFace';

export default model<IDiceFace, IDiceFaceModel>(name, DiceFaceSchema);
