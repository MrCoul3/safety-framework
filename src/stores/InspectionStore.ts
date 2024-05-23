import { AppStore } from "./AppStore";
import { makeAutoObservable, toJS } from "mobx";
import { EMPLOYEES, InspectionFormTypes } from "../enums/InspectionFormTypes";
import {
  employeesEndpoint,
  instance,
  localDevInstance,
} from "../api/endpoints";
import { LOCAL_STORE_INSPECTIONS } from "../constants/config";
import moment from "moment/moment";
import { IInspection } from "../interfaces/IInspection";

export interface IFieldsData {
  [key: string]: Item[];
}
export type Item = {
  title: string;
  PersonFio?: string;
};

export interface IFormFieldValue {
  [key: string]: Item | null | string;
}
export interface IFormDateFieldValue {
  [key: string]: [Date?, Date?] | null;
}
export class InspectionStore {
  private store: AppStore;

  constructor(store: AppStore) {
    this.store = store;
    makeAutoObservable(this);
  }
  fieldsData: IFieldsData[] = [];
  isValidate: boolean = false;
  setIsValidate(value: boolean) {
    this.isValidate = value;
  }

  formFieldsValues: IInspection | null = null;

  setFieldsData(value: IFieldsData) {
    this.fieldsData = [...this.fieldsData, value];
    console.log("this.fieldsData", toJS(this.fieldsData));
  }

  setFormFieldsValues(value: IInspection) {
    this.formFieldsValues = value;
    // Object.assign(this.formFieldsValues, value);
    console.debug("formFieldsValues: ", toJS(this.formFieldsValues));
  }
  async getFieldData(type: InspectionFormTypes) {
    let requestType: any = type;

    if (EMPLOYEES.includes(type)) {
      requestType = employeesEndpoint;
    }

    try {
      const response = await instance.get(requestType);
      if (!response.data.error) {
        this.setFieldsData({ [type]: response.data });
      }
    } catch (e) {}
  }

  async getInspectionDev(editInspectionId: string) {
    try {
      const response = await instance.get(`inspections/${editInspectionId}`);
      if (!response.data.error) {
        const result = response.data;
        const inspection = {
          ...result,
          auditDate: moment(result.auditDate).toDate(),
        };
        this.setFormFieldsValues(inspection);
      }
    } catch (e) {}
  }

  async getInspectionById(editInspectionId: string) {
    try {
      const response = await instance.get(
        `Inspections?$filter=(id eq ${editInspectionId})`,
      );
      if (!response.data.error) {
        const result = response.data.value;
        const inspection = {
          ...result,
          auditDate: moment(result.auditDate).toDate(),
        };
        this.setFormFieldsValues(inspection);
      }
    } catch (e) {}
  }

  clearInspectionForm() {
    this.formFieldsValues = null;
  }

  checkIsFormSuccess() {
    if (this.formFieldsValues) {
      return (
        Object.keys(InspectionFormTypes).length ===
          Object.keys(this.formFieldsValues).length &&
        !Object.values(this.formFieldsValues).some((field) => field === null)
      );
    }
    return false;
  }

  setInspectionToLocalStorage() {
    const localInspections = localStorage.getItem(LOCAL_STORE_INSPECTIONS);
    if (localInspections) {
      const localInspectionsParsed = JSON.parse(localInspections);
      if (localInspectionsParsed) {
        localInspectionsParsed.unshift(this.formFieldsValues);
      }
      const newInspectionsJson = JSON.stringify(localInspectionsParsed);
      localStorage.setItem(LOCAL_STORE_INSPECTIONS, newInspectionsJson);
    } else {
      const newInspectionJson = JSON.stringify([this.formFieldsValues]);
      localStorage.setItem(LOCAL_STORE_INSPECTIONS, newInspectionJson);
    }
  }
  updateInspectionToLocalStorage(editInspectionId: string) {
    const index = +editInspectionId - 1;
    const localInspections = localStorage.getItem(LOCAL_STORE_INSPECTIONS);
    if (localInspections) {
      const localInspectionsParsed = JSON.parse(localInspections);
      if (localInspectionsParsed.length) {
        localInspectionsParsed.splice(index, 1);
        localInspectionsParsed.unshift(this.formFieldsValues);
        const newInspectionsJson = JSON.stringify(localInspectionsParsed);
        localStorage.setItem(LOCAL_STORE_INSPECTIONS, newInspectionsJson);
      }
    }
  }

  deleteInspectionFromLocalStorage(editInspectionId: string) {
    const index = +editInspectionId - 1;
    const localInspections = localStorage.getItem(LOCAL_STORE_INSPECTIONS);
    if (localInspections) {
      const localInspectionsParsed = JSON.parse(localInspections);
      if (localInspectionsParsed.length) {
        localInspectionsParsed.splice(index, 1);
        const newInspectionsJson = JSON.stringify(localInspectionsParsed);
        localStorage.setItem(LOCAL_STORE_INSPECTIONS, newInspectionsJson);
      }
    }
  }

  loadInspectionFromLocalStorage(id: string) {
    const localInspections = localStorage.getItem(LOCAL_STORE_INSPECTIONS);
    if (localInspections) {
      const localInspectionsParsed = JSON.parse(localInspections);
      const inspection = {
        ...localInspectionsParsed[+id - 1],
        auditDate: moment(localInspectionsParsed[+id - 1].auditDate).toDate(),
      };
      this.setFormFieldsValues(inspection);
    }
  }

  handleOpenField(type: InspectionFormTypes) {
    const foundField = !!this.fieldsData.find((data) =>
      Object.keys(data).includes(type),
    );
    if (!foundField) {
      this.getFieldData(type);
    }
  }
}
