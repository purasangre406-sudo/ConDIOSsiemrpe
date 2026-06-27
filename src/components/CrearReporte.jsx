import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { supabase } from '../lib/supabaseClient.js'

const iconoMarcador = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

const CENTRO_VENEZUELA = [8.0, -66.0]

function SelectorDeMapa({ posicion, onSeleccionar }) {
  useMapEvents({
    click(e) {
      onSeleccionar([e.latlng.lat, e.latlng.lng])
    },
  })
  return posicion ? <Marker position={posicion} icon={iconoMarcador} /> : null
}

const estiloInput = {
  width: '100%',
  padding: '11px 12px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  fontSize: '14px',
  marginBottom: '1rem',
  background: 'var(--color-surface)',
  color: 'var(--color-text)'
}

const estiloLabel = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--color-text-muted)',
  marginBottom: '6px'
}

export default function CrearReporte({ onCancelar, onPublicado }) {
  const [nombre, setNombre] = useState('')
  const [edad, setEdad] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [ubicacionTexto, setUbicacionTexto] = useState('')
  const [fechaDesaparicion, setFechaDesaparicion] = useState('')
  const [contacto, setContacto] = useState('')
  const [posicion, setPosicion] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  async function manejarEnvio(e) {
    e.preventDefault()
    setError(null)

    if (!nombre || !contacto) {
      setError('El nombre y un contacto son obligatorios.')
      return
    }
    if (!posicion) {
      setError('Toca el mapa para marcar la última ubicación conocida.')
      return
    }

    setEnviando(true)
    const { error: errorInsert } = await supabase.from('reportes').insert({
      nombre,
      edad: edad ? parseInt(edad, 10) : null,
      descripcion,
      ultima_ubicacion_lat: posicion[0],
      ultima_ubicacion_lng: posicion[1],
      ultima_ubicacion_texto: ubicacionTexto,
      fecha_desaparicion: fechaDesaparicion || null,
      contacto,
    })

    setEnviando(false)

    if (errorInsert) {
      setError('No se pudo publicar el reporte. Intenta de nuevo en un momento.')
      console.error(errorInsert)
      return
    }

    onPublicado()
  }

  return (
    <div style={{ padding: '1.25rem 1.25rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
        <button
          onClick={onCancelar}
          style={{ background: 'none', border: 'none', fontSize: '20px', padding: 0, color: 'var(--color-text)' }}
          aria-label="Volver"
        >
          ←
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '19px', margin: 0 }}>
          Reportar persona desaparecida
        </h1>
      </div>

      <form onSubmit={manejarEnvio}>
        <label style={estiloLabel}>Nombre completo *</label>
        <input style={estiloInput} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: María González" />

        <label style={estiloLabel}>Edad</label>
        <input style={estiloInput} type="number" value={edad} onChange={(e) => setEdad(e.target.value)} placeholder="Ej: 34" />

        <label style={estiloLabel}>Descripción física</label>
        <textarea
          style={{ ...estiloInput, minHeight: '80px', resize: 'vertical' }}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Estatura, vestimenta, señas particulares..."
        />

        <label style={estiloLabel}>Última ubicación conocida (descripción) *</label>
        <input
          style={estiloInput}
          value={ubicacionTexto}
          onChange={(e) => setUbicacionTexto(e.target.value)}
          placeholder="Ej: Cerca de la plaza principal, Maracaibo"
        />

        <label style={estiloLabel}>Marca el punto exacto en el mapa *</label>
        <div style={{
          height: '200px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
          marginBottom: '1rem'
        }}>
          <MapContainer center={CENTRO_VENEZUELA} zoom={6} style={{ height: '100%', width: '100%' }}>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <SelectorDeMapa posicion={posicion} onSeleccionar={setPosicion} />
          </MapContainer>
        </div>

        <label style={estiloLabel}>Fecha en que se le vio por última vez</label>
        <input style={estiloInput} type="date" value={fechaDesaparicion} onChange={(e) => setFechaDesaparicion(e.target.value)} />

        <label style={estiloLabel}>Contacto de la familia (teléfono o correo) *</label>
        <input style={estiloInput} value={contacto} onChange={(e) => setContacto(e.target.value)} placeholder="Ej: +58 412 1234567" />

        {error && (
          <div style={{
            background: 'var(--color-warn-light)',
            color: 'var(--color-warn)',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={enviando}
          style={{
            width: '100%',
            background: 'var(--color-accent)',
            color: '#FFF',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            fontSize: '15px',
            fontWeight: 600,
            opacity: enviando ? 0.7 : 1
          }}
        >
          {enviando ? 'Publicando...' : 'Publicar reporte'}
        </button>
      </form>
    </div>
  )
}
