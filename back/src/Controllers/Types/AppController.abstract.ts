import express, { Router } from 'express';
import AppRouteDescriptor from './AppRouteDescriptor.type';

export interface IAppController {
	baseRoute: AppRouteDescriptor;
}

export default class AppController {
	router: Router = express.Router();
}
