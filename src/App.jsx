import { useState } from 'react'
import Inicio from './components/Inicio.jsx'
import CrearReporte from './components/CrearReporte.jsx'
import DetalleReporte from './components/DetalleReporte.jsx'

export default function App() {
  // vista: 'inicio' | 'crear' | 'detalle'
  const [vista, setVista] = useState('inicio')
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null)

  function irADetalle(reporte) {
    setReporteSeleccionado(reporte)
    setVista('detalle')
  }

  return (
    <div className="app-shell">
      {vista === 'inicio' && (
        <Inicio
          onCrearReporte={() => setVista('crear')}
          onVerDetalle={irADetalle}
        />
      )}
      {vista === 'crear' && (
        <CrearReporte
          onCancelar={() => setVista('inicio')}
          onPublicado={() => setVista('inicio')}
        />
      )}
      {vista === 'detalle' && reporteSeleccionado && (
        <DetalleReporte
          reporte={reporteSeleccionado}
          onVolver={() => setVista('inicio')}
        />
      )}
    </div>
  )
}
