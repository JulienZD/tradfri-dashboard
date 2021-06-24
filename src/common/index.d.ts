import { Group } from 'node-tradfri-client';

export interface ControllableRoom {
  name: string;
  isOn: boolean;
  brightness: number;
  lights: TradfriLightInfo[];
}

export interface TradfriLightInfo {
  id: number;
  name: string;
  isOn: boolean;
  brightness: number;
  color?: string;
  hue?: number;
  saturation?: number;
  colorTemperature?: number;
}

export interface UpdateLightOperation {
  on?: boolean;
  brightness?: number;
  color?: string;
}

export interface TradfriEvents {
  lightUpdate: (light: TradfriLightInfo) => void;
  groupUpdate: (group: Group) => void;
  deviceRemoved: (instanceId: number) => void;
}
