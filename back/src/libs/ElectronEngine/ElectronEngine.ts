import { app, BrowserWindow, Tray, Menu } from 'electron';
import { Event, MenuItemConstructorOptions } from 'electron/main';
import { IDiceFaceTime } from '../../Models/DiceFaceTime';

export default class ElectronEngine {
	static shared = new ElectronEngine();
	private contextMenuArray: MenuItemConstructorOptions[];
	private isInited: boolean;
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
				label: 'Fermer Timer Dice',
				click: () => {
					process.exit(0);
				},
			},
		];
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

	private createTray() {
		if (!this.tray) return;
		this.tray.setToolTip('Timer Dice');
		this.tray.setContextMenu(Menu.buildFromTemplate(this.contextMenuArray));
	}

	onChange(dice?: IDiceFaceTime) {
		if (!this.isInited || !this.tray) return;
		if (!dice) {
			console.log('Change dice no dice');
			this.contextMenuArray[0].label = 'Aucune activité en cours';
		} else {
			console.log('Change to current dice :', dice);
			this.contextMenuArray[0].label = `En cours : ${dice.face.name}`;
		}
		this.tray.setContextMenu(Menu.buildFromTemplate(this.contextMenuArray));
	}

	init() {
		this.win = new BrowserWindow({
			width: 800,
			height: 600,
			webPreferences: {
				nodeIntegration: true,
			},
		});
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
		this.isInited = true;
	}
}
