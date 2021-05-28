import axios from 'axios';
import type { UpdateLightOperation, TradfriLightInfo } from '../types';

export async function controlLight(lightId: number, operation: UpdateLightOperation): Promise<TradfriLightInfo> {
  try {
    const { data } = await axios.put<TradfriLightInfo>(`/lights/${lightId}`, operation);
    return data;
  } catch (e) {
    // Something went wrong internally, re-obtain the light's status
    return getLight(lightId);
  }
}

async function getLight(lightId: number): Promise<TradfriLightInfo> {
  try {
    const { data } = await axios.get(`/lights/${lightId}`);
    return data;
  } catch (e) {
    return undefined;
  }
}
