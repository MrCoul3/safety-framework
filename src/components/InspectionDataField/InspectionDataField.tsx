import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import style from "./style.module.css";
import { InspectionFormTypes } from "../../enums/InspectionFormTypes";
import { useTranslation } from "react-i18next";
import {DatePicker, DatePickerPropOnChange, DatePickerPropValue} from "@consta/uikit/DatePicker";
import { IconCalendar } from "@consta/icons/IconCalendar";
import {IFormDateFieldValue} from "../../stores/InspectionStore";

interface IInspectionDataField {
  inspectionType: InspectionFormTypes;

  handleChange(value: IFormDateFieldValue): void
}

const InspectionDataField = observer((props: IInspectionDataField) => {
  const { t } = useTranslation("dict");

  const [datePickerValue, setDatePickerValue] = useState<[Date?, Date?] | null>(
      null,
  );
  const onChange: DatePickerPropOnChange<"date-range"> = (value) => {
    setDatePickerValue(value);
    props.handleChange({ [props.inspectionType]: value });
  };

  return (
      <DatePicker
          className={style.field}
          label={t(InspectionFormTypes.AuditDate)}
          onChange={onChange}
          required
          type="date"
          rightSide={IconCalendar}
          labelPosition="left"
          value={datePickerValue}
      />
  );
});

export default InspectionDataField;
