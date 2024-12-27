import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})

export class GestionStorageService {
  constructor() {}

  // Almacena un objeto con formato JSON en local.
  // Por cada objeto, se necesita una clave (key) y el valor del objeto (value)
  async setObject(key: string, value: any) {
  await Preferences.set({ key, value: JSON.stringify(value) });
  }

  // A partir de su clave obtiene un objeto almacenado en local
  // Antes de devolverlo, debe ser convertido de formato JSON a formato normal
  async getObject(key: string) {
  const ret: any = await Preferences.get({ key });
  return JSON.parse(ret.value);
  }

}