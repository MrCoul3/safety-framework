import React, { useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import style from "./style.module.css";
import InspectionTextArea from "../InspectionTextArea/InspectionTextArea";
import { FreeFormFieldTypes } from "../../enums/FreeFormTypes";
import {
  IFormFieldTextValue,
  IFormFieldValue,
} from "../../interfaces/IFieldInterfaces";
import {
  BARRIER_EXTRA_FIELDS_VALUES,
  BarrierFieldTypes,
} from "../../enums/BarrierTypes";
import { PropStatus } from "@consta/uikit/__internal__/src/components/SelectComponents/types";
import { IFilledBarrier } from "../../interfaces/IFilledBarrier";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { useTranslation } from "react-i18next";
import { InspectionFormTypes } from "../../enums/InspectionFormTypes";
import { Button } from "@consta/uikit/Button";
import { Card } from "@consta/uikit/Card";
import MubCards from "../MubCards/MubCards";
import { IBarrier } from "../../interfaces/IBarrier";
import { toJS } from "mobx";
import QuestionCard from "../QuestionCard/QuestionCard";
import { IFulfillment } from "../../interfaces/IFulfillment";
import { IFilledRequirements } from "../../interfaces/IFilledRequirements";
import { IQuestion } from "../../interfaces/IQuestion";
import { FilledQuestionTypes } from "../../enums/FilledQuestionTypes";
import { IFilledQuestions } from "../../interfaces/IFilledQuestions";
import { IInapplicableReasons } from "../../interfaces/IInapplicableReasons";

interface IBarrierForm {
  isValidate: boolean;

  fulfillments: IFulfillment[];

  inapplicableReasons: IInapplicableReasons[];

  passportId?: string;

  formFields?: IFilledBarrier;

  barrier: IBarrier;

  handleChange(value: IFormFieldTextValue): void;

  handleFulfillmentChange(value: IFilledQuestions): void;

  handleClearForm?(): void;

  handleSaveForm?(): void;

  handleDelete?(): void;
}

const BarrierForm = observer((props: IBarrierForm) => {
  const { t } = useTranslation("dict");

  const [savingState, setSavingState] = useState(false);

  const getValue = (type: BarrierFieldTypes): string => {
    if (props.formFields) {
      if (type === BarrierFieldTypes.Mub) {
        return props.formFields[type] as string;
      }
      // return props.formFields[type]?.title as string;
    }
    return "";
  };
  const handleChange = (value: IFormFieldTextValue) => {
    console.log("barrier form handleChange", value);
    props.handleChange(value);
    setSavingState(true);
  };

  const getStatus = (type: BarrierFieldTypes) => {
    /* if (props.formFieldsValues) {
      const condition = props.formFieldsValues[type];
      if (!condition) {
        return "alert";
      }
    }*/
    return "success";
  };

  const questions = useMemo(
    () =>
      props.barrier.requirements
        .map((req) => {
          return req.questions;
        })
        .flat(),
    [props.barrier.requirements],
  );

  const handleSave = () => {
    setSavingState(false);
    props.handleSaveForm?.();
  };

  const [isClearModalOpen, setIsClearModalOpen] = React.useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = React.useState(false);

  const isExtraFieldsCondition = () => {
    // для ДТП и ГРУЗ
    return props.passportId === "7" || props.passportId === "5";
  };

  /* const renderExtraMubFields = () => {
    if (isExtraFieldsCondition()) {
      return BARRIER_EXTRA_FIELDS_VALUES.map((extraField) => (
        <InspectionTextArea
          minRows={1}
          display={true}
          required={true}
          labelPos={"top"}
          className={"none"}
          handleChange={handleChange}
          caption={t("mubCaption")}
          type={extraField}
          value={getValue(extraField)}
          status={
            props.isValidate
              ? (getStatus(BarrierFieldTypes.Mub) as PropStatus)
              : undefined
          }
        />
      ));
    }
  };*/

  const handleFulfillmentChange = (value: IFilledQuestions) => {
    console.log("QuestionCard handleChange", toJS(value));
    props.handleFulfillmentChange(value);
  };

  const filledRequirements = props.formFields?.filledRequirements;

  const getFilledQuestion = (question: IQuestion) => {
    const filledRequirement = filledRequirements?.find(
      (fillReq) => fillReq.requirementId === question.requirementId,
    );
    const filledQuestion = filledRequirement?.filledQuestions.find(
      (fillQuest) => fillQuest[FilledQuestionTypes.QuestionId] === question.id,
    );
    console.log("getFilledQuestion filledQuestion", toJS(filledQuestion));
    return filledQuestion;
  };

  return (
    <div className={style.BarrierForm}>
      {props.formFields && (
        <>
          <div className={style.barrierFormWrap}>
            <InspectionTextArea
              minRows={5}
              display={true}
              required={true}
              labelPos={"top"}
              className={"none"}
              handleChange={handleChange}
              caption={t("mubCaption")}
              type={BarrierFieldTypes.Mub}
              value={getValue(BarrierFieldTypes.Mub)}
              status={
                props.isValidate
                  ? (getStatus(BarrierFieldTypes.Mub) as PropStatus)
                  : undefined
              }
            />
            <MubCards mub={props.barrier.mub} mubHint={props.barrier.mubHint} />
            {questions.map((question) => (
              <QuestionCard
                filledQuestion={getFilledQuestion(question)}
                handleChange={handleFulfillmentChange}
                fulfillments={props.fulfillments}
                inapplicableReasons={props.inapplicableReasons}
                key={question.id}
                title={question.title}
              />
            ))}
          </div>
          <div className={style.buttonsGroup}>
            <Button
              onClick={() => setIsDelModalOpen(true)}
              view="ghost"
              label={t("delete")}
            />
            <div className={style.flexContainer}>
              <Button
                onClick={() => setIsClearModalOpen(true)}
                view="clear"
                label={t("clear")}
              />
              <Button
                disabled={!savingState}
                onClick={handleSave}
                type="submit"
                label={t("save")}
              />
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        cancelActionLabel={t("cancel")}
        confirmActionLabel={t("clear")}
        title={t("dialogClearFields")}
        action={() => props.handleClearForm?.()}
        onClose={() => setIsClearModalOpen(false)}
        open={isClearModalOpen}
      />
      <ConfirmDialog
        cancelActionLabel={t("cancel")}
        confirmActionLabel={t("delete")}
        title={t("dialogDeleteFreeForm")}
        action={() => props.handleDelete?.()}
        onClose={() => setIsDelModalOpen(false)}
        open={isDelModalOpen}
      />
    </div>
  );
});

export default BarrierForm;
