import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import style from "./style.module.css";
import { SubGroupsActionsTypes } from "enums/SubGroupsTypes";
import { useTranslation } from "react-i18next";
import { IconMeatball } from "@consta/icons/IconMeatball";
import { IconAdd } from "@consta/icons/IconAdd";
import { Button } from "@consta/uikit/Button";
import InspectionCard from "../InspectionCard/InspectionCard";
import { IInspection } from "../../interfaces/IInspection";
import classNames from "classnames";
import { LOCAL_STORE_INSPECTIONS } from "../../constants/config";

interface IDashBoard {
  data: IInspection[];
}

interface IInspectionGroupHeader {
  subGroup: SubGroupsActionsTypes;
}

const InspectionGroupHeader = (props: IInspectionGroupHeader) => {
  const { t } = useTranslation("dict");

  return (
    <div className={style.inspectionGroupHeader}>
      {t(props.subGroup)}
      <div className={style.flexRow}>
        <Button view="clear" form="round" iconRight={IconMeatball} onlyIcon />
        {props.subGroup === SubGroupsActionsTypes.NewInspections && (
          <Button size="s" form="round" iconRight={IconAdd} onlyIcon />
        )}
      </div>
    </div>
  );
};

const DashBoard = observer((props: IDashBoard) => {
  const { t } = useTranslation("dict");

  const [localInspections, setLocalInspections] = useState<IInspection[]>([]);

  const subGroups = [
    SubGroupsActionsTypes.NewInspections,
    SubGroupsActionsTypes.Sent,
  ];

  const sentCondition = (subGroup: SubGroupsActionsTypes) =>
    subGroup === SubGroupsActionsTypes.Sent;
  const newInspectionCondition = (subGroup: SubGroupsActionsTypes) =>
    subGroup === SubGroupsActionsTypes.NewInspections;

  const getNewInspections = () => {
    let localInspectionsParsed = [];
    const localInspections = localStorage.getItem(LOCAL_STORE_INSPECTIONS);
    if (localInspections) {
      localInspectionsParsed = JSON.parse(localInspections);
    }
    setLocalInspections(localInspectionsParsed);
    return localInspectionsParsed;
  };

  useEffect(() => {
    getNewInspections();
  }, []);

  useEffect(() => {
    console.log("localInspections", localInspections);
  }, [localInspections]);

  return (
    <div className={style.DashBoard}>
      {subGroups.map((subGroup) => (
        <div
          className={classNames(style.inspectionGroup, {
            [style.newGroup]: newInspectionCondition(subGroup),
            [style.sentGroup]: sentCondition(subGroup),
          })}
        >
          <InspectionGroupHeader subGroup={subGroup} />
          <div
            className={classNames(style.cardContainer, {
              [style.cardContainerForNewGroup]:
                newInspectionCondition(subGroup),
            })}
          >
            {(sentCondition(subGroup) ? props.data : localInspections).map(
              (item, index) => (
                <InspectionCard
                  id={item.id}
                  key={item.id}
                  subGroup={subGroup}
                  status={item.status}
                  oilField={item.oilField}
                  doObject={item.doStructs}
                  checkEditedDate={item.editDate}
                  checkVerifyDate={item.auditDate}
                  inspectionType={item.inspectionType}
                  inspectionForm={item.inspectionForm}
                  index={newInspectionCondition(subGroup) && index + 1}
                />
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

export default DashBoard;
