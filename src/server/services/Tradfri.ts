import { Accessory, AccessoryTypes, discoverGateway, Group, LightOperation, TradfriClient } from 'node-tradfri-client';
import type { Room } from '../types/Room';
import type { ControllableRoom, TradfriLightInfo } from 'src/common';
import type { UpdateLightResult, UpdateRoomResult } from '../types';
import sleep from '../util/sleep';

type Lightbulbs = { [key: number]: Accessory };
type Groups = { [key: string]: Group };

class Tradfri extends TradfriClient {
  private static instance: Tradfri;
  private lightbulbs: Lightbulbs;
  private _groups: Groups;

  static async getInstance(): Promise<Tradfri> {
    if (this.instance) {
      return this.instance;
    }
    const { host } = await discoverGateway();
    try {
      const tradfri = new Tradfri(host, (msg, severity) => {
        switch (severity) {
          case 'debug':
            // console.log('\x1b[2m%s\x1b[0m', '[DEBUG]', msg);
            break;
        }
      });
      tradfri.lightbulbs = {};
      tradfri._groups = {};

      if (!process.env.IDENTITY || !process.env.PSK) {
        console.log("Couldn't find an identity/psk pair. Generating a new one.");
        const { identity, psk } = await tradfri.authenticate(process.env.SECURITY_CODE);
        console.log(
          `Created identity/psk pair.\nIdentity: ${identity}\nPSK: ${psk}\nIt's recommended that you store these somewhere safe.\n`
        );
        await tradfri.connect(identity, psk);
      } else {
        await tradfri.connect(process.env.IDENTITY, process.env.PSK);
      }

      console.log('Connected to hub');

      // Setup devices update functions
      const tradfri_deviceUpdated = (device: Accessory): void => {
        if (device.type === AccessoryTypes.lightbulb) {
          console.log(`${device.instanceId} updated: ${device.lightList[0].dimmer}`);
          tradfri.lightbulbs[device.instanceId] = device;
        }
      };
      const tradfri_deviceRemoved = (instanceId: number): void => {
        console.log('Removing device ' + instanceId);
        delete tradfri.lightbulbs[instanceId];
      };
      const tradfri_groupUpdated = (group: Group): void => {
        console.log('group ' + group.name + ' updated');
        tradfri._groups[group.name] = group;
      };

      await tradfri
        .on('device updated', tradfri_deviceUpdated)
        .on('device removed', tradfri_deviceRemoved)
        .observeDevices();

      await tradfri.on('group updated', tradfri_groupUpdated).observeGroupsAndScenes();
      this.instance = tradfri;

      setTimeout(() => this.reset(), 60000);
    } catch (e) {
      throw e;
    }

    return this.instance;
  }

  private static reset(): void {
    this.instance.destroy();
    console.log('Destroyed instance');
    this.instance = null;
  }

  public async toggleRoom(room: Room): Promise<{ success: boolean; onOff?: boolean }> {
    const group = this._groups[room];
    if (!group) return { success: false };
    const success = group.onOff ? await group.turnOff() : await group.turnOn();

    return { success: success, onOff: !group.onOff };
  }

  public async updateRoom(room: Room | string, operation: LightOperation): Promise<UpdateRoomResult> {
    const group = this._groups[room];
    if (!group) return { success: false, error: 'This group does not exist' };

    // TODO: operateGroup operates _all_ lights in a group, even the ones that are off. We don't want this behavior
    const sent = await this.operateGroup(group, { ...operation, transitionTime: 0 });
    if (!sent) return { success: false, error: 'Failed to send internal request' };
    // wait for internal group lights info to update, this takes forever with groups
    await sleep(3000);
    return {
      success: true,
      result: this.getGroupInfo(room),
    };
  }

  public async updateLight(lightId: number, operation: LightOperation): Promise<UpdateLightResult> {
    const light = this.lightbulbs[lightId];
    if (!light) return { success: false, error: 'This light does not exist' };
    const sent = await this.operateLight(light, { ...operation, transitionTime: 0 });
    if (!sent) return { success: false, error: 'Failed to send internal request' };
    // wait for internal light info to update
    await sleep(1250);
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

export default Tradfri;
