import { LiveData } from './live-data';

export class LiveDataManager {
  private live_datas: Map<string, LiveData<any>> = new Map();

  constructor() {}

  public adopt(live_data: LiveData<any>) {
    this.live_datas.set(live_data.uuid, live_data);
  }

  public giveBirth<T>() {
    const live_data = new LiveData();
    this.live_datas.set(live_data.uuid, live_data);
    return { uuid: live_data.uuid, live_data };
  }

  public pushSingleData(data: any, uuid: string) {
    const live_data = this.live_datas.get(uuid);
    if (live_data) {
      if (live_data.is_alive()) {
        live_data.push(data, uuid);
        return true;
      } else {
        // remove the live data from the map
        this.live_datas.delete(uuid);
        return false;
      }
    } else {
      return false;
    }
  }

  public pushSingleError(err: Error, uuid: string) {
    const live_data_found = this.live_datas.get(uuid);
    if (live_data_found) {
      if (live_data_found.is_alive()) {
        live_data_found.pushError(err, uuid);
        return true;
      } else {
        this.live_datas.delete(uuid);
        return false;
      }
    } else {
      return false;
    }
  }

  public isSingleAlive(uuid: string) {
    const live_data = this.live_datas.get(uuid);
    if (live_data) {
      if (live_data.is_alive()) {
        return true;
      } else {
        this.live_datas.delete(uuid);
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Check the live satus of multiple live data
   * Accept the array of uuid
   */
  public areAlive(uuids: string[]) {
    return uuids.map((uuid) => {
      return { uuid: uuid, is_alive: this.isSingleAlive(uuid) };
    });
  }

  /**
   * Push data to multiple liveData
   * @param data :{ uuid: string; data: any }[]
   * is push is success then return the success live data
   *
   */
  public pushData(data: { uuid: string; data: any }[]) {
    const pushed_live_data: string[] = [];

    data.forEach((val) => {
      const result = this.pushSingleData(val.data, val.uuid);
      if (result) {
        pushed_live_data.push(val.uuid);
      }
    });
    return pushed_live_data;
  }

  public pushError(data: { uuid: string; err: Error }[]) {
    const pushed_live_data: String[] = [];

    data.forEach((err) => {
      const result = this.pushSingleError(err.err, err.uuid);
      if (result) {
        pushed_live_data.push(err.uuid);
      }
    });

    return pushed_live_data;
  }
}
