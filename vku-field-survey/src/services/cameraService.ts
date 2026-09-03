import { Camera } from '@capacitor/camera';

export async function takePhoto() {
  const image = await Camera.takePhoto({
    quality: 80,
  });

  return image.webPath ?? image.uri;
}