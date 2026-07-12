import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { getAdminRugs, addAdminRug } from '@/lib/kv-rugs'
import type { Rug } from '@/lib/types'

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const rugs = await getAdminRugs()
  return NextResponse.json(rugs)
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as Partial<Rug>

  const adminId = `admin-${Date.now()}`
  const rug: Rug = {
    id: body.id ?? adminId,
    sku: body.sku ?? null,
    category: body.category ?? 'Scatter Rugs',
    origin: {
      country: body.origin?.country ?? null,
      label: body.origin?.label ?? null,
    },
    rug_type: body.rug_type ?? null,
    weave_type: body.weave_type ?? null,
    dimensions: body.dimensions ?? null,
    circa_year: body.circa_year ?? null,
    circa_decade: body.circa_decade ?? null,
    era: body.era ?? null,
    colors: body.colors ?? [],
    design: { layout: null, motifs: [] },
    description_clean: body.description_clean ?? null,
    description_raw: body.description_raw ?? null,
    image_url: body.image_url ?? null,
    flags: [],
    style_notes: [],
    data_quality: {
      has_sku: !!body.sku,
      has_dimensions: !!body.dimensions,
      has_circa: !!body.circa_year,
      has_origin: !!body.origin?.label,
      has_type: !!body.rug_type,
      confidence: 'high',
    },
  }

  await addAdminRug(rug)
  return NextResponse.json(rug, { status: 201 })
}
