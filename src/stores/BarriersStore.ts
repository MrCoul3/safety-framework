import { AppStore } from "./AppStore";
import { makeAutoObservable, toJS } from "mobx";
import { instance, localDevInstance } from "../api/endpoints";
import { IBarrier } from "../interfaces/IBarrier";
import { IFilledBarrier } from "../interfaces/IFilledBarrier";
import { IFormFieldTextValue } from "../interfaces/IFieldInterfaces";
import {LOCAL_STORE_INSPECTIONS} from "../constants/config";

export class BarriersStore {
  private store: AppStore;

  constructor(store: AppStore) {
    this.store = store;
    makeAutoObservable(this);
  }

  filledBarriers: IFilledBarrier[] = [];
  barriers: IBarrier[] = [];
  async getBarriersDev() {
    try {
      const response = await localDevInstance.get(`barriers`);
      if (!response.data.error) {
        this.setBarriers(response.data);
      }
    } catch (e) {
      console.error(e);
    }
  }
  async getBarriers(passportId: string) {
    try {
      const response = await instance.get(
        `Barriers?$filter=(passportId eq ${passportId})and(IsActual eq true)and(IsPk ne null)&$count=true`,
      );
      if (!response.data.error) {
        if (response.data.value) {
          this.setBarriers(response.data.value);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  getFoundBarriersById(barrierId: number) {
    return this.filledBarriers.filter(
      (barrier) => barrier.barrierId === barrierId,
    );
  }
  filterBarriersFromBarrierId(barrierId: number) {
    this.filledBarriers = this.filledBarriers.filter(
        (barrier) => barrier.barrierId !== barrierId,
    );
  }
  changeFormFieldsValues(value: IFormFieldTextValue, barrierId: number, index: number) {
    const foundBarriersById = this.getFoundBarriersById(barrierId);
    const activeBarrier = foundBarriersById[index]
    const key = Object.keys(value)[0];
    const val = Object.values(value)[0];
    if (activeBarrier) {
      activeBarrier[key] = val
      console.log('changeFormFieldsValues activeBarrier', toJS(activeBarrier))
      console.log('changeFormFieldsValues key', key)
    }
  }

  setBarriers(value: IBarrier[]) {
    this.barriers = value;
    console.debug("barriers: ", toJS(this.barriers));
  }
  setFilledBarriers(value: IFilledBarrier[]) {
    this.filledBarriers = value;
    console.debug("filledBarriers: ", toJS(this.filledBarriers));
  }
  addFilledBarriers(value: IFilledBarrier) {
    this.filledBarriers = [...this.filledBarriers, value];

    console.debug("filledBarriers: ", toJS(this.filledBarriers));
  }

  removeFilledBarriers(barrierId: number) {
    const foundBarriersById = this.getFoundBarriersById(barrierId);

    console.log("foundBarriersById", toJS(foundBarriersById));

    foundBarriersById.splice(foundBarriersById.length - 1, 1);

    console.log("foundBarriersById", toJS(foundBarriersById));

    this.filterBarriersFromBarrierId(barrierId);

    this.filledBarriers = [...this.filledBarriers, ...foundBarriersById];
    console.debug("filledBarriers: ", toJS(this.filledBarriers));
  }

  setIsActiveParamToBarrier(barrierId: number, index: number) {
    const foundBarriersById = this.getFoundBarriersById(barrierId);

    foundBarriersById.forEach((item) => (item.isActive = false));

    foundBarriersById[index].isActive = true;

    this.filterBarriersFromBarrierId(barrierId)

    this.filledBarriers = [...this.filledBarriers, ...foundBarriersById];
    console.debug("filledBarriers: ", toJS(this.filledBarriers));
  }

  updateInspectionToLocalStorage(editInspectionId: string) {
    const index = +editInspectionId - 1;
    const localInspections = localStorage.getItem(LOCAL_STORE_INSPECTIONS);
    if (localInspections) {
      const localInspectionsParsed = JSON.parse(localInspections);
      if (localInspectionsParsed.length) {
        const targetInspection = localInspectionsParsed[index];
        targetInspection.filledBarriers = this.filledBarriers;
        localInspectionsParsed.splice(index, 1);
        localInspectionsParsed.unshift(targetInspection);
        const newInspectionsJson = JSON.stringify(localInspectionsParsed);
        localStorage.setItem(LOCAL_STORE_INSPECTIONS, newInspectionsJson);
      }
    }
  }
}
