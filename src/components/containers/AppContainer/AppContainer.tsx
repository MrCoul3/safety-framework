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
import NewInspectionPage from "../../../pages/NewInspectionPage";
import { SubGroupsActionsTypes } from "../../../enums/SubGroupsTypes";
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
      <MainHeader />
      <Routes>
        <Route path="/*" element={<MainPage />} />
        <Route path="*" element={render404()} />
        <Route
          path={RoutesTypes.NewInspection}
          element={<NewInspectionPage />}
        />
        <Route
          path={RoutesTypes.NewInspection + "/:editInspectionId"}
          element={<NewInspectionPage />}
        />
      </Routes>
    </>
  );
});
