import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import SideBar from "components/SideBar/SideBar";
import MainPageLayout from "layouts/MainPageLayout/MainPageLayout";
import SubHeader from "components/SubHeader/SubHeader";
import { useStore } from "hooks/useStore";
import { IAction } from "interfaces/IAction";
import { SubGroupsActionsTypes } from "enums/SubGroupsTypes";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import DashBoard from "../components/DashBoard/DashBoard";
import InspectionsTable from "../components/InspectionsTable/InspectionsTable";
import { Button } from "@consta/uikit/Button";
import { useTranslation } from "react-i18next";
import { RoutesTypes } from "../enums/RoutesTypes";
import {
  INSPECTIONS_ON_PAGE,
  isDevelop,
  LOCAL_STORE_INSPECTIONS,
} from "../constants/config";
import { ResponsesNothingFound } from "@consta/uikit/ResponsesNothingFound";
import ConfirmDialog from "../components/ConfirmDialog/ConfirmDialog";
import { InspectionFormTypes } from "../enums/InspectionFormTypes";
import EmptyBoxPage from "../components/EmptyBoxPage/EmptyBoxPage";
import SnackBarCustom from "../components/SnackBarCustom/SnackBarCustom";
import LoaderPage from "../components/LoaderPage/LoaderPage";
import { toJS } from "mobx";
import {
  IFilterDateRangeFieldValue,
  IFilterFieldValue,
  IFormDateFieldValue,
} from "../interfaces/IFieldInterfaces";
import { SortByProps } from "@consta/uikit/Table";
import InspectionCard from "../components/InspectionCard/InspectionCard";

interface IMainPage {}

