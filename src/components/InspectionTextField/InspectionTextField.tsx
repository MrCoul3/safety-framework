import React, { useCallback, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import style from "./style.module.css";
import { InspectionFormTypes } from "../../enums/InspectionFormTypes";
import { Combobox } from "@consta/uikit/Combobox";
import { useFlag } from "@consta/uikit/useFlag";
import {
  IFieldsData,
  IFormDateFieldValue,
  IFormFieldValue,
  Item,
} from "../../stores/InspectionStore";
import { useTranslation } from "react-i18next";
import { PropStatus } from "@consta/uikit/__internal__/src/components/SelectComponents/types";

interface IFieldInspectionType {
  handleOpenField(type: InspectionFormTypes): void;
  handleChange(value: IFormFieldValue | null): void;
  status: PropStatus | undefined;
  fieldsData: IFieldsData[];
  value?: string;
  inspectionType: InspectionFormTypes;
}

const InspectionTextField = observer((props: IFieldInspectionType) => {
  const { t } = useTranslation("dict");

  const [open, setOpen] = useFlag();

  const onDropdownOpen = useCallback((open: boolean) => {
    setOpen.set(open);
  }, []);

  useEffect(() => {
    if (open) {
      props.handleOpenField(props.inspectionType);
    }
  }, [open]);

  const handleChange = (value: Item | null) => {
    props.handleChange( { [props.inspectionType]: value ? value.title : null } );
  };

  const getItems = (type: InspectionFormTypes) => {
    const found = props.fieldsData.find((data) =>
      Object.keys(data).includes(props.inspectionType),
    );
    if (found) {
      return found[type];
    }
    return [];
  };

  const combobox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fieldBody = combobox.current?.parentElement;
    fieldBody?.classList.add("customField");
  }, [combobox]);

  return (
    <Combobox
      ref={combobox}
      status={props.status ?? props.status}
      getItemLabel={(item) => item.title}
      className={style.field}
      dropdownOpen={open}
      labelPosition="left"
      label={t(props.inspectionType)}
      onDropdownOpen={onDropdownOpen}
      placeholder={t(`${props.inspectionType}Placeholder`)}
      required
      value={props.value ? { title: props.value } : null}
      items={getItems(props.inspectionType)}
      onChange={handleChange}
      getItemKey={(item: Item) => item.title}
    />
  );
});

export default InspectionTextField;
