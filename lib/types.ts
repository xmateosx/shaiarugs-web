export interface Rug {
  sku: string | null
  category: string
  origin: {
    country: string | null
    label: string | null
  }
  rug_type: string | null
  weave_type: string | null
  dimensions: {
    raw: string
    width_ft: number
    width_in: number
    length_ft: number
    length_in: number
    width_decimal: number
    length_decimal: number
    area_sq_ft: number
  } | null
  circa_year: number | null
  circa_decade: string | null
  era: 'antique' | 'vintage' | 'modern' | null
  colors: string[]
  design: {
    layout: string | null
    motifs: string[]
  }
  description_clean: string | null
  description_raw: string | null
  image_url?: string | null
  flags: string[]
  style_notes: string[]
  data_quality: {
    has_sku: boolean
    has_dimensions: boolean
    has_circa: boolean
    has_origin: boolean
    has_type: boolean
    confidence: 'high' | 'medium' | 'low'
  }
}

export type Category =
  | 'Scatter Rugs'
  | 'Room Size Rugs'
  | 'Runners'
  | 'Oversize Rugs'
  | 'Tribal Rugs'
  | 'European & Textiles'

export interface FilterState {
  category: string
  origin: string
  era: string
  search: string
}
