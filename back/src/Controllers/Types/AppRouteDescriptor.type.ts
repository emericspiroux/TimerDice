import { Router } from 'express';
import { type } from 'os';

export default interface AppRouteDescriptor {
	path: string;
	router: Router;
}
