import { useTranslation } from "react-i18next";

export function StudyPlan() {
  const { t } = useTranslation();

  return <>{t("studyPlan")}</>;
}