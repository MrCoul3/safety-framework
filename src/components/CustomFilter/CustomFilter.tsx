import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import style from "./style.module.css";
import { Combobox } from "@consta/uikit/Combobox";
import InspectionDataField from "../InspectionDataField/InspectionDataField";
import { InspectionFormTypes } from "../../enums/InspectionFormTypes";
import { DatePicker } from "@consta/uikit/DatePicker";
import { IconCalendar } from "@consta/icons/IconCalendar";

interface ICustomFilter {
  type: InspectionFormTypes;

  onConfirm: (value: unknown) => void;
  onCancel: () => void;
  filterValue?: unknown;
}
type Item = {
  label: string;
  id: number;
};

const items: Item[] = [
  {
    label: "Первый",
    id: 1,
  },
  {
    label: "Второй",
    id: 2,
  },
  {
    label: "Третий",
    id: 3,
  },
];

const CustomFilter = observer((props: ICustomFilter) => {
  useEffect(() => {
    console.log("CustomFilter", props);
  }, []);

  const onChange = () => {};
  const [value, setValue] = useState<[Date?, Date?] | null>(null);

  useEffect(() => {
    console.log("value", value);
    // props.onConfirm(value)
  }, [value]);

  return (
    <div className={style.CustomFilter}>
      {props.type === InspectionFormTypes.AuditDate ? (
        <DatePicker
          type="date-range"
          className={style.field}
          onChange={setValue}
          rightSide={IconCalendar}
          value={value}
        />
      ) : (
        <Combobox
          className={style.combobox}
          items={items}
          onChange={onChange}
        />
      )}
    </div>
  );
});

export default CustomFilter;
