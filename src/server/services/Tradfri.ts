import { EventEmitter } from 'events';
import { Accessory, AccessoryTypes, discoverGateway, Group, LightOperation, TradfriClient } from 'node-tradfri-client';
import type { Room } from '../types/Room';
import type { ControllableRoom, TradfriEvents, TradfriLightInfo } from 'src/common';
import type { UpdateLightResult, UpdateRoomResult } from '../types';
import sleep from '../util/sleep';

type Lightbulbs = { [key: number]: Accessory };
type Groups = { [key: string]: Group };

declare interface Tradfri {
  on<K extends keyof TradfriEvents>(event: K, listener: TradfriEvents[K]): this;
  emit<K extends keyof TradfriEvents>(event: K, ...args: Parameters<TradfriEvents[K]>): boolean;
}

class Tradfri extends EventEmitter {
  private tradfriClient: TradfriClient;
  private lightbulbs: Lightbulbs;
  private _groups: Groups;

  constructor() {
    super();
    this.lightbulbs = {};
    this._groups = {};

    (async (): Promise<void> => {
      await this.setup();
    })();
  }

  private async setup(): Promise<void> {
    this.tradfriClient = await this.establishConnection();

    // Setup devices update functions
    const tradfri_deviceUpdated = (device: Accessory): void => {
      if (device.type === AccessoryTypes.lightbulb) {
        console.log(
          `${device.instanceId} updated: brightness=${device.lightList[0].dimmer} --- onOff=${device.lightList[0].onOff}`
        );
        this.lightbulbs[device.instanceId] = device;
        this.emit('lightUpdate', this.getLightInfo(device.instanceId));
      }
    };
    const tradfri_deviceRemoved = (instanceId: number): void => {
      console.log('Removing device ' + instanceId);
      delete this.lightbulbs[instanceId];
      this.emit('deviceRemoved', instanceId);
    };
    const tradfri_groupUpdated = (group: Group): void => {
      console.log('group ' + group.name + ' updated');
      this._groups[group.name] = group;
      this.emit('groupUpdate', group);
    };

    await this.tradfriClient
      .on('device updated', tradfri_deviceUpdated)
      .on('device removed', tradfri_deviceRemoved)
      .observeDevices();

    await this.tradfriClient.on('group updated', tradfri_groupUpdated).observeGroupsAndScenes();

    setTimeout(() => this.reset(), 60000);
  }

  private async establishConnection(): Promise<TradfriClient> {
    try {
      const { host } = await discoverGateway();
      const client = new TradfriClient(host, {
        // customLogger: (msg, severity): void => {
        //   switch (severity) {
        //     case 'error':
        //       console.error('[ERROR]', msg);
        //       break;
        //     case 'warn':
        //       console.warn('[WARN]', msg);
        //       break;
        //     case 'debug':
        //       console.debug('[DEBUG]', msg);
        //       break;
        //     case 'info':
        //       console.info('[INFO]', msg);
        //       break;
        //   }
        // },
      });

      if (!process.env.IDENTITY || !process.env.PSK) {
        console.log("Couldn't find an identity/psk pair. Generating a new one.");
        const { identity, psk } = await client.authenticate(process.env.SECURITY_CODE);
        console.log(
          `Created identity/psk pair.\nIdentity: ${identity}\nPSK: ${psk}\nIt's recommended that you store these somewhere safe.\n`
        );
        await client.connect(identity, psk);
      } else {
        await client.connect(process.env.IDENTITY, process.env.PSK);
      }

      console.log('Connected to hub');
      return client;
    } catch (e) {
      throw e;
    }
  }

  private reset(): void {
    this.tradfriClient.destroy();
    console.log('Destroyed instance');
    this.tradfriClient = null;
  }

  private async ensureConnection(): Promise<void> {
    if (this.tradfriClient === null) await this.setup();
  }

  public async toggleRoom(room: Room): Promise<{ success: boolean; onOff?: boolean }> {
    await this.ensureConnection();
    const group = this._groups[room];
    if (!group) return { success: false };
    const success = group.onOff ? await group.turnOff() : await group.turnOn();

    return { success: success, onOff: !group.onOff };
  }

  public async updateRoom(room: Room | string, operation: LightOperation): Promise<UpdateRoomResult> {
    await this.ensureConnection();
    const group = this._groups[room];
    if (!group) return { success: false, error: 'This group does not exist' };

    // TODO: operateGroup operates _all_ lights in a group, even the ones that are off. We don't want this behavior
    const sent = await this.tradfriClient.operateGroup(group, { ...operation, transitionTime: 0 });
    if (!sent) return { success: false, error: 'Failed to send internal request' };
    // wait for internal group lights info to update, this takes forever with groups
    await sleep(3000);
    return {
      success: true,
      result: this.getGroupInfo(room),
    };
  }

  public async updateLight(lightId: number, operation: LightOperation): Promise<UpdateLightResult> {
    await this.ensureConnection();
    const light = this.lightbulbs[lightId];
    if (!light) return { success: false, error: 'This light does not exist' };
    const sent = await this.tradfriClient.operateLight(light, { ...operation, transitionTime: 0 });
    if (!sent) return { success: false, error: 'Failed to send internal request' };

    return { success: true, result: this.getLightInfo(lightId) };
  }

  public getGroups(): Groups {
    return this._groups;
  }

  public getLightInfo(id: number): TradfriLightInfo {
    if (!(id in this.lightbulbs)) return;
    const { name, instanceId, lightList } = this.lightbulbs[id];

    const { onOff: isOn, dimmer: brightness, color, hue, saturation, colorTemperature } = lightList[0];

    return {
      name: name,
      id: instanceId,
      isOn: isOn,
      brightness: brightness,
      color: color,
      hue: hue,
      saturation: saturation,
      colorTemperature: colorTemperature,
    };
  }

  public getGroupInfo(groupId: string): ControllableRoom {
    const group = this._groups[groupId];
    if (!group) return;
    return {
      name: group.name,
      isOn: group.onOff,
      brightness: group.dimmer,
      lights: group.deviceIDs.map((id: number) => this.getLightInfo(id)).filter((e: TradfriLightInfo) => e),
    };
  }
}

export const tradfri = new Tradfri();
