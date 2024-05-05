import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import style from "./style.module.css";
import { SubGroupsTypes } from "enums/SubGroupsTypes";
import { Button } from "@consta/uikit/Button";
import { IconAdd } from "@consta/icons/IconAdd";
import { useTranslation } from "react-i18next";
import { Combobox } from "@consta/uikit/Combobox";

interface ISubHeader {
  handleAddInspection(): void;
}

type Item = {
  label: string;
  id: string | number;
  groupId?: string | number;
};

const SubHeader = observer((props: ISubHeader) => {
  const { t } = useTranslation("dict");

  const [value, setValue] = useState<Item[] | null>();

  const items: Item[] = [
    {
      label: "Барьеры",
      groupId: 1,
      id: 1,
    },
    {
      label: "Свободные формы",
      groupId: 1,
      id: 2,
    },
  ];

  return (
    <div className={style.SubHeader}>
      <span className={style.title}>{t(SubGroupsTypes.Inspections)}</span>
      <div className={style.flexRow}>
        <Button
          onClick={props.handleAddInspection}
          className={style.button}
          label={t("addInspection")}
          iconLeft={IconAdd}
        />
        <Combobox
          className={style.combobox}
          placeholder="Выберите вариант"
          items={items}
          value={value}
          onChange={setValue}
          multiple
        />
      </div>
    </div>
  );
});

export default SubHeader;