export const MainPage = observer((props: IMainPage) => {
  const store = useStore();

  const { t } = useTranslation("dict");

  const navigate = useNavigate();

  const location = useLocation();

  const init = () => {
    store.mainPageStore.clearInspectionOffset();
    store.freeFormStore.clearFreeForms();
    getLocalInspections();
    if (isDevelop) {
      store.mainPageStore.getInspectionsDev();
    } else {
      store.mainPageStore.getInspections();
    }
  };

  useEffect(() => {
    init();
  }, []);

  const onItemClick = (item: IAction) => {
    store.mainPageStore.updateSubGroupsState(
      item.label as SubGroupsActionsTypes,
    );
    if (item.label === SubGroupsActionsTypes.MainList) {
      navigate(`/`);
      return;
    }
    navigate(`/${item.label}`);
  };

  const getLocalInspections = () => {
    let localInspectionsParsed = [];
    const localInspections = localStorage.getItem(LOCAL_STORE_INSPECTIONS);
    if (localInspections) {
      localInspectionsParsed = JSON.parse(localInspections);
    }
    store.mainPageStore.setLocalInspections(localInspectionsParsed);
  };
  const handleEditInspection = (id: string) => {
    store.inspectionStore.clearInspectionForm();
    navigate(RoutesTypes.EditInspection + "/" + id);
  };
  const handleEditLocalInspection = (id: string) => {
    store.inspectionStore.clearInspectionForm();
    navigate(RoutesTypes.EditLocalInspection + "/" + id);
  };
  const handleDeleteNewInspection = () => {
    if (store.mainPageStore.deletingInspectionType) {
      store.inspectionStore.deleteInspectionFromLocalStorage(
        store.mainPageStore.deletingInspectionType?.id,
      );
      getLocalInspections();
    }
  };
  const handleDeleteSentInspection = async () => {
    if (isDevelop) {
      store.mainPageStore.getInspectionsDev();
    } else {
      await store.mainPageStore.deleteSentInspection(
        store.mainPageStore.deletingInspectionType?.id,
      );
      store.mainPageStore.clearInspections();
      store.mainPageStore.getInspections();
    }
  };

  const handleAddInspection = () => {
    navigate(RoutesTypes.NewInspection);
    store.inspectionStore.clearInspectionForm();
  };
  const handleDelete = (id: string, type: SubGroupsActionsTypes) => {
    store.mainPageStore.setDeletingInspectionType({
      type: type,
      id: id,
    });
    setIsModalOpen(true);
  };

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOpenFilter = (type: InspectionFormTypes) => {
    store.inspectionStore.handleOpenField(type);
    setOpenFilterType(type);
  };

  const handlePaginationChange = (pageNumber: number) => {
    const offset = (pageNumber - 1) * INSPECTIONS_ON_PAGE;
    store.mainPageStore.setInspectionOffset(offset);
    store.mainPageStore.getInspections();
  };
  const onScrollToBottom = () => {
    store.mainPageStore.increaseInspectionOffset();
    store.mainPageStore.getInspectionsByScrollToBottomOnDashboard();
  };

  const handleFilterChange = (
    value: IFilterFieldValue | IFilterDateRangeFieldValue,
  ) => {
    console.log("table handleChange", toJS(value));
    store.mainPageStore.updateFormFieldsValues(value);
    store.mainPageStore.getInspections();
  };

  const [openFilterType, setOpenFilterType] =
    useState<InspectionFormTypes | null>(null);

  const handleScrollFieldToBottom = (inspectionType: InspectionFormTypes) => {
    console.log("handleScrollFieldToBottom!!!");
    store.inspectionStore.increaseOffset();
    store.inspectionStore.getFieldData(inspectionType);
  };

  const handleSearchValueChange = (value: string | null) => {
    console.log("handleSearchValueChange value!!!", value);
    store.inspectionStore.setSearchFieldValue(value);
    if (!value || value === "") {
      store.inspectionStore.clearOffset();
    }
    if ((value || value === "") && openFilterType) {
      store.inspectionStore.getFieldData(openFilterType);
    }
  };
  const handleInspectionTextFieldClose = () => {
    setOpenFilterType(null);
    store.inspectionStore.clearOffset();
    store.inspectionStore.clearFieldsData();
  };

  const handleSort = (value: SortByProps<any> | null) => {
    store.mainPageStore.setSortSetting(value);
    store.mainPageStore.getInspections();
  };

  const handleSendInspection = (index: number) => {
    const isValid = store.mainPageStore.checkIsInspectionReadyToSend(index - 1);
    if (isValid) {
    }
    console.log("isValid", isValid);
  };
  const sentInspectionsCondition = (subGroup: SubGroupsActionsTypes) =>
      subGroup === SubGroupsActionsTypes.Sent;
  const newInspectionCondition = (subGroup: SubGroupsActionsTypes) =>
      subGroup === SubGroupsActionsTypes.NewInspections;

  const handleDeleteInspection = (
      subGroup: SubGroupsActionsTypes,
      id: string,
  ) => {
    if (sentInspectionsCondition(subGroup)) {
      props.handleDeleteSentButtonClick(id);
    }
    if (newInspectionCondition(subGroup)) {
      props.handleDeleteNewInspectionButtonClick(id);
    }
  };

  const contentRoutes = () => {
    return (
      <Routes>
        {/*Main page dashboard*/}
        <Route
          element={
            <DashBoard
              content={store.mainPageStore.localInspections.map(
                (item, index) => (
                  <InspectionCard isReadyToSend={store.mainPageStore.checkIsInspectionReadyToSend(index)}
                    sendInspection={handleSendInspection}
                    handleDeleteButtonClick={handleDeleteInspection}
                    handleEditButtonClick={() => {}}
                    id={item.id ?? ""}
                    key={item.id}
                    subGroup={SubGroupsActionsTypes.NewInspections}
                    checkVerifyDate={item[InspectionFormTypes.AuditDate]}
                    oilfield={item[InspectionFormTypes.OilField]?.title}
                    doObject={item[InspectionFormTypes.DoObject]?.title}
                    contractor={item[InspectionFormTypes.Contractor]?.title}
                    contractorStruct={
                      item[InspectionFormTypes.ContractorStruct]?.title
                    }
                    inspectionType={
                      item[InspectionFormTypes.InspectionType]?.title
                    }
                    inspectionForm={
                      item[InspectionFormTypes.InspectionForm]?.title
                    }
                    index={index + 1}
                  />
                ),
              )}
              sendInspection={handleSendInspection}
              loader={store.loaderStore.loader}
              onScrollToBottom={onScrollToBottom}
              inspectionsCount={store.mainPageStore.inspectionsCount}
              handleDeleteSentButtonClick={(id: string) => {
                handleDelete(id, SubGroupsActionsTypes.Sent);
              }}
              handleDeleteNewInspectionButtonClick={(id: string) => {
                handleDelete(id, SubGroupsActionsTypes.NewInspections);
              }}
              handleEditInspection={handleEditInspection}
              handleEditLocalInspection={handleEditLocalInspection}
              localInspections={store.mainPageStore.localInspections}
              inspections={store.mainPageStore.inspections}
            />
          }
          path="/"
        />
        {/*Sent and new inspections table on main page*/}
        {[
          store.mainPageStore.localInspections,
          store.mainPageStore.inspections,
        ].map((inspections, index) => {
          return (
            <Route
              element={
                /*inspections.length ? (*/
                <InspectionsTable
                  loader={store.loaderStore.loader}
                  handleSort={handleSort}
                  onInspectionTextFieldClose={handleInspectionTextFieldClose}
                  onScrollToBottom={handleScrollFieldToBottom}
                  onSearchValueChange={handleSearchValueChange}
                  resetFilters={() => store.mainPageStore.resetFilters()}
                  handleDeleteFilter={handleFilterChange}
                  filterFieldsValues={store.mainPageStore.filterFieldsValues}
                  handleFilterChange={handleFilterChange}
                  handlePaginationChange={handlePaginationChange}
                  subGroupsActionsTypes={
                    !index
                      ? SubGroupsActionsTypes.NewInspections
                      : SubGroupsActionsTypes.Sent
                  }
                  fieldsData={store.inspectionStore.fieldsData}
                  handleOpenFilter={handleOpenFilter}
                  handleDeleteSentButtonClick={(id: string) => {
                    handleDelete(id, SubGroupsActionsTypes.Sent);
                  }}
                  inspectionsCount={store.mainPageStore.inspectionsCount}
                  handleDeleteNewInspectionButtonClick={(id: string) => {
                    handleDelete(id, SubGroupsActionsTypes.NewInspections);
                  }}
                  handleEditInspection={handleEditInspection}
                  handleEditLocalInspection={handleEditLocalInspection}
                  inspections={inspections}
                />
                /*  ) : (
                  renderLoader()
                )*/
              }
              path={
                !index
                  ? SubGroupsActionsTypes.NewInspections
                  : SubGroupsActionsTypes.Sent
              }
            />
          );
        })}
        {/*BarriersCarts and BarriersApps on main page*/}
        <Route
          element={<EmptyBoxPage />}
          path={SubGroupsActionsTypes.BarriersCarts}
        />
        <Route
          element={<EmptyBoxPage />}
          path={SubGroupsActionsTypes.BarriersApps}
        />
      </Routes>
    );
  };

  const getSubHeaderTitle = () => {
    if (location.pathname.includes(SubGroupsActionsTypes.Sent)) {
      return t(SubGroupsActionsTypes.Sent);
    }
    if (location.pathname.includes(SubGroupsActionsTypes.NewInspections)) {
      return t(SubGroupsActionsTypes.NewInspections);
    }
  };

  return (
    <div>
      <MainPageLayout
        sideBar={
          <SideBar
            onItemClick={onItemClick}
            subGroupsState={store.mainPageStore.subGroupsState}
          />
        }
        contentHeader={
          <SubHeader
            title={getSubHeaderTitle()}
            handleAddInspection={handleAddInspection}
          />
        }
        content={contentRoutes()}
      />
      <ConfirmDialog
        cancelActionLabel={t("cancel")}
        confirmActionLabel={t("delete")}
        title={
          store.mainPageStore.deletingInspectionType?.type ===
          SubGroupsActionsTypes.Sent
            ? t("dialogDeleteSentInspection")
            : t("dialogDeleteNewInspection")
        }
        action={() =>
          store.mainPageStore.deletingInspectionType?.type ===
          SubGroupsActionsTypes.Sent
            ? handleDeleteSentInspection()
            : handleDeleteNewInspection()
        }
        onClose={() => setIsModalOpen(false)}
        open={isModalOpen}
      />
    </div>
  );
});
