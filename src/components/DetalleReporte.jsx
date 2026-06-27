import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { supabase } from '../lib/supabaseClient.js'

const iconoMarcador = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

function SelectorDeMapa({ posicion, onSeleccionar }) {
  useMapEvents({
    click(e) {
      onSeleccionar([e.latlng.lat, e.latlng.lng])
    },
  })
  return posicion ? <Marker position={posicion} icon={iconoMarcador} /> : null
}

export default function DetalleReporte({ reporte, onVolver }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [posicion, setPosicion] = useState(null)
  const [comentario, setComentario] = useState('')
  const [contactoTestigo, setContactoTestigo] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(false)

  const posicionInicial = [reporte.ultima_ubicacion_lat, reporte.ultima_ubicacion_lng]

  async function manejarEnvioAvistamiento(e) {
    e.preventDefault()
    setError(null)

    if (!posicion) {
      setError('Toca el mapa para marcar dónde la viste.')
      return
    }

    setEnviando(true)
    const { error: errorInsert } = await supabase.from('avistamientos').insert({
      reporte_id: reporte.id,
      lat: posicion[0],
      lng: posicion[1],
      comentario,
      contacto_testigo: contactoTestigo,
    })
    setEnviando(false)

    if (errorInsert) {
      setError('No se pudo enviar tu reporte. Intenta de nuevo.')
      console.error(errorInsert)
      return
    }
    setExito(true)
  }

  return (
    <div style={{ padding: '1.25rem 1.25rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
        <button
          onClick={onVolver}
          style={{ background: 'none', border: 'none', fontSize: '20px', padding: 0, color: 'var(--color-text)' }}
          aria-label="Volver"
        >
          ←
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '19px', margin: 0 }}>
          Detalle del reporte
        </h1>
      </div>

      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: 'var(--color-accent-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 600, color: 'var(--color-accent)', fontSize: '20px',
            overflow: 'hidden', flexShrink: 0
          }}>
            {reporte.foto_url ? (
              <img src={reporte.foto_url} alt={reporte.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              reporte.nombre?.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '17px', fontWeight: 600 }}>
              {reporte.nombre}{reporte.edad ? `, ${reporte.edad} años` : ''}
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)' }}>
              {reporte.ultima_ubicacion_texto}
            </p>
          </div>
        </div>

        {reporte.descripcion && (
          <p style={{ fontSize: '14px', color: 'var(--color-text)', lineHeight: 1.6, margin: '0 0 0.5rem' }}>
            {reporte.descripcion}
          </p>
        )}

        {reporte.fecha_desaparicion && (
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '0 0 0.5rem' }}>
            Vista por última vez el: {reporte.fecha_desaparicion}
          </p>
        )}

        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0 }}>
          Contacto de la familia: <strong style={{ color: 'var(--color-text)' }}>{reporte.contacto}</strong>
        </p>
      </div>

      {!mostrarFormulario && !exito && (
        <button
          onClick={() => setMostrarFormulario(true)}
          style={{
            width: '100%',
            background: 'var(--color-success)',
            color: '#FFF',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            fontSize: '15px',
            fontWeight: 600
          }}
        >
          La vi aquí
        </button>
      )}

      {exito && (
        <div style={{
          background: 'var(--color-success-light)',
          color: 'var(--color-success)',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          Gracias. Tu información fue enviada y puede ayudar a la familia a encontrarla.
        </div>
      )}

      {mostrarFormulario && !exito && (
        <form onSubmit={manejarEnvioAvistamiento} style={{ marginTop: '1rem' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '6px' }}>
            Toca el mapa donde la viste *
          </label>
          <div style={{
            height: '200px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
            marginBottom: '1rem'
          }}>
            <MapContainer center={posicionInicial} zoom={11} style={{ height: '100%', width: '100%' }}>
              <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <SelectorDeMapa posicion={posicion} onSeleccionar={setPosicion} />
            </MapContainer>
          </div>

          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '6px' }}>
            ¿Algo más que quieras contar? (opcional)
          </label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Ej: la vi caminando hacia el mercado, sobre las 3pm"
            style={{
              width: '100%', padding: '11px 12px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)', fontSize: '14px', marginBottom: '1rem',
              minHeight: '70px', resize: 'vertical'
            }}
          />

          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '6px' }}>
            Tu contacto (opcional, ayuda a que la familia te escriba)
          </label>
          <input
            value={contactoTestigo}
            onChange={(e) => setContactoTestigo(e.target.value)}
            placeholder="Teléfono o correo"
            style={{
              width: '100%', padding: '11px 12px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)', fontSize: '14px', marginBottom: '1rem'
            }}
          />

          {error && (
            <div style={{
              background: 'var(--color-warn-light)', color: 'var(--color-warn)',
              padding: '10px 12px', borderRadius: 'var(--radius-md)', fontSize: '13px', marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            style={{
              width: '100%', background: 'var(--color-success)', color: '#FFF', border: 'none',
              borderRadius: 'var(--radius-md)', padding: '14px', fontSize: '15px', fontWeight: 600,
              opacity: enviando ? 0.7 : 1
            }}
          >
            {enviando ? 'Enviando...' : 'Enviar información'}
          </button>
        </form>
      )}
    </div>
  )
}
