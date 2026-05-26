import { useLocation, useParams } from "react-router-dom";
import { usePDF } from "react-to-pdf";
import { Button } from "../../components/ui/button";
import { Copy, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import "./ReportPage.css";

export default function ReportPage() {
  const { id } = useParams();
  const location = useLocation();

  const report = (location.state as any)?.report ?? null;

  // use a ref que vem do hook
  const { toPDF, targetRef } = usePDF({
    method: "save", // "open" abre em nova aba
    filename: "relatorio.pdf",
    page: {
      margin: 10,
    },
  });

  const title =
    report?.state?.report_title ??
    report?.report_data?.title ??
    report?.state?.title ??
    "Relatório";

  const reportText =
    report?.state?.report_text ??
    report?.report_text ??
    JSON.stringify(report, null, 2);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(reportText);
      toast.success("Relatório copiado.");
    } catch (e) {
      console.error("[ReportPage] Erro ao copiar:", e);
      toast.error("Falha ao copiar o relatório.");
    }
  }

  function handleDownloadPDF() {
    toPDF();
  }

  if (!report) {
    return (
      <div className="container">
        <div className="report-card">
          <p>
            Nenhum relatório disponível. Gere um relatório na página inicial.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="report-card">
        <div className="report-header">
          <div className="report-icon">
            <FileText size={28} />
          </div>

          <div className="report-title-group">
            <h1 className="report-title">{title}</h1>
            <div className="report-meta">ID: {id ?? "-"}</div>
          </div>

          <div className="report-actions">
            <Button variant="default" onClick={handleCopy}>
              <Copy size={14} style={{ marginRight: 8 }} />
              Copiar relatório
            </Button>

            <Button variant="default" onClick={handleDownloadPDF}>
              <Download size={14} style={{ marginRight: 8 }} />
              Baixar PDF
            </Button>
          </div>
        </div>

        <div className="report-body" ref={targetRef}>
          <pre className="report-text">{reportText}</pre>
        </div>
      </div>
    </div>
  );
}