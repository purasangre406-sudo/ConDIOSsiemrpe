import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { supabase } from '../lib/supabaseClient.js'

// Ícono simple para los marcadores del mapa
const iconoMarcador = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

// Centro inicial del mapa: Venezuela
const CENTRO_VENEZUELA = [8.0, -66.0]

export default function Inicio({ onCrearReporte, onVerDetalle }) {
  const [reportes, setReportes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarReportes()
  }, [])

  async function cargarReportes() {
    setCargando(true)
    setError(null)
    const { data, error } = await supabase
      .from('reportes')
      .select('*')
      .eq('estado', 'activo')
      .order('creado_en', { ascending: false })

    if (error) {
      setError('No se pudieron cargar los reportes. Revisa tu conexión a Supabase.')
      console.error(error)
    } else {
      setReportes(data || [])
    }
    setCargando(false)
  }

  function tiempoDesde(fechaISO) {
    const diff = Date.now() - new Date(fechaISO).getTime()
    const horas = Math.floor(diff / (1000 * 60 * 60))
    if (horas < 1) return 'hace minutos'
    if (horas < 24) return `hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`
    const dias = Math.floor(horas / 24)
    return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`
  }

  return (
    <div style={{ padding: '1.25rem 1.25rem 2rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: '22px',
          margin: 0,
          color: 'var(--color-text)'
        }}>
          Buscando Juntos
        </h1>
      </header>

      <div style={{
        height: '220px',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        marginBottom: '1rem'
      }}>
        <MapContainer center={CENTRO_VENEZUELA} zoom={6} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {reportes.map((r) => (
            <Marker
              key={r.id}
              position={[r.ultima_ubicacion_lat, r.ultima_ubicacion_lng]}
              icon={iconoMarcador}
              eventHandlers={{ click: () => onVerDetalle(r) }}
            >
              <Popup>{r.nombre}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <button
        onClick={onCrearReporte}
        style={{
          width: '100%',
          background: 'var(--color-accent)',
          color: '#FFF',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          fontSize: '15px',
          fontWeight: 600,
          marginBottom: '1.5rem'
        }}
      >
        + Reportar persona desaparecida
      </button>

      <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
        Reportes activos
      </h2>

      {cargando && <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Cargando reportes...</p>}

      {error && (
        <div style={{
          background: 'var(--color-warn-light)',
          color: 'var(--color-warn)',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {!cargando && !error && reportes.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '2rem 1rem',
          color: 'var(--color-text-muted)',
          fontSize: '14px'
        }}>
          Todavía no hay reportes activos. Si conoces a alguien desaparecido, puedes ser la primera persona en reportarlo.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {reportes.map((r) => (
          <div
            key={r.id}
            onClick={() => onVerDetalle(r)}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.85rem 1rem',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'var(--color-accent-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 600, color: 'var(--color-accent)', fontSize: '16px',
              flexShrink: 0, overflow: 'hidden'
            }}>
              {r.foto_url ? (
                <img src={r.foto_url} alt={r.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                r.nombre?.charAt(0).toUpperCase()
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
                {r.nombre}{r.edad ? `, ${r.edad} años` : ''}
              </p>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
                {r.ultima_ubicacion_texto || 'Ubicación registrada'} · {tiempoDesde(r.creado_en)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
