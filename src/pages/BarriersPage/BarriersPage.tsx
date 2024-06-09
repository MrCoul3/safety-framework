import React, { useEffect, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import NavPanel from "../../components/NavPanel/NavPanel";
import Layout from "../../layouts/Layout/Layout";
import { useStore } from "../../hooks/useStore";
import { useNavigate, useParams } from "react-router";
import { IBreadCrumbs } from "../../interfaces/IBreadCrumbs";
import { useTranslation } from "react-i18next";
import BarriersList from "../../components/BarriersList/BarriersList";
import BarrierElement from "../../components/BarrierElement/BarrierElement";
import { Button } from "@consta/uikit/Button";
import Search from "../../components/Search/Search";
import { CheckEntityTypes } from "../../enums/CheckEntityTypes";
import EmptyBoxPage from "../../components/EmptyBoxPage/EmptyBoxPage";
import CollapseElement from "../../components/CollapseElement/CollapseElement";
import { isDevelop } from "../../constants/config";
import { toJS } from "mobx";
import { IBarrier } from "../../interfaces/IBarrier";
import BarrierForm from "../../components/BarrierForm/BarrierForm";
import BarriersPanel from "../../components/BarriersPanel/BarriersPanel";
import {
  IFormFieldTextValue,
  IFormFieldValue,
} from "../../interfaces/IFieldInterfaces";
import { IFilledBarrier } from "../../interfaces/IFilledBarrier";
import { BarrierFieldTypes } from "../../enums/BarrierTypes";
import { IInspection } from "../../interfaces/IInspection";
import AddBarrierButton from "../../components/AddBarrierButton/AddBarrierButton";
import { IFulfillment } from "../../interfaces/IFulfillment";
import { FilledQuestionTypes } from "../../enums/FilledQuestionTypes";
import { IQuestion } from "../../interfaces/IQuestion";
import { IFilledQuestions } from "../../interfaces/IFilledQuestions";
import { IconWarning } from "@consta/icons/IconWarning";

interface IBarriersPage {}

const BarriersPage = observer((props: IBarriersPage) => {
  const { t } = useTranslation("dict");

  const { editInspectionId } = useParams();

  const { passportId } = useParams();

  const navigate = useNavigate();

  const store = useStore();

  const [savingState, setSavingState] = useState(false);

  const passport = useMemo(
    () =>
      store.passportsStore.passports.find(
        (pass) => pass.id.toString() === passportId,
      ),
    [passportId],
  );

  const loadInspection = () => {
    if (editInspectionId) {
      store.inspectionStore.loadInspection(editInspectionId);
    }
  };

  const getFilledBarriersFromFieldsData = () => {
    const filledBarriers = (
      store.inspectionStore.formFieldsValues as IInspection
    )["filledBarriers"];
    if (filledBarriers) {
      store.barriersStore.setFilledBarriers(filledBarriers);
    }
  };

  const init = async () => {
    if (!Object.keys(store.inspectionStore.formFieldsValues).length) {
      await loadInspection();
    }
    getFilledBarriersFromFieldsData();
    console.log("passportId", passportId);
    if (passportId) {
      console.log("passport", toJS(passport));

      if (isDevelop) {
        store.barriersStore.getBarriersDev();
        store.barriersStore.getFulfillmentsDev();
        store.barriersStore.getBarriers(passportId);
        store.barriersStore.getFulfillments();
        store.barriersStore.getInapplicableReasonsDev();
        store.barriersStore.getInapplicableReasons();
      } else {
        store.barriersStore.getBarriers(passportId);
        store.barriersStore.getFulfillments();
        store.barriersStore.getInapplicableReasons();
      }
    }
    setIsFormsValidForSending(store.barriersStore.checkIsBarrierFormSuccess());
  };

  useEffect(() => {
    init();
  }, []);

  const crumbs: IBreadCrumbs[] = [
    {
      label: t("mainPage"),
      href: "#",
      index: -3,
    },
    {
      label: t("inspectionData"),
      href: "#",
      index: -2,
    },
    {
      label: t("passports"),
      href: "#",
      index: -1,
    },
    {
      label: `${t("completionBarrier")} ${passport?.code ?? ""}`,
    },
  ];

  const saveInspection = () => {
    if (editInspectionId) {
      store.barriersStore.updateInspectionToLocalStorage(editInspectionId);
      store.snackBarStore.setSnackBarItem({
        message: t("snackBarSuccessSave"),
        key: "1",
        status: "success",
      });
    } else {
      store.inspectionStore.setInspectionToLocalStorage();
      store.snackBarStore.setSnackBarItem({
        message: t("snackBarSuccessSaveBarrier"),
        key: "1",
        status: "success",
      });
    }
  };

  const handleSaveInspection = () => {
    saveInspection();
    navigate(-3);
  };

  const handleSaveForm = (barrierId: number, barrierIndex: number) => {
    if (editInspectionId) {
      store.barriersStore.saveFilledBarrierToLocalStorage(
        editInspectionId,
        barrierId,
        barrierIndex,
      );
      store.snackBarStore.setSnackBarItem({
        message: t("snackBarSuccessSave"),
        key: "1",
        status: "success",
      });
    } else {
      handleSaveInspection();
    }
  };

  const [searchText, setSearchText] = useState<string | null>(null);
  const handleSearch = (value: string | null) => {
    setSearchText(value);
  };

  const getFilteredBarriers = () => {
    if (searchText) {
      return store.barriersStore.barriers.filter((item) =>
        item.title?.includes(searchText),
      );
    }
    return [];
  };

  const barriers = () => {
    return searchText ? getFilteredBarriers() : store.barriersStore.barriers;
  };

  const getFilledQuestions = (questions: IQuestion[]) => {
    return questions.map((quest) => ({
      [FilledQuestionTypes.FilledRequirementId]: quest.requirementId,
      [FilledQuestionTypes.QuestionId]: quest.id,
      [FilledQuestionTypes.InapplicableReasonId]: 1,
      [FilledQuestionTypes.FulfillmentId]: 1,
      [FilledQuestionTypes.WorkStopped]: true,
      [FilledQuestionTypes.ResolvedInPlace]: true,
    }));
  };

  const handleAddBarrier = (barrier: IBarrier) => {
    console.log("handleAddBarrier", toJS(barrier));
    setSavingState(true);

    const foundBarriersById = store.barriersStore.getFoundBarriersById(
      barrier.id,
    );

    console.log("handleAddBarrier foundBarriersById", toJS(foundBarriersById));
    const filledRequirements = barrier.requirements.map((req) => ({
      requirementId: req.id,
      filledQuestions: getFilledQuestions(req.questions),
    }));
    console.log(
      "handleAddBarrier filledRequirements",
      toJS(filledRequirements),
    );

    const value: IFilledBarrier = {
      [BarrierFieldTypes.Mub]: "",
      barrierId: barrier.id,
      filledRequirements: filledRequirements,
    };
    store.barriersStore.addFilledBarriers(value);

    // setIsFormsValidForSending(store.barriersStore.checkIsBarrierFormSuccess());
  };

  const [isFormsValidForSending, setIsFormsValidForSending] = useState(false);

  const handleChange = (
    value: IFormFieldTextValue,
    barrierId: number,
    index: number,
  ) => {
    console.log("barrier page handleChange", value, barrierId);
    setSavingState(true);
    store.barriersStore.changeFormFieldsValues(value, barrierId, index);
    const isValid = store.barriersStore.checkIsBarrierFormSuccess();
    setIsFormsValidForSending(isValid);
  };

  const handleFulfillmentChange = (
    value: IFilledQuestions,
    barrierId: number,
    index: number,
  ) => {
    console.log("QuestionCard handleChange", toJS(value));
    // {filledRequirementId,  fulfillmentId, questionId}
    store.barriersStore.updateFilledQuestions(value, barrierId, index);
    setSavingState(true);
  };

  const getFilledBarriersById = (barrierId: number) => {
    return store.barriersStore.filledBarriers?.filter(
      (item) => item?.barrierId === barrierId,
    );
  };

  const handleDeleteBarrier = (barrierId: number, index: number) => {
    store.barriersStore.deleteFilledBarrier(barrierId, index);
    setSavingState(true);
    setIsFormsValidForSending(store.barriersStore.checkIsBarrierFormSuccess());
  };

  const handleClearForm = (barrier: IBarrier, index: number) => {
    const filledRequirements = barrier.requirements.map((req) => ({
      requirementId: req.id,
      filledQuestions: getFilledQuestions(req.questions),
    }));
    const value: IFilledBarrier = {
      [BarrierFieldTypes.Mub]: "",
      barrierId: barrier.id,
      filledRequirements: filledRequirements,
    };
    store.barriersStore.clearFilledBarrier(barrier.id, index, value);
    setSavingState(true);
    setIsFormsValidForSending(store.barriersStore.checkIsBarrierFormSuccess());
  };

  const handleSendInspection = async () => {
    const isValid = store.barriersStore.checkIsBarrierFormSuccess();
    store.inspectionStore.setIsValidate(true);
    console.log("handleSendInspection isValid", isValid);
    if (isValid) {
      const result = await store.inspectionStore.sendInspection();
      if (result) {
        if (editInspectionId)
          store.inspectionStore.deleteInspectionFromLocalStorage(
            +editInspectionId - 1,
          );
        navigate(-2);
        store.snackBarStore.setSnackBarItem({
          message: t("snackBarSuccessSend"),
          key: "1",
          status: "success",
        });
      } else {
        store.snackBarStore.setSnackBarItem({
          message: t("snackBarErrorSend"),
          key: "1",
          status: "alert",
          icon: IconWarning,
        });
      }
    }

  };

  return (
    <Layout
      navPanel={
        <NavPanel
          sendButton={
            <Button
              disabled={!isFormsValidForSending}
              onClick={handleSendInspection}
              label={t("sendInspection")}
            />
          }
          disableSaveButton={!savingState}
          actions={
            <Button
              onClick={() => navigate(-1)}
              label={t("toPassports")}
              view={"secondary"}
            />
          }
          crumbs={crumbs}
          handleSaveInspection={handleSaveInspection}
          title={`${t("completionBarrier")} ${passport?.code ?? ""}`}
          description={t("completionBarrierDescription")}
        />
      }
      content={
        <BarriersList
          search={
            <Search
              handleSearch={handleSearch}
              label={`${t(CheckEntityTypes.Barriers)} ${passport?.code ?? ""}`}
            />
          }
          content={
            barriers().length ? (
              barriers().map((barrier, barrierIndex) => (
                <CollapseElement
                  label={
                    <BarrierElement
                      isValid={store.barriersStore.checkIsFilledBarriersForBarrierIdSuccess(
                        barrier.id,
                      )}
                      barriersLength={getFilledBarriersById(barrier.id)?.length}
                      title={barrier.title}
                    />
                  }
                  key={barrier.id}
                  content={
                    <>
                      <BarriersPanel
                        barrierTitle={barrier.title}
                        filledBarriers={getFilledBarriersById(barrier.id)}
                        renderForm={(index: number) => (
                          <BarrierForm
                            onInit={() =>
                              store.inspectionStore.setIsValidate(false)
                            }
                            handleSaveForm={() =>
                              handleSaveForm(barrier.id, barrierIndex)
                            }
                            handleFulfillmentChange={(value) =>
                              handleFulfillmentChange(value, barrier.id, index)
                            }
                            fulfillments={store.barriersStore.fulfillments}
                            inapplicableReasons={
                              store.barriersStore.inapplicableReasons
                            }
                            passportId={passportId}
                            barrier={barrier}
                            handleClearForm={() =>
                              handleClearForm(barrier, index)
                            }
                            handleDelete={() =>
                              handleDeleteBarrier(barrier.id, index)
                            }
                            formFields={
                              getFilledBarriersById(barrier.id)[index]
                            }
                            handleChange={(value: IFormFieldTextValue) =>
                              handleChange(value, barrier.id, index)
                            }
                            isValidate={store.inspectionStore.isValidate}
                          />
                        )}
                      />
                      <AddBarrierButton
                        onClick={() => handleAddBarrier(barrier)}
                      />
                    </>
                  }
                />
              ))
            ) : (
              <div>
                <EmptyBoxPage disableActions text={t("noBarriers")} />
              </div>
            )
          }
        />
      }
    />
  );
});

export default BarriersPage;
