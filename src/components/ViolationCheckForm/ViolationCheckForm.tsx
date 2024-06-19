import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import style from "./style.module.css";
import { Card } from "@consta/uikit/Card";
import { useTranslation } from "react-i18next";
import { FilledQuestionTypes } from "../../enums/FilledQuestionTypes";
import { TextField } from "@consta/uikit/TextField";
import { Button } from "@consta/uikit/Button";
import { Text } from "@consta/uikit/Text";
import { IconAttach } from "@consta/icons/IconAttach";
import { IconRevert } from "@consta/icons/IconRevert";
import { IconAlert } from "@consta/icons/IconAlert";
import { IconAdd } from "@consta/icons/IconAdd";
import { IconPhoto } from "@consta/icons/IconPhoto";
import {
  DragNDropFieldInformer,
  DragNDropFieldInformerPropStatus,
  getErrorsList,
} from "@consta/uikit/DragNDropFieldCanary";
import { DragNDropField, FileRejection } from "@consta/uikit/DragNDropField";
import { ISendKarkasConfirmed } from "../../interfaces/ISendKarkasConfirmed";

interface IViolationCheckForm {
   saveForm(value: ISendKarkasConfirmed): void;
  violationId: number;
  comment: string;
}

const ViolationCheckForm = observer((props: IViolationCheckForm) => {
  const { t } = useTranslation("dict");
  const [filesDropped, setFilesDropped] = useState<File | null>();
  const [filesSize, setFilesSize] = useState<number>(0);
  const [commentValue, setCommentValue] = useState<string | null>(props.comment);


  const clearForm = () => {
    setCommentValue(null);
    setFilesDropped(null)
    setFilesSize(0)
  };
  const handleChange = (value: string | null) => {
    console.log("QuestionCard handleChange value", value);
    setCommentValue(value);
  };
  const saveForm = () => {
    if (filesDropped) {
      const result: ISendKarkasConfirmed = {
        id: props.violationId.toString(),
        comment: commentValue ?? "",
        uploadFile: filesDropped,
      };
      props.saveForm(result);
    }
  };

  const handleDrop = (acceptedFiles: File[]) => {
    const files = acceptedFiles;
    setFilesDropped(files[0]);
    const size =
        files[0].size /
      (1024 * 1024);
    setFilesSize(+size.toFixed(2));
  };

  let status: DragNDropFieldInformerPropStatus = "default";

  let text: string;

  switch (status) {
    case "default":
      text = `Файлов загружено: ${filesDropped ? 1 : 0} (${filesSize}Мб)`;
      break;
  }

  const isDisabledSave = () => {
    return commentValue && filesDropped;
  };
  return (
    <div className={style.ViolationCheckForm}>
      <Card className={style.card}>
        <div className={style.title}>{t("checkForm")}</div>
        <TextField
          required
          minRows={3}
          cols={200}
          onChange={handleChange}
          value={commentValue}
          label={t(FilledQuestionTypes.Comment)}
          type="textarea"
          placeholder={t(FilledQuestionTypes.Comment)}
        />
        <div className={style.DragNDropField}>
          <div className={style.label}>
            {t("app")}
            <span style={{ color: "red" }}> *</span>
          </div>
          <DragNDropField
            className={style.DragNDropField}
            maxSize={20 * 1024 * 1024}
            onDropFiles={handleDrop}
          >
            {({ openFileDialog }) => (
              <>
                <div className={style.flexCol}>
                  <Text className={style.fileFormTitle}>
                    {t("fileFormTitle")}
                  </Text>
                  <Text className={style.fileFormDescription} size={"s"}>
                    {t("maxFileSizeDescription")}
                  </Text>
                </div>
                <Button
                  view={"ghost"}
                  iconLeft={IconAttach}
                  onClick={openFileDialog}
                  label={t("uploadFile")}
                />
                <Text className={style.fileFormDescription} size={"s"}>
                  {text}
                </Text>
              </>
            )}
          </DragNDropField>
        </div>
        <div className={style.controlButtonGroup}>
          <Button
            onClick={clearForm}
            iconSize="s"
            view="ghost"
            label={t("clear")}
          />
          <Button
            disabled={!isDisabledSave()}
            onClick={saveForm}
            className={style.editButton}
            label={t("save")}
          />
        </div>
      </Card>
    </div>
  );
});

export default ViolationCheckForm;
