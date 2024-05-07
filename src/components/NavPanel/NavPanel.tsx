import React from "react";
import { observer } from "mobx-react-lite";
import style from "./style.module.css";
import { Breadcrumbs } from "@consta/uikit/Breadcrumbs";
import { useNavigate } from "react-router";
import { IconSelect } from "@consta/icons/IconSelect";
import { IBreadCrumbs } from "interfaces/IBreadCrumbs";
import { Button } from "@consta/uikit/Button";
import { useTranslation } from "react-i18next";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";

interface INavPanel {
  title: string;
  description: string;
  actionText: string;

  handleClearInspectionForm(): void;
  formFieldsValuesLength?: boolean;
}

const NavPanel = observer((props: INavPanel) => {
  const { t } = useTranslation("dict");

  const navigate = useNavigate();

  const pagesNoIcon: IBreadCrumbs[] = [
    {
      label: t("mainPage"),
      index: -1,
      href: "#",
    },
    {
      label: t("inspectionData"),
    },
  ];
  const onItemClick = (item: IBreadCrumbs) => {
    if (item.index) {
      navigate(item.index);
    }
  };

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className={style.NavPanel}>
      <div className={style.flexCol}>
        <Breadcrumbs
          getItemLabel={(item: IBreadCrumbs) => item.label}
          onItemClick={onItemClick}
          items={pagesNoIcon}
        />
        <div className={style.title}>{props.title}</div>
        <div className={style.description}>{props.description}</div>
      </div>

      <div className={style.buttonsGroup}>
        <Button label={props.actionText} />
        <Button
          onClick={() => props.formFieldsValuesLength && setIsModalOpen(true)}
          view="ghost"
          label={t("clearAll")}
        />
        <div className={style.rightBorder}></div>
        <Button iconRight={IconSelect} view="clear" label={t("description")} />
      </div>
      <ConfirmDialog
        action={props.handleClearInspectionForm}
        onClose={() => setIsModalOpen(false)}
        open={isModalOpen}
      />
    </div>
  );
});

export default NavPanel;
