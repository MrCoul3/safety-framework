import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { Responses404 } from "@consta/uikit/Responses404";
import { Route, Routes, useNavigate } from "react-router";
import { MainPage } from "pages/MainPage";
import { Button } from "@consta/uikit/Button";
import MainHeader from "../../MainHeader/MainHeader";
import { useStore } from "../../../hooks/useStore";
import { useTranslation } from "react-i18next";
import { RoutesTypes } from "../../../enums/RoutesTypes";
import InspectionPage from "../../../pages/InspectionPage";
import { SubGroupsActionsTypes } from "../../../enums/SubGroupsTypes";
import PassportsPage from "../../../pages/PassportsPage";
import BarriersPage from "../../../pages/BarriersPage/BarriersPage";
import EmptyBoxPage from "../../EmptyBoxPage/EmptyBoxPage";
import FreeFormPage from "../../../pages/FreeFormPage";
import SnackBarCustom from "../../SnackBarCustom/SnackBarCustom";
export const AppContainer = observer(() => {
  const { t } = useTranslation("dict");

  const navigate = useNavigate();

  const store = useStore();

  useEffect(() => {
    const path = decodeURIComponent(window.location.pathname).replace("/", "");
    if (path) {
      store.mainPageStore.updateSubGroupsState(path as SubGroupsActionsTypes);
    }
  }, []);

  const toHome = () => {
    store.mainPageStore.resetSideBarToHome();
    navigate(`/`);
  };

  const render404 = () => (
    <Responses404
      actions={<Button onClick={toHome} view="ghost" label={t("toHome")} />}
    />
  );
  return (
    <>
      <MainHeader handleLogoClick={toHome} />
      <SnackBarCustom
          onItemClose={() => store.snackBarStore.clearSnackBar()}
          item={store.snackBarStore.snackBarItem}
      />
      <Routes>
        <Route index element={<MainPage />} />
        <Route path={"/*"} element={<MainPage />} />

        <Route
          element={<EmptyBoxPage />}
          path={SubGroupsActionsTypes.EliminationOfViolations}
        />

        <Route path={RoutesTypes.NewInspection} element={<InspectionPage />} />
        <Route
          path={RoutesTypes.EditInspection + "/:editInspectionId"}
          element={<InspectionPage />}
        />
        <Route
          path={RoutesTypes.EditLocalInspection + "/:editInspectionId"}
          element={<InspectionPage />}
        />

        <Route
          path={
            RoutesTypes.EditInspection +
            "/:editInspectionId/" +
            RoutesTypes.Passports
          }
          element={<PassportsPage />}
        />
        <Route
          path={
            RoutesTypes.EditLocalInspection +
            "/:editInspectionId/" +
            RoutesTypes.Passports
          }
          element={<PassportsPage />}
        />
        <Route
          path={RoutesTypes.NewInspection + "/" + RoutesTypes.Passports}
          element={<PassportsPage />}
        />

        <Route
          path={
            RoutesTypes.NewInspection +
            "/" +
            RoutesTypes.Passports +
            "/" +
            RoutesTypes.Barriers +
            "/:passportId"
          }
          element={<BarriersPage />}
        />

        <Route
          path={
            RoutesTypes.EditInspection +
            "/:editInspectionId/" +
            RoutesTypes.Passports +
            "/" +
            RoutesTypes.Barriers +
            "/:id"
          }
          element={<BarriersPage />}
        />

        <Route
          path={
            RoutesTypes.EditLocalInspection +
            "/:editInspectionId/" +
            RoutesTypes.Passports +
            "/" +
            RoutesTypes.Barriers +
            "/:passportId"
          }
          element={<BarriersPage />}
        />

        <Route
          path={RoutesTypes.NewInspection + "/" + RoutesTypes.FreeForm}
          element={<FreeFormPage />}
        />
        <Route
          path={
            RoutesTypes.EditInspection +
            "/:editInspectionId" +
            "/" +
            RoutesTypes.FreeForm
          }
          element={<FreeFormPage />}
        />
        <Route
          path={
            RoutesTypes.EditLocalInspection +
            "/:editInspectionId" +
            "/" +
            RoutesTypes.FreeForm
          }
          element={<FreeFormPage />}
        />

        <Route path="*" element={render404()} />
      </Routes>
    </>
  );
});
