import Mongoose from 'mongoose';

export default interface IServeurMongoConfig {
	uri: string;
	options?: Mongoose.ConnectionOptions;
}
