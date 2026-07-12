'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCategories } from '@/lib/rugs'

const categories = getCategories()

const inputStyle = {
  backgroundColor: 'var(--cream-dark)',
  borderColor: 'var(--border)',
  color: 'var(--brown-dark)',
} as const

export default function AddRugForm() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [sku, setSku] = useState('')
  const [category, setCategory] = useState<string>(categories[0])
  const [originLabel, setOriginLabel] = useState('')
  const [rugType, setRugType] = useState('')
  const [dimensionsRaw, setDimensionsRaw] = useState('')
  const [circaYear, setCircaYear] = useState('')
  const [era, setEra] = useState<'antique' | 'vintage' | 'modern' | ''>('')
  const [colors, setColors] = useState('')
  const [description, setDescription] = useState('')

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Show local preview immediately
    setImagePreview(URL.createObjectURL(file))
    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
    setUploading(false)

    if (!res.ok) {
      setError('Image upload failed. Check that Vercel Blob is configured.')
      return
    }
    const { url } = await res.json()
    setImageUrl(url)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    // Parse dimensions
    let dimensions = null
    if (dimensionsRaw) {
      const m = dimensionsRaw.match(/^(\d+)['\-](\d+)?["x×\s]+(\d+)['\-](\d+)?/)
      if (m) {
        const wFt = parseInt(m[1]), wIn = parseInt(m[2] ?? '0')
        const lFt = parseInt(m[3]), lIn = parseInt(m[4] ?? '0')
        dimensions = {
          raw: dimensionsRaw,
          width_ft: wFt, width_in: wIn,
          length_ft: lFt, length_in: lIn,
          width_decimal: wFt + wIn / 12,
          length_decimal: lFt + lIn / 12,
          area_sq_ft: parseFloat(((wFt + wIn / 12) * (lFt + lIn / 12)).toFixed(1)),
        }
      }
    }

    const payload = {
      sku: sku || null,
      category,
      origin: { country: null, label: originLabel || null },
      rug_type: rugType || null,
      dimensions,
      circa_year: circaYear ? parseInt(circaYear) : null,
      era: era || null,
      colors: colors ? colors.split(',').map(c => c.trim()).filter(Boolean) : [],
      description_clean: description || null,
      description_raw: description || null,
      image_url: imageUrl || null,
    }

    const res = await fetch('/api/admin/rugs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setSaving(false)

    if (!res.ok) {
      setError('Failed to save rug. Try again.')
      return
    }

    router.push('/admin')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link
          href="/admin"
          className="text-xs tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: 'var(--brown-mid)' }}
        >
          ← Back
        </Link>
        <div>
          <p className="text-xs tracking-[0.25em] uppercase mb-0.5" style={{ color: 'var(--gold)' }}>Admin</p>
          <h1 className="text-2xl font-[family-name:var(--font-playfair)]" style={{ color: 'var(--burgundy)' }}>
            Add New Rug
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Image upload */}
        <div>
          <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--brown-mid)' }}>
            Photo
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            className="relative cursor-pointer rounded-sm overflow-hidden flex items-center justify-center transition-opacity hover:opacity-80"
            style={{
              height: imagePreview ? 280 : 160,
              backgroundColor: 'var(--cream-dark)',
              border: '2px dashed var(--border)',
            }}
          >
            {imagePreview ? (
              <Image src={imagePreview} alt="Preview" fill className="object-contain" unoptimized />
            ) : (
              <div className="text-center px-4">
                <div className="text-3xl mb-2 opacity-30" style={{ color: 'var(--burgundy)' }}>✦</div>
                <p className="text-sm" style={{ color: 'var(--brown-mid)' }}>
                  {uploading ? 'Uploading…' : 'Click to upload photo'}
                </p>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(245,240,232,0.7)' }}>
                <p className="text-sm tracking-widest uppercase" style={{ color: 'var(--gold)' }}>Uploading…</p>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          {imageUrl && (
            <p className="text-xs mt-1 opacity-60 truncate" style={{ color: 'var(--brown-mid)' }}>
              Uploaded ✓
            </p>
          )}
        </div>

        {/* Two-col fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: 'var(--brown-mid)' }}>
              SKU / Item #
            </label>
            <input
              type="text"
              value={sku}
              onChange={e => setSku(e.target.value)}
              placeholder="e.g. 14501"
              className="w-full px-3 py-2 text-sm border rounded-sm outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: 'var(--brown-mid)' }}>
              Category *
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border rounded-sm"
              style={inputStyle}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: 'var(--brown-mid)' }}>
              Origin / Region
            </label>
            <input
              type="text"
              value={originLabel}
              onChange={e => setOriginLabel(e.target.value)}
              placeholder="e.g. Persian/Tabriz"
              className="w-full px-3 py-2 text-sm border rounded-sm outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: 'var(--brown-mid)' }}>
              Rug Type
            </label>
            <input
              type="text"
              value={rugType}
              onChange={e => setRugType(e.target.value)}
              placeholder="e.g. Serapi, Kazak"
              className="w-full px-3 py-2 text-sm border rounded-sm outline-none"
              style={inputStyle}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: 'var(--brown-mid)' }}>
              Dimensions
            </label>
            <input
              type="text"
              value={dimensionsRaw}
              onChange={e => setDimensionsRaw(e.target.value)}
              placeholder="e.g. 4-2x6-8 or 4ft 2in x 6ft 8in"
              className="w-full px-3 py-2 text-sm border rounded-sm outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: 'var(--brown-mid)' }}>
              Circa Year
            </label>
            <input
              type="number"
              value={circaYear}
              onChange={e => setCircaYear(e.target.value)}
              placeholder="e.g. 1890"
              min={1700}
              max={2025}
              className="w-full px-3 py-2 text-sm border rounded-sm outline-none"
              style={inputStyle}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: 'var(--brown-mid)' }}>
              Era
            </label>
            <select
              value={era}
              onChange={e => setEra(e.target.value as typeof era)}
              className="w-full px-3 py-2 text-sm border rounded-sm"
              style={inputStyle}
            >
              <option value="">— Select —</option>
              <option value="antique">Antique (pre-1920)</option>
              <option value="vintage">Vintage (1920–1970)</option>
              <option value="modern">Modern</option>
            </select>
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: 'var(--brown-mid)' }}>
              Colors
            </label>
            <input
              type="text"
              value={colors}
              onChange={e => setColors(e.target.value)}
              placeholder="e.g. Red, Navy, Ivory"
              className="w-full px-3 py-2 text-sm border rounded-sm outline-none"
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: 'var(--brown-mid)' }}>
            Description *
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="Describe the rug — condition, notable features, provenance…"
            className="w-full px-3 py-2 text-sm border rounded-sm outline-none resize-y"
            style={inputStyle}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex-1 py-3 text-sm tracking-widest uppercase font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ backgroundColor: 'var(--burgundy)', color: 'var(--gold-light)' }}
          >
            {saving ? 'Saving…' : 'Save Rug'}
          </button>
          <Link
            href="/admin"
            className="px-6 py-3 text-sm tracking-widest uppercase border transition-opacity hover:opacity-70"
            style={{ borderColor: 'var(--border)', color: 'var(--brown-mid)' }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
