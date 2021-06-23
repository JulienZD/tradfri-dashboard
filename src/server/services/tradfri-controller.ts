import type Tradfri from './Tradfri';
import type { ControllableRoom, UpdateLightOperation, UpdateLightResult, UpdateRoomResult } from '../types';
import type { LightOperation } from 'node-tradfri-client';

function getControllableRooms(client: Tradfri): ControllableRoom[] {
  const groups = client.getGroups();
  return Object.keys(groups)
    .map((key) => client.getGroupInfo(key))
    .slice(1);
}

async function operateLightOrRoom(
  { on, brightness, color }: UpdateLightOperation,
  update: (operation: LightOperation) => Promise<UpdateLightResult | UpdateRoomResult>
): Promise<UpdateLightResult | UpdateRoomResult> {
  const operation: LightOperation = {};
  if (on !== undefined) {
    /*
      Return early to prevent a bug where result.isOn is true when it shouldn't be,
      this happens when both properties `on` and `brightness` are defined
     */
    return await update({ onOff: on });
  }
  if (brightness !== undefined) {
    operation.dimmer = brightness;
    if (brightness <= 0) operation.onOff = false;
  }
  if (color !== undefined) operation.color = color;
  return await update(operation);
}

export { getControllableRooms, operateLightOrRoom };
