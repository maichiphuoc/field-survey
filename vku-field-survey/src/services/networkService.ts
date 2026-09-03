import { Network } from '@capacitor/network';

export async function getNetworkStatus() {
  return await Network.getStatus();
}