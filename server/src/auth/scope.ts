import type { AuthUser } from './auth.js';

type RecordWithLinks = Record<string, any>;

export function canAccessRecord(user: AuthUser | undefined, collection: string, record: RecordWithLinks): boolean {
  if (!user || user.role === 'superadmin' || user.role === 'campaign_manager') return true;

  if (user.role === 'agency_admin') {
    if (!user.agencyId) return true;
    if (collection === 'agencies') return record.id === user.agencyId;
    if (['creators', 'campaigns'].includes(collection) && record.agencyId) return record.agencyId === user.agencyId;
    return true;
  }

  if (user.role === 'creator') {
    if (!user.creatorId) return false;
    if (collection === 'creators') return record.id === user.creatorId;
    if (collection === 'campaigns') return Array.isArray(record.creatorIds) && record.creatorIds.includes(user.creatorId);
    if (collection === 'collaborations') return record.creatorId === user.creatorId;
    if (collection === 'payments') return record.entityType === 'Creador' && record.entityId === user.creatorId;
    if (collection === 'files') return record.uploadedBy === user.name;
    if (collection === 'contracts') return record.partyType === 'Creador' && record.partyId === user.creatorId;
    if (collection === 'calendarEvents') return record.relatedId === user.creatorId;
    if (collection === 'tasks') return record.assignee === user.name;
    return true;
  }

  if (user.role === 'brand') {
    if (!user.brandId) return false;
    if (collection === 'brands') return record.id === user.brandId;
    if (collection === 'campaigns') return record.brandId === user.brandId;
    if (collection === 'collaborations') return record.brandId === user.brandId;
    if (collection === 'payments') return record.entityType === 'Marca' && record.entityId === user.brandId;
    if (collection === 'pipelineDeals') return record.brandId === user.brandId;
    if (collection === 'files') return record.uploadedBy === user.name;
    if (collection === 'contracts') return record.partyType === 'Marca' && record.partyId === user.brandId;
    if (collection === 'calendarEvents') return record.relatedId === user.brandId;
    if (collection === 'tasks') return record.assignee === user.name;
    return true;
  }

  return false;
}

export function scopeCollection<T extends object>(user: AuthUser | undefined, collection: string, records: T[]): T[] {
  return records.filter(record => canAccessRecord(user, collection, record as RecordWithLinks));
}
