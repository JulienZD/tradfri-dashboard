import { ControllableRoom, TradfriLightInfo } from 'src/common';

export interface UpdateLightResult {
  success: boolean;
  result?: TradfriLightInfo;
  error?: string;
}

export interface UpdateRoomResult {
  success: boolean;
  result?: ControllableRoom;
  error?: string;
}
