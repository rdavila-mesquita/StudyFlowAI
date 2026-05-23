import Simulator from "../components/ui/simulator"

function simulatorPage() {
  return (
    <div>
        <h2 className="simulated-title">Simulado</h2>
        <p>Faça um simulado para testar seus conhecimentos.</p>
        <Simulator />
    </div>
  )
}

export default simulatorPage