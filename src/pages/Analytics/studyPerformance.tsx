import { StudyPerformanceChart } from '../../components/ui/exemple-chart';
import "../../App.css";

function studyPerformance() {
  return (
    <div className="chart-container">
      <h2 className="chart-title">Seu rendimento</h2>
      <StudyPerformanceChart />
    </div>

  )
}

export default studyPerformance