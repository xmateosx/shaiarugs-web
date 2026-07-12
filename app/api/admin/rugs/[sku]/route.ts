import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { deleteAdminRug, upsertAdminRug } from '@/lib/kv-rugs'
import { getRugBySku } from '@/lib/rugs'
import type { Rug } from '@/lib/types'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { sku } = await params
  const body = await req.json() as Partial<Rug>

  // Start from existing static rug if available, then apply updates
  const existing = getRugBySku(sku)
  const updated: Rug = {
    ...(existing ?? {}),
    ...body,
    sku,
    origin: { ...(existing?.origin ?? {}), ...(body.origin ?? {}) },
    data_quality: {
      has_sku: true,
      has_dimensions: !!(body.dimensions ?? existing?.dimensions),
      has_circa: !!(body.circa_year ?? existing?.circa_year),
      has_origin: !!(body.origin?.label ?? existing?.origin?.label),
      has_type: !!(body.rug_type ?? existing?.rug_type),
      confidence: 'high',
    },
  } as Rug

  await upsertAdminRug(updated)
  return NextResponse.json(updated)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { sku } = await params
  await deleteAdminRug(sku)
  return NextResponse.json({ ok: true })
}
