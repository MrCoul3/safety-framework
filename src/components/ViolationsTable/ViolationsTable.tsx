import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import style from "./style.module.css";
import { SortByProps, Table, TableColumn } from "@consta/uikit/Table";
import { InspectionFormTypes } from "../../enums/InspectionFormTypes";
import { VIOLATIONS_COMMON_FIELDS } from "../../enums/ViolationFilterTypes";
import { IViolation } from "../../interfaces/IViolation";
import { useTranslation } from "react-i18next";
import EmptyBoxPage from "../EmptyBoxPage/EmptyBoxPage";
import { LoaderType } from "../../interfaces/LoaderType";
import LoaderPage from "../LoaderPage/LoaderPage";
import { toJS } from "mobx";
import moment from "moment";
import {
  CellClickType,
  onCellClick,
} from "@consta/uikit/__internal__/src/components/Table/Table";
import { Button } from "@consta/uikit/Button";
import { Modal } from "@consta/uikit/Modal";
import { Card } from "@consta/uikit/Card";
import ViolationDetails from "../VioaltionDetails/ViolationDetails";
import ViolationCheckForm from "../ViolationCheckForm/ViolationCheckForm";
import { useStore } from "../../hooks/useStore";
import { ISendKarkasConfirmed } from "../../interfaces/ISendKarkasConfirmed";
import classNames from "classnames";

interface IViolationsTable {
  violations: IViolation[];
  loader?: LoaderType;
}

interface IRow {
  id: string;
  [InspectionFormTypes.AuditDate]: string | null;
  passport: string | null;
  question: string | null;
  auditor: string | null;
  auditee: string | null;
  [InspectionFormTypes.DoStruct]: string | null;
}

const ViolationsTable = observer((props: IViolationsTable) => {
  const { t } = useTranslation("violationsDict");

  const store = useStore();

  useEffect(() => {
    setViolationId(null);
  }, [props.loader]);

  useEffect(() => {
    console.log("ViolationsTable props.violations", toJS(props.violations));
  }, [props.violations]);

  const [sortSetting, setSortSetting] = useState<SortByProps<any> | null>(null);
  const rows: IRow[] = props.violations
    .map((item, i) => ({
      id: item?.id.toString(),
      [InspectionFormTypes.AuditDate]: moment(item?.auditDate).format(
        "DD.MM.YYYY",
      ),
      passport: item?.passport,
      question: item?.question,
      auditor: item?.auditor,
      auditee: item?.auditee,
      [InspectionFormTypes.DoStruct]: item?.doStruct,
    }))
    .sort((a, b) => {
      if (sortSetting?.sortingBy === InspectionFormTypes.AuditDate) {
        const [firstDate, secondDate] =
          sortSetting.sortOrder === "asc"
            ? [a.auditDate, b.auditDate]
            : [b.auditDate, a.auditDate];
        return moment(firstDate).valueOf() - moment(secondDate).valueOf();
      }
      return 0;
    });

  useEffect(() => {
    console.log("rows!!", rows);
  }, [sortSetting]);

  const columns: TableColumn<typeof rows[number]>[] = VIOLATIONS_COMMON_FIELDS.map((key: any) => ({
    title: <span className={style.colTitle}>{t(key)}</span>,
    accessor: key,
    sortable: true,
    align: "left",
    width: key === "question" ? 350 : 200,
    // maxWidth: 250,
  }));

  const [violationId, setViolationId] = React.useState<number | null>();

  const onRowClick = ({ id, e }: { id: string; e: React.MouseEvent }) => {
    const row = (e.target as HTMLDivElement).closest(".Table-CellsRow");
    setViolationId(+id);
    console.log("onRowClick id", id, typeof id);
    document
      .querySelectorAll(".activeRow")
      .forEach((item) => item.classList.remove("activeRow"));
    row?.childNodes.forEach((child) =>
      (child as HTMLElement).classList.add("activeRow"),
    );
  };
  useEffect(() => {
    console.log("violationId", violationId, typeof violationId);
    if (violationId) {
      const violation = props.violations.find(
        (violation) => +violation.id === +violationId,
      );
      console.log(
        "violation!!!!",
        violation,
        violation?.id,
        typeof violation?.id,
      );
    }
  }, [violationId]);

  const renderLoader = () => {
    if (props.loader === "wait") {
      return <LoaderPage />;
    } else {
      return (
        <EmptyBoxPage
          disableActions
          description={t("violationsEmptyDescription")}
        />
      );
    }
  };

  const handleSaveForm = async (value: ISendKarkasConfirmed) => {
    console.log("handleSaveForm", value);
    const result =
      await store.eliminationOfViolationsStore.sendViolationForm(value);
    if (result) {
      console.log("handleSaveForm result", toJS(result));
      store.snackBarStore.successSnackBar(t("snackBarSuccessEliminated"));
      setViolationId(null);
      store.eliminationOfViolationsStore.getViolations();
    } else {
      store.snackBarStore.alertSnackBar(t("snackBarErrorEliminated"));
    }
  };

  const getSelectedViolation = () => {
    const violation = props.violations.find(
      (item) => +item?.id === violationId,
    );
    console.log("violation", toJS(violation));
    return violation;
  };

  return (
    <div
      className={classNames(style.ViolationsTable, {
        [style.doubleScreen]: violationId,
      })}
    >
      {props.violations.length ? (
        <Table
          onSortBy={setSortSetting}
          className={style.table}
          onRowClick={onRowClick}
          rows={rows}
          isResizable
          stickyHeader
          columns={columns}
        />
      ) : (
        renderLoader()
      )}
      {violationId
        ? props.violations.map((violation) =>
            +violation.id === +violationId ? (
              <div className={style.details}>
                <ViolationDetails violation={getSelectedViolation()} />
                <ViolationCheckForm
                  violationId={violationId}
                  saveForm={handleSaveForm}
                  comment={getSelectedViolation()?.comment ?? ""}
                />
              </div>
            ) : null,
          )
        : null}
    </div>
  );
});

export default ViolationsTable;
