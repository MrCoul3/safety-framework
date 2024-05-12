import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import style from "./style.module.css";
import { Table, TableColumn } from "@consta/uikit/Table";
import { IInspection } from "../../interfaces/IInspection";
import { useTranslation } from "react-i18next";
import { Pagination } from "@consta/uikit/Pagination";
import moment from "moment";
import { Button } from "@consta/uikit/Button";
import { IconEdit } from "@consta/icons/IconEdit";
import { IconTrash } from "@consta/icons/IconTrash";
import { IconMail } from "@consta/icons/IconMail";
interface IInspectionsTable {
  inspections: IInspection[];
  handleEditButtonClick(id: string): void;
  handleDeleteSentButtonClick(id: string): void;
  handleDeleteNewInspectionButtonClick(id: string): void;
}

const InspectionsTable = observer((props: IInspectionsTable) => {
  const { t } = useTranslation("dict");

  const [page, setPage] = useState(1);

  const renderActions = (index: string) => (
    <>
      <Button
        onClick={() => props.handleEditButtonClick(index)}
        view="clear"
        form="round"
        iconRight={IconEdit}
        onlyIcon
      />
      <Button
        onClick={() => props.handleDeleteSentButtonClick(index)}
        view="clear"
        form="round"
        iconRight={IconMail}
        onlyIcon
      />
      <Button
        onClick={() => props.handleDeleteNewInspectionButtonClick(index)}
        view="clear"
        form="round"
        iconRight={IconTrash}
        onlyIcon
      />
    </>
  );

  const rows = useMemo(
    () =>
      props.inspections.map((item, index) => ({
        ...item,
        actions: renderActions((index + 1).toString()),
        auditDate: moment(item.auditDate).format("DD.MM.YYYY"),
      })),
    [props.inspections],
  );

  const keys = Object.keys(props.inspections[0]);

  keys.unshift("actions");

  const excludeFields = ["id", "status"];

  const columns: TableColumn<(typeof rows)[number]>[] = keys
    .filter((key) => !excludeFields.includes(key))
    .map((key: any) => ({
      title: <span className={style.colTitle}>{t(key)}</span>,
      accessor: key,
      align: "left",
      sortable: key !== "actions",
      maxWidth: 200,
    }));

  return (
    <div className={style.InspectionsTable}>
      <Table
        isResizable
        zebraStriped="odd"
        className={style.table}
        stickyHeader
        rows={rows}
        columns={columns}
      />
      <Pagination
        className={style.pagination}
        items={5}
        value={page}
        onChange={setPage}
        arrows={[{ label: "Назад" }, { label: "Вперёд" }]}
        hotKeys={[
          {
            label: "← Shift",
            keys: ["Shift", "ArrowLeft"],
          },
          {
            label: "Shift →",
            keys: ["Shift", "ArrowRight"],
          },
        ]}
      />
    </div>
  );
});

export default InspectionsTable;
