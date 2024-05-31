import { SubGroupsActionsTypes, SubGroupsTypes } from "../enums/SubGroupsTypes";
import { InspectionStatusesTypes } from "../enums/InspectionStatusesTypes";
import { CheckEntityTypes } from "../enums/CheckEntityTypes";
import {
  InspectionFormGroups,
  InspectionFormTypes,
} from "../enums/InspectionFormTypes";
import {FreeFormTypes} from "../enums/FreeFormTypes";

export const ru = {
  dict: {
    of: "из",
    from: "с",
    to: "по",
    reset: "Сбросить",
    save: "Сохранить",
    cancel: "Отменить",
    next: "Продолжить",
    resetFilter: "Сбросить фильтр",
    farther: "Дальше",
    edit: "Редактировать",
    recover: "Восстановить",
    delete: "Удалить",
    go: "Перейти",
    send: "Отправить",
    apply: "Применить",
    select: "Выбрать",
    close: "Закрыть",
    download: "Скачать",
    filters: "Фильтры",
    selected: "Выбрано: ",
    selectAll: "Выбрать все",
    unselectAll: "Снять выделение",
    clearAll: "Очистить все",
    clear: "Очистить",
    description: "Описание",
    back: "Назад",
    forward: "Вперёд",


    // breadcrumbs
    mainPage: "Главная",
    inspectionData: "Данные инспекции",
    passports: "Паспорта барьеров",
    editInspectionData: "Редактировать данные инспекции",
    createInspection: "Создать инспекцию",
    saveInspection: "Сохранить инспекцию",
    addFreeForm: "Добавить свободную форму",
    toPassports: "К паспортам",
    toInspectionForm: "К данным инспекции",
    saveChanges: "Сохранить изменения",
    editPassports: "Редактировать паспорта инспекции",
    completionBarrier: "Заполнение барьера по паспорту",
    completionFreeForm: "Заполнение свободной формы",

    toHome: "На главную",

    [SubGroupsTypes.Statistic]: "Статистика",
    [SubGroupsActionsTypes.MainList]: "Общий список",
    mainListOfInspections: "Общий список иснпекций",
    [SubGroupsTypes.Inspections]: "Инспекции",
    [SubGroupsActionsTypes.NewInspections]: "Неотправленные инспекции",
    [SubGroupsActionsTypes.Sent]: "Отправленные инспекции",
    [SubGroupsActionsTypes.Deleted]: "Удаленные",
    [SubGroupsActionsTypes.EliminationOfViolations]: "Устранение нарушений",
    [SubGroupsTypes.Information]: "Информация",
    [SubGroupsActionsTypes.BarriersCarts]: "Корзины барьеров",
    [SubGroupsActionsTypes.BarriersApps]: "Приложения к барьерам",

    [InspectionStatusesTypes.Success]: "Успешно отправлено",
    [InspectionStatusesTypes.Error]: "Ошибка отправки",
    [InspectionStatusesTypes.Warning]: "Инспекция не заполнена",

    [CheckEntityTypes.Barriers]: "Барьеры",
    [CheckEntityTypes.FreeForms]: "Свободные формы",

    searchPlaceholder: "Я ищу",
    searchBarriersPlaceholder: "Введите название барьера",
    mainTitle: "Каркас безопасности",
    addInspection: "Добавить инспекцию",
    inspection: "Инспекция",
    noOptions: "Не найдено",
    fastSearch: "Быстрый поиск",
    checkVerifyDate: "Дата выполнения проверки",
    checkEditedDate: "Дата редактирования проверки",
    checkDetails: "Детали проверки",
    inspectionNumber: "Номер инспекции",
    inspectionName: "Инспекция № ",
    emptyNewInspections: "Нет новых инспекций",
    emptySentInspections: "Нет отправленных инспекций",
    emptyInspections: "Нет инспекций",
    noData: "Нет данных",
    noFilled: "Не заполнено",

    // Данные формы
    [InspectionFormGroups.Common]: "Общее",
    [InspectionFormTypes.AuditDate]: "Дата проверки",
    [InspectionFormTypes.InspectionForm]: "Форма проверки",
    [InspectionFormTypes.InspectionType]: "Тип проверки",
    [InspectionFormTypes.Function]: "Функция",
    [InspectionFormGroups.InspectionPlace]: "Место проведения проверки",
    [InspectionFormTypes.OilField]: "Месторождение",
    [InspectionFormTypes.DoStruct]: "Структурное подразделение ДО",
    [InspectionFormTypes.DoObject]: "Объект ДО, где проводилась проверка",
    [InspectionFormGroups.ContractorUnderReview]:
      "Проверяемая подрядная организация",
    [InspectionFormTypes.Contractor]: "Наименование ПО",
    [InspectionFormTypes.ContractorStruct]: "Номер бригады ПО",
    [InspectionFormTypes.SubContractor]:
      "Наименование субподрядной организации",
    [InspectionFormGroups.InspectionParticipants]: "Участники инспекции",
    [InspectionFormTypes.Auditor]: "ФИО составителя акта",
    [InspectionFormTypes.Auditee]: "ФИО проверяемого",
    [InspectionFormTypes.Supervisor]: "ФИО супервайзера",
    editDate: "Дата редактирования",
    actions: "Действия",

    // свободная форма
    [FreeFormTypes.ViolationCategories]: "Категория нарушения",
    [FreeFormTypes.ViolationTypes]: "Типовое нарушение",
    [FreeFormTypes.Violations]: "Нарушение",
    [FreeFormTypes.WorkTypes]: "Вид работ нарушения",
    [FreeFormTypes.Nmds]: "НМД",
    [FreeFormTypes.NmdRules]: "Пункт правил НМД",
    [FreeFormTypes.OdOuCategories]: "Категория ОД/ОУ",
    [FreeFormTypes.RiskLevels]: "Степень риска",

    freeForm: "Свободная форма",


    addInspectionTitle: "Заполнение данных инспекции",
    editInspectionTitle: "Редактирование данных инспекции",
    addInspectionDescription:
      "Заполните все ключевые поля, чтобы перейти дальше.",
    selectPassport: "Выбор паспорта барьера",
    selectPassportDescription: "Выберите необходимый паспорт для заполнения. В этом окне будут отображаться все выбранные паспорта.",
    completionBarrierDescription: "Выберите необходимые паспорта, нажав на кнопку “+” и заполните требуемые поля, чтобы отправить инспекцию.",
    completionFreeFormDescription: "Заполните свободную форму, чтобы отправить инспекцию. Добавить новые свободные форму можно нажав на кнопку “Добавить свободную форму”.",


    [InspectionFormTypes.InspectionForm + "Placeholder"]:
      "Введите форму проверки",
    [InspectionFormTypes.InspectionType + "Placeholder"]:
      "Введите тип проверки",
    [InspectionFormTypes.Function + "Placeholder"]: "Введите функция",
    [InspectionFormTypes.OilField + "Placeholder"]: "Введите месторождение",
    [InspectionFormTypes.DoStruct + "Placeholder"]:
      "Введите структурное подразделение ДО",
    [InspectionFormTypes.DoObject + "Placeholder"]:
      "Введите объект ДО, где проводилась проверка",
    [InspectionFormTypes.Contractor + "Placeholder"]:
      "Введите наименование ПО",
    [InspectionFormTypes.ContractorStruct + "Placeholder"]:
      "Введите номер бригады ПО",
    [InspectionFormTypes.SubContractor + "Placeholder"]:
      "Введите наименование субподрядной организации",
    [InspectionFormTypes.Auditor + "Placeholder"]: "введите ФИО составителя акта",
    [InspectionFormTypes.Auditee + "Placeholder"]: "введите ФИО проверяемого",
    [InspectionFormTypes.Supervisor + "Placeholder"]: "введите ФИО супервайзера",

    [FreeFormTypes.ViolationCategories + "Placeholder"]: "Введите категорию нарушения",
    [FreeFormTypes.ViolationTypes + "Placeholder"]: "Введите типовое нарушение",
    [FreeFormTypes.Violations + "Placeholder"]: "Введите название нарушения",
    [FreeFormTypes.WorkTypes + "Placeholder"]: "Введите вид работ нарушения",
    [FreeFormTypes.Nmds + "Placeholder"]: "Введите НМД",
    [FreeFormTypes.NmdRules + "Placeholder"]: "Введите пункт правил НМД",
    [FreeFormTypes.OdOuCategories + "Placeholder"]: "Введите категорию ОД/ОУ",
    [FreeFormTypes.RiskLevels + "Placeholder"]: "Введите степень риска",

    dialogClearFields: "Очистить все заполненные поля?",
    dialogDeleteFreeForm: "Удалить свободную форму?",
    dialogDeleteNewInspection: "Удалить неотправленную инспекцию?",
    dialogDeleteSentInspection: "Удалить отправленную инспекцию?",
    dialogGoToMain: "Перейти на главную ? Все несохраненные данные будут потеряны.",

    snackBarSuccessSave: "Инспекция успешно сохранена",
    snackBarSuccessSend: "Инспекция успешно отправлена",

    barriersSelect: "Выбрано барьеров",
  },
};
