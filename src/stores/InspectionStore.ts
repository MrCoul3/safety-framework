import { AppStore } from "./AppStore";
import { makeAutoObservable, toJS } from "mobx";
import { InspectionFormTypes } from "../enums/InspectionFormTypes";
import { instance } from "../api/endpoints";

export interface IFieldsData {
  [key: string]: Item[];
}
export type Item = {
  Title: string;
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

  formFieldsValues: (IFormFieldValue | IFormDateFieldValue)[] = [];

  setFieldsData(value: IFieldsData) {
    this.fieldsData = [...this.fieldsData, value];
  }
  setFormFieldsValues(value: IFormFieldValue | IFormDateFieldValue) {
    const keyCondition = (field: IFormFieldValue | IFormDateFieldValue) =>
      Object.keys(field)[0] === Object.keys(value)[0];
    if (this.formFieldsValues.find((field) => keyCondition(field))) {
      this.formFieldsValues = this.formFieldsValues.filter(
        (field) => !keyCondition(field),
      );
    }
    this.formFieldsValues = [...this.formFieldsValues, value];
    console.debug("formFieldsValues: ", toJS(this.formFieldsValues));
  }

  async getFieldData(type: InspectionFormTypes) {
    try {
      const response = await instance.get(type);
      if (!response.data.error) {
        this.setFieldsData({ [type]: response.data });
      }
    } catch (e) {}
  }

  clearInspectionForm() {
    this.formFieldsValues = [];
  }

  checkIsFormSuccess() {
    // все поля из списка InspectionFormTypes  имеются в formFieldsValues и меют значения;
  }
}
