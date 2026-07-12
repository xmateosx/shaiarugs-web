import { Suspense } from 'react'
import { getAllRugsMerged } from '@/lib/rugs-server'
import CollectionClient from './CollectionClient'

export default async function CollectionPage() {
  const rugs = await getAllRugsMerged()

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32">
        <div className="text-sm tracking-widest uppercase" style={{ color: 'var(--gold)' }}>
          Loading collection…
        </div>
      </div>
    }>
      <CollectionClient initialRugs={rugs} />
    </Suspense>
  )
}
