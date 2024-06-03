import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import style from "./style.module.css";
import { InspectionFormTypes } from "../../enums/InspectionFormTypes";
import { useTranslation } from "react-i18next";
import { DatePicker, DatePickerPropOnChange } from "@consta/uikit/DatePicker";
import { IconCalendar } from "@consta/icons/IconCalendar";
import { PropStatus } from "@consta/uikit/__internal__/src/components/SelectComponents/types";
import {IFormDateFieldValue} from "../../interfaces/IFieldInterfaces";

interface IInspectionDataField {
  inspectionType: InspectionFormTypes;
  disableLabel?: boolean;

  status?: PropStatus | undefined;
  value?: Date | null;
  handleChange(value: IFormDateFieldValue): void;
}

const InspectionDataField = observer((props: IInspectionDataField) => {
  const { t } = useTranslation("dict");

  /*  const onChange = (value) => {
    props.handleChange({ [props.inspectionType]: value });
  };*/

  const picker = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fieldBody = picker.current?.parentElement;
    fieldBody?.classList.add("customField");
  }, [picker]);

  useEffect(() => {
    setVal(props.value ?? null);

    console.log('props.value', props.value)
  }, [props.value]);

  const [val, setVal] = useState<Date | null>(null);

  return (
    <DatePicker
      type={"date"}
      ref={picker}
      status={props.status}
      className={style.field}
      label={!props.disableLabel ? t(props.inspectionType) : ""}
      onChange={(value) =>
        props.handleChange({ [props.inspectionType]: value })
      }
      required
      rightSide={IconCalendar}
      labelPosition="left"
      value={val}
    />
  );
});

export default InspectionDataField;
