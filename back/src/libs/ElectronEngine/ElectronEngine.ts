import { app, BrowserWindow, Tray, Menu } from 'electron';
import { Event, MenuItemConstructorOptions } from 'electron/main';
import logguer from 'basic-log';
import DiceFaceTime, { IDiceFaceTime } from '../../Models/DiceFaceTime';
import fs from 'fs';
import Path from 'path';
import DiceFace from '../../Models/DiceFace';
import DiceEngine from '../DiceEngine/Engine/DiceEngine';

export default class ElectronEngine {
	static shared = new ElectronEngine();
	private contextMenuArray: MenuItemConstructorOptions[];
	private isInited: boolean;
	private onStopDice?: () => void;
	private onCloseAction: () => void;
	private isStopAlreadyExist = false;
	win?: BrowserWindow;
	tray?: Tray;

	constructor() {
		this.contextMenuArray = [
			{
				label: 'Aucune activité en cours',
				type: 'normal',
				enabled: false,
			},
			{
				type: 'separator',
			},
			{
				label: 'Voir le dashboard',
				click: () => {
					this.win.show();
					app.dock.show();
				},
			},
			{
				type: 'separator',
			},
			{
				label: 'Chargement en cours...',
				type: 'normal',
				enabled: false,
			},
			{
				type: 'separator',
			},
			{
				label: 'Fermer Timer Dice',
				click: () => {
					if (this.onCloseAction) {
						this.onCloseAction();
					}
					process.exit(0);
				},
			},
		];
	}

	setOnStopDice(callback: () => void) {
		this.onStopDice = callback;
	}

	async reloadFacesSubmenu(hasDice: boolean) {
		const faces = await DiceFace.getAll();
		let currentFaceId = -1;
		if (hasDice) {
			try {
				const currentTracking = await DiceFaceTime.getCurrent();
				currentFaceId = currentTracking.faceId;
			} catch (err) {
				logguer.e('Error on reload submenu:', err);
			}
		}
		const index = this.contextMenuArray.findIndex(
			(element) => element.label === 'Chargement en cours...' || element.label === 'Démarrer une activité'
		);
		if (index === -1) return logguer.e('Unable to find index for context menu');
		this.contextMenuArray[index].label = 'Démarrer une activité';
		this.contextMenuArray[index].type = 'submenu';
		this.contextMenuArray[index].submenu = faces.map((face) => {
			return {
				label: face.name,
				click: async () => {
					await DiceEngine.shared.stopTracking();
					await DiceEngine.shared.startTracking(face.faceId);
				},
				enabled: currentFaceId !== face.faceId,
			};
		});
		this.contextMenuArray[index].enabled = true;
		this.tray?.setContextMenu(Menu.buildFromTemplate(this.contextMenuArray));
	}

	private createWindow() {
		if (!this.win) return;
		this.win.loadURL(process.env.FRONT_URI || 'http://localhost:9999');
		this.win.on('close', (ev) => {
			ev.preventDefault();
			app.dock.hide();
			this.win.hide();
		});
	}

	static get dbPath(): string {
		let pathDB;
		if (process.env.NODE_ENV === 'development') {
			pathDB = `${__dirname}/../../../mongodb/db`;
		} else {
			const appDataPath = app.getPath('appData');
			pathDB = Path.resolve(appDataPath, './TimerDiceDB');
			if (!fs.existsSync(pathDB)) fs.mkdirSync(pathDB);
		}
		logguer.i('Launching mongd with dbpath :', pathDB);
		return pathDB;
	}

	private createTray() {
		if (!this.tray) return;
		this.tray.setToolTip('Timer Dice');
		this.tray.setContextMenu(Menu.buildFromTemplate(this.contextMenuArray));
	}

	async onChange(dice?: IDiceFaceTime) {
		if (!this.isInited || !this.tray) return;
		await this.reloadFacesSubmenu(!!dice);
		const labelStop = "Stopper l'activité";
		if (!dice) {
			this.contextMenuArray[0].label = 'Aucune activité en cours';
			const stopIndex = this.contextMenuArray.findIndex((e) => e.label === labelStop);
			if (stopIndex !== -1) {
				this.contextMenuArray.splice(stopIndex, 1);
				this.isStopAlreadyExist = false;
			}
		} else {
			this.contextMenuArray[0].label = `En cours : ${dice.face.name}`;
			if (this.onStopDice && !this.isStopAlreadyExist) {
				this.isStopAlreadyExist = true;
				this.contextMenuArray.splice(1, 0, {
					label: labelStop,
					click: this.onStopDice,
				});
			}
		}
		this.tray.setContextMenu(Menu.buildFromTemplate(this.contextMenuArray));
	}

	onClose(onCloseAction: () => void) {
		this.onCloseAction = onCloseAction;
	}

	async init() {
		this.win = new BrowserWindow({
			width: 800,
			height: 600,
			webPreferences: {
				nodeIntegration: true,
			},
		});
		this.win.maximize();
		this.tray = new Tray(`${__dirname}/../../../assets/logo-white@2x.png`);

		app.whenReady().then(() => {
			this.createTray();
			this.createWindow();
		});

		app.on('window-all-closed', (ev: Event) => {
			ev.preventDefault();
			if (process.platform !== 'darwin') {
				app.quit();
				process.exit(0);
			}
		});

		app.on('activate', () => {
			if (BrowserWindow.getAllWindows().length === 0) {
				this.createWindow();
				this.createTray();
			}
		});
		await this.reloadFacesSubmenu();
		this.isInited = true;
	}
}
