# User Organization Role Cache Implementation

## Overview
Implemented a global caching system for user organization roles to reduce database queries in authorization policies.

## Performance Impact
- **Before**: Every policy check queried OrganizationUser table (1-3 queries per request)
- **After**: First access queries DB, subsequent accesses use in-memory cache
- **Estimated Improvement**: 80-90% reduction in OrganizationUser queries

## Architecture

### 1. Cache Storage
Location: `sails.config.globals.userOrgRoleCache`

Structure:
```javascript
{
  userId1: {
    orgId1: "ORGANIZATION_ADMIN",
    orgId2: "ORGANIZATION_VIEWER",
    orgId3: null  // No role
  },
  userId2: { ... }
}
```

### 2. Cache Service
**File**: `api/services/UserOrgRoleCacheService.js`

**Methods**:
- `getUserOrgRole(userId, orgId)` - Get single user-org role with caching
- `getUserAllOrgRoles(userId)` - Get all org roles for user and cache them
- `clearUserCache(userId)` - Clear cache for specific user
- `clearAllCache()` - Clear entire cache (use with caution)

**Pattern**: Cache-aside (lazy loading)
1. Check cache
2. If miss, query database
3. Store in cache
4. Return result

### 3. Cache Invalidation
**File**: `api/models/OrganizationUser.js`

**Lifecycle Hooks**:
- `afterCreate` - Clear user cache when new role created
- `afterUpdate` - Clear user cache when role updated
- `afterDestroy` - Clear user cache when role deleted

**Strategy**: Invalidate entire user cache on any role change (simple & safe)

## Updated Policies (13 files)

1. ✅ `isUserRoleInOrganizationLevel.js` - Base org role check
2. ✅ `isOrganizationBelongsToUser.js` - Org access verification
3. ✅ `isUserOrgAdminOrOrgViewer.js` - Admin/Viewer check
4. ✅ `isUserOrganizationAdmin.js` - Admin-only check
5. ✅ `isUserOrganizationLimitedOrAdmin.js` - Limited/Admin check
6. ✅ `isUserCanGetGroup.js` - Group access check
7. ✅ `isUserOrgAdminOrOrgViewerOrSiteAdminOrSiteViewer.js` - Multi-level check
8. ✅ `isUserOrganizationAdminOrSiteAdmin.js` - Org/Site admin check
9. ✅ `isReportAccessible.js` - Report access verification
10. ✅ `isScopeAccessibleForLimitedUser.js` - Limited user scope check
11. ✅ `isImageAuthorized.js` - Image access verification
12. ✅ `isUserUnderControlledOfAuthor.js` - Complex multi-org check
13. ✅ `isUserSuperAdminOrTechSupportOrAdminMspOrAdminOrg.js` - Admin hierarchy check

## Usage Example

### Before (Direct DB Query)
```javascript
const response = await OrganizationUser.findOne({
    user: userId,
    organization: orgId
});

if (!response || response.role === constants.ROLE_ORG_NONE) {
    return HttpResponseService.forbidden(res, "unauthorized_access");
}
```

### After (Cached)
```javascript
const response = await UserOrgRoleCacheService.getUserOrgRole(userId, orgId);

if (!response || response.role === constants.ROLE_ORG_NONE) {
    return HttpResponseService.forbidden(res, "unauthorized_access");
}
```

## Testing Checklist

### Functional Tests
- [ ] User can access resources with correct role
- [ ] User denied access without role
- [ ] Cache hit returns same result as DB query
- [ ] Cache miss queries DB and caches result

### Cache Invalidation Tests
- [ ] Create new OrganizationUser → cache cleared for that user
- [ ] Update OrganizationUser role → cache cleared
- [ ] Delete OrganizationUser → cache cleared
- [ ] Verify role changes take effect immediately

### Performance Tests
- [ ] Measure DB query reduction on typical API calls
- [ ] Verify memory usage remains acceptable
- [ ] Test with high user/org counts
- [ ] Load test authorization-heavy endpoints

## Monitoring

### Key Metrics to Track
- Cache hit rate (log messages in UserOrgRoleCacheService)
- OrganizationUser query count (should decrease significantly)
- Memory usage of `userOrgRoleCache` object
- Authorization policy execution time

### Debug Logging
Service includes debug logs:
- `Cache hit for user: X org: Y role: Z`
- `Cache miss, querying DB for user: X org: Y`
- `Cached N roles for user: X`

## Future Enhancements

### Potential Improvements
1. **Preloading**: Load frequently accessed roles on server startup
2. **TTL**: Add time-to-live for cache entries (optional expiration)
3. **Metrics**: Expose cache statistics via monitoring endpoint
4. **Redis**: Move to Redis for multi-instance deployments

### Considerations
- Current implementation is single-process only (in-memory)
- For clustered deployments, consider Redis or similar
- Memory usage grows with user/org combinations (monitor in production)

## Rollback Plan

If issues arise:
1. Keep service file but stop using it in policies
2. Revert policies to direct DB queries
3. Comment out lifecycle hooks in OrganizationUser.js
4. Clear cache: `sails.config.globals.userOrgRoleCache = {}`

## Related Documentation
- [Architecture Instructions](../.github/instructions/architecture.instructions.md)
- [Performance Instructions](../.github/instructions/performance.instructions.md)
- [OrgSiteBuildFlrAggr Cache](./hierarchy-cache-implementation.md) (similar pattern)
