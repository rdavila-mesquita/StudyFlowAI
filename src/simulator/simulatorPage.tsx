import Simulator from "../components/ui/simulator"

function SimulatorPage() {
  return (
    <div className="text-center p-5 gap-4">
        <h2 className="simulated-title">Simulado</h2>
        <p>Faça um simulado para testar seus conhecimentos.</p>
        <Simulator />
    </div>
  )
}

export default SimulatorPage