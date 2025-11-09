# Visa Data Flow - Updated Implementation

## Overview
The visa booking system now validates visa availability before allowing navigation to the apply-visa page. If no visa data is available for a country, users see an error message and are prevented from proceeding.

---

## Data Flow Diagram

```
User Action (Search/Click) 
    ↓
Fetch Country ID
    ↓
Call /api/cms/visa-country-search
    ↓
Validate Response
    ├─ ❌ No Data / Error → Show Toast Error (No redirect)
    └─ ✅ Valid Data → Store in sessionStorage → Redirect to /apply-visa
                ↓
        Apply Visa Page loads from sessionStorage
```

---

## Components Updated

### 1. **VisaBookingCard** (`src/components/landingpage/VisaBookingCard.tsx`)
**When:** User searches for a country and clicks "Visa Types" button

**Flow:**
1. Validates country selection
2. Gets country ID from sessionStorage
3. Calls `/api/cms/visa-country-search` with `countryCode`
4. Validates response:
   - Must have `success: true`
   - Must have `data` array with at least 1 item
5. If valid: 
   - Stores `applyVisaDetails` in sessionStorage
   - Redirects to `/apply-visa`
6. If invalid:
   - Shows error toast: "The country is not found or no visa is available"
   - No redirect

### 2. **VisaCard** (`src/components/landingpage/VisaCard.tsx`)
**When:** User clicks on a visa card on the landing page

**Flow:**
1. Fetches country ID from `/api/cms/countries-dd-proxy`
2. Stores country ID in sessionStorage
3. Calls `/api/cms/visa-country-search` with `countryCode`
4. Validates response structure
5. If valid:
   - Stores `applyVisaDetails` in sessionStorage
   - Redirects to `/apply-visa`
6. If invalid:
   - Shows error toast
   - No redirect

### 3. **CountrySlider** (`src/components/visa/CountrySlider.tsx`)
**When:** User clicks on a visa card in the country slider

**Flow:**
1. Stores country ID in sessionStorage
2. Calls `/api/cms/visa-country-search` with `countryCode`
3. Validates response structure
4. If valid:
   - Stores `applyVisaDetails` in sessionStorage
   - Redirects to `/apply-visa`
5. If invalid:
   - Shows error toast
   - No redirect

### 4. **ApplyVisaPage** (`src/app/apply-visa/page.tsx`)
**When:** Page loads

**Flow:**
1. **Priority 1:** Check `applyVisaDetails` in sessionStorage
   - If found and valid → Use immediately
2. **Priority 2:** If no cached details, fetch from API
   - Get `applyVisaCountryId` from sessionStorage
   - Call `/api/cms/visa-country-search`
   - Display results or fallback to default (UAE)

---

## API Response Structure

### Expected Response from `/api/cms/visa-country-search`:

```json
{
  "data": [
    {
      "id": "10",
      "uniqueId": "...",
      "countryId": "KH",
      "visaType": "",
      "detailsJson": {
        "title": "Cambodia",
        "country": "KH",
        "visaTypes": [...],
        "eligibility": {...},
        "visaProcess": {...},
        "faq": [...]
      },
      "status": "PUBLISHED",
      "expiryDate": "",
      "recordStatus": "ACTIVE",
      "createdOn": "04-10-2025",
      "updatedOn": "04-10-2025"
    }
  ],
  "message": " Success",
  "success": true
}
```

### Validation Criteria:
✅ Response status is 200 OK
✅ `success` field is `true`
✅ `data` field exists and is an array
✅ `data` array has at least 1 item

---

## SessionStorage Keys

### `applyVisaCountryId`
- **Type:** String
- **Purpose:** Store the country code/ID for visa search
- **Set by:** VisaBookingCard, VisaCard, CountrySlider
- **Used by:** ApplyVisaPage (fallback if no cached details)

### `applyVisaDetails`
- **Type:** JSON string (full visa object from API)
- **Purpose:** Cache the complete visa details response
- **Set by:** VisaBookingCard, VisaCard, CountrySlider
- **Used by:** ApplyVisaPage (priority loading)

---

## Error Handling

### Error Message:
**"The country is not found or no visa is available"**

### Shown When:
1. API call returns non-200 status
2. Response has `success: false`
3. Response has no `data` field
4. Response has empty `data` array
5. Network error or exception

### User Experience:
- ❌ Error toast appears (4 seconds)
- ❌ No redirect happens
- ✅ User stays on current page
- ✅ Can try selecting a different country

---

## Console Logging

All components now include detailed logging for debugging:

### VisaBookingCard:
```
[VisaBookingCard] Validating visa data for country: KH
[VisaBookingCard] API response status: 200
[VisaBookingCard] API response data: {...}
[VisaBookingCard] Valid visa data found, redirecting to apply-visa
```

### VisaCard:
```
[VisaCard] Clicked on visa card for: Cambodia
[VisaCard] Validating visa data for country: KH
[VisaCard] API response status: 200
[VisaCard] Valid visa data found, redirecting to apply-visa
```

### CountrySlider:
```
[CountrySlider] Clicked on visa card for: Cambodia
[CountrySlider] Validating visa data for country: KH
[CountrySlider] API response status: 200
[CountrySlider] Valid visa data found, redirecting to apply-visa
```

### ApplyVisaPage:
```
[ApplyVisaPage] Using cached visa details: {...}
OR
[ApplyVisaPage] Fetching visa data for country: KH
[ApplyVisaPage] Successfully loaded visa details
```

---

## Testing Checklist

### Test Case 1: Valid Country
✅ Search for valid country (e.g., Cambodia)
✅ Click "Visa Types" or card
✅ Should redirect to /apply-visa
✅ Page should display visa details

### Test Case 2: Invalid Country
✅ Search for country with no visa data
✅ Click "Visa Types" or card
✅ Should show error toast
✅ Should NOT redirect
✅ User stays on current page

### Test Case 3: Network Error
✅ Simulate network failure
✅ Should show error toast
✅ Should NOT redirect

### Test Case 4: Cached Data
✅ Visit apply-visa page after selecting country
✅ Navigate away and back
✅ Should load instantly from cache
✅ No API call needed

---

## Benefits

1. **Data Validation:** Ensures only valid visa data loads
2. **Better UX:** Users don't land on empty/error pages
3. **Clear Feedback:** Immediate error messages
4. **Performance:** Uses cached data when available
5. **Debugging:** Comprehensive console logging
6. **Consistency:** Same validation across all entry points

---

## Migration Notes

### Breaking Changes:
- Removed nested routing (`/[slug]/apply-visa`)
- Now uses flat route (`/apply-visa`) only

### Non-Breaking:
- All existing visa card functionality preserved
- SessionStorage keys unchanged
- API endpoints unchanged
- Error messages standardized

---

## Future Enhancements

- [ ] Add loading spinner during validation
- [ ] Cache validation results to reduce API calls
- [ ] Add retry mechanism for failed requests
- [ ] Show partial data if available
- [ ] Add analytics for failed validations

