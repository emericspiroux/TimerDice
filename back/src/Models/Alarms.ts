import Agenda from 'agenda';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { model, Schema, Document, Model } from 'mongoose';
import AlarmEventNamesEnum from '../Jobs/Alarms/AlarmEventNames.enum';
import { NotFoundElement } from './Errors/ModelError';

const AlarmSchema = new Schema({
	enabled: Boolean,
	days: {
		type: Array,
	},
	hour: Number,
	min: Number,
	play: {
		playlistId: String,
		shuffle: Boolean,
		volume: Number,
	},
});

export interface IAlarm extends Document {
	enabled: boolean;
	days: Array<0 | 1 | 2 | 3 | 4 | 5 | 6>;
	hour: Number;
	min: Number;
	play: IAlarmPlay;
	setTime(date: Date): void;
}

export interface IAlarmPlay {
	playlistId: string;
	shuffle: Boolean;
	volume: Number;
}

// For model
export interface IAlarmModel extends Model<IAlarm> {
	getAll(): Promise<IAlarm[]>;
	adding(
		agenda: Agenda,
		enabled: boolean,
		hour: number,
		min: number,
		days: Array<number>,
		play: IAlarmPlay
	): Promise<IAlarm>;
	updating(
		agenda: Agenda,
		id: string,
		enabled: boolean,
		hour: number,
		min: number,
		days: Array<number>,
		play: IAlarmPlay
	): Promise<IAlarm>;
	deleting(agenda: Agenda, id: string);
	toJSON(): IAlarm;
}

// Static methods

AlarmSchema.statics.getAll = async function () {
	return await this.find().exec()
};

AlarmSchema.statics.adding = async function (
	agenda: Agenda,
	enabled: boolean,
	hour: number,
	min: number,
	days: Array<0 | 1 | 2 | 3 | 4 | 5 | 6>,
	play: IAlarmPlay
): Promise<IAlarm> {
	let element = new this({
		enabled,
		days,
		hour,
		min,
		play,
	});
	let newElement = await element.save();

	// Set alarm
	let cronTxt = `${element.min} ${element.hour} * * ${element.days.join(',')}`;
	const alarmJob = agenda.create(AlarmEventNamesEnum.alarm, newElement.toJSON());
	await alarmJob.repeatEvery(cronTxt, {skipImmediate: true}).save();

	return element;
};

AlarmSchema.statics.deleting = async function (agenda: Agenda, id: string) {
	await this.deleteOne({ _id: id }).exec();
	await agenda.cancel({ 'data._id': new ObjectId(id) });
	return;
};

AlarmSchema.statics.updating = async function (
	agenda: Agenda,
	id: string,
	enabled: boolean,
	hour: number,
	min: number,
	days: Array<0 | 1 | 2 | 3 | 4 | 5 | 6>,
	play: IAlarmPlay
): Promise<IAlarm> {
	let element = await this.findOne({ _id: id });
	if (!element) throw new NotFoundElement('Alarms');
	element.enabled = enabled;
	element.days = days;
	element.play = play;
	element.hour = hour;
	element.min = min;

	let updatedElement = await element.save();

	// Set alarm
	await agenda.cancel({ 'data._id': new ObjectId(id) });
	let cronTxt = `${element.min} ${element.hour} * * ${element.days.join(',')}`;
	const alarmJob = agenda.create(AlarmEventNamesEnum.alarm, updatedElement.toJSON());
	await alarmJob.repeatEvery(cronTxt, {skipImmediate: true}).save();

	return element;
};

AlarmSchema.set('toJSON', { virtuals: true });

export default model<IAlarm, IAlarmModel>('Alarm', AlarmSchema);
