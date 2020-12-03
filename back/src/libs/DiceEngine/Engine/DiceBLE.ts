import noble from '@abandonware/noble';
import { DiceOnChangePosition } from '../Types/Dice.types';
import logguer from 'basic-log';
import DiceObject from '../DiceObject/DiceObject';

export default class DiceBLE {
	private prvOnDetectDice: DiceOnChangePosition;

	start(detectedName: string) {
		noble.on('stateChange', (state) => {
			if (state === 'poweredOn') {
				noble.startScanning();
			} else {
				noble.stopScanning();
			}
		});
		this.discover(detectedName);
		process.on('exit', async () => {
			noble.stopScanning();
		});
	}

	setOnDetectDice(onDetectDice: DiceOnChangePosition) {
		this.prvOnDetectDice = onDetectDice;
	}

	stop() {
		noble.stopScanning();
	}

	private discover(detectedName: string) {
		noble.on('discover', (peripheral: any) => {
			if (peripheral.advertisement?.localName === detectedName) {
				logguer.d('Peri CubeTimer :', peripheral);
				noble.stopScanning();
				peripheral.connect((err: any) => {
					if (err) logguer.e('Error connecting to timerdice :', err);
				});
				peripheral.once('disconnect', () => {
					logguer.d('Disconnected dice !');
					noble.startScanning();
				});
				peripheral.once('connect', () => {
					peripheral.discoverServices();
					peripheral.once('servicesDiscover', (services: any[]) => {
						const service = services[0];
						service.discoverCharacteristics('beb5483e-36e1-4688-b7f5-ea07361b26a8', (err, characteristics) => {
							const characteristic = characteristics[0];
							if (err) return logguer.e('Discover Characteristic error:', err);
							characteristic.subscribe((err: any) => {
								if (err) logguer.e('Error subscribe to timerdice change :', err);
							});
							characteristic.on('data', async (data: any) => {
								if (!this.prvOnDetectDice) return logguer.d('No onChange setted on DiceBLE');
								try {
									this.prvOnDetectDice(new DiceObject(peripheral.id, Buffer.from(data).toString()));
								} catch (err) {
									logguer.e(`Dice ${peripheral.id} error on data :`, err, Buffer.from(data).toString());
								}
							});
							process.on('exit', async () => {
								characteristic.unsubscribe((err: any) => {
									if (err) logguer.e('Error unsubscribe to timerdice change :', err);
								});
							});
						});
					});
				});
				process.on('exit', async () => {
					peripheral.disconnect((err: any) => {
						if (err) logguer.e('Error disconnecting to timerdice :', err);
					});
				});
			}
		});
	}
}
