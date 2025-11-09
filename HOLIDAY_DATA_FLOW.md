# Holiday Data Flow - Implementation Summary

## Overview
The holiday booking system now validates holiday package availability before allowing navigation to tour details or holiday list pages. If no holiday data is available, users see an error message and are prevented from proceeding.

---

## Data Flow Diagrams

### Flow 1: Holiday Card Click (DestinationCard)

```
User Clicks Holiday Card
    ↓
Store holidayId in sessionStorage
    ↓
Call /api/cms/holiday-itinerary-details
    ↓
Validate Response
    ├─ ❌ No Data / Error → Show Toast Error (No redirect)
    └─ ✅ Valid Data → Store in sessionStorage → Redirect to /tour-details/[slug]
                ↓
        Tour Details Page loads from sessionStorage
```

### Flow 2: Holiday Search (HolidayBookingCard)

```
User Searches & Clicks "Search"
    ↓
Get cityId or countryId from sessionStorage
    ↓
Call /api/cms/holiday-city-search OR /api/cms/holiday-country-search
    ↓
Validate Response
    ├─ ❌ No Data / Error → Show Toast Error (No redirect)
    └─ ✅ Valid Data → Redirect to /holiday-list
                ↓
        Holiday List Page displays results
```

---

## Components Updated

### 1. **DestinationCard** (`src/components/common/DestinationCard.tsx`)
**When:** User clicks on a holiday card anywhere in the app

**Before:**
- Directly redirected to tour-details page
- No validation of data availability

**After:**
1. Validates holiday ID exists
2. Stores holidayId and holidayTitle in sessionStorage
3. Calls `/api/cms/holiday-itinerary-details` with `holidayId`
4. Validates response structure:
   - Must have `success: true`
   - Must have `data` array with at least 1 item
5. If valid:
   - Stores complete `holidayDetails` in sessionStorage
   - Redirects to `/tour-details/[slug]`
6. If invalid:
   - Shows error toast: **"Holiday package not found or unavailable"**
   - No redirect

**API Endpoint:** `POST /api/cms/holiday-itinerary-details`
**Request:** `{ holidayId: "83" }`

---

### 2. **HolidayBookingCard** (`src/components/holidayspage/HolidayBookingCard.tsx`)
**When:** User searches for a city/country and clicks "Search" button

**Before:**
- Directly redirected to holiday-list page
- No validation of data availability

**After:**
1. Validates search query is not empty
2. Determines search type (city or country)
3. Gets corresponding ID from sessionStorage
4. Calls appropriate API endpoint:
   - **City Search:** `POST /api/cms/holiday-city-search` with `{ cityId }`
   - **Country Search:** `POST /api/cms/holiday-country-search` with `{ countryId }`
5. Validates response structure
6. If valid:
   - Redirects to `/holiday-list`
7. If invalid:
   - Shows error toast: **"No holiday packages found for this destination"**
   - No redirect

---

### 3. **TourDetailPage** (`src/app/tour-details/[slug]/page.tsx`)
**When:** Page loads

**Before:**
- Always fetched from API

**After:**
1. **Priority 1:** Check `holidayDetails` in sessionStorage
   - If found and valid → Use immediately (instant load)
2. **Priority 2:** If no cached details, fetch from API
   - Call `/api/cms/holiday-itinerary-details`
   - Display results or show error

**Benefits:**
- Instant page load when coming from validated card click
- Fallback to API for direct URL access
- Caches data for better performance

---

## API Endpoints Used

### 1. Holiday Itinerary Details
**Endpoint:** `POST /api/cms/holiday-itinerary-details`
**Request:**
```json
{
  "holidayId": "83"
}
```

**Response:**
```json
{
  "data": [
    {
      "holidayId": "83",
      "title": "HUNGARY DESERT",
      "cardJson": {
        "title": "HUNGARY DESERT",
        "overview": "...",
        "itineraries": [...],
        "inclusions": [...],
        "exclusions": [...],
        "faqs": [...]
      },
      "noOfDays": "4",
      "noOfNights": "4",
      "price": "5000.00",
      "currency": "CAD"
    }
  ],
  "success": true
}
```

### 2. Holiday City Search
**Endpoint:** `POST /api/cms/holiday-city-search`
**Request:**
```json
{
  "cityId": "371"
}
```

### 3. Holiday Country Search
**Endpoint:** `POST /api/cms/holiday-country-search`
**Request:**
```json
{
  "countryId": "HU"
}
```

---

## SessionStorage Keys

### Holiday-Related Keys:

| Key | Type | Set By | Used By | Purpose |
|-----|------|--------|---------|---------|
| `holidayId` | String | DestinationCard | TourDetailPage | Store holiday package ID |
| `holidayTitle` | String | DestinationCard | TourDetailPage | Store package name |
| `holidayDetails` | JSON | DestinationCard, TourDetailPage | TourDetailPage | Cache complete holiday data |
| `selectedHolidayCityId` | String | HolidayBookingCard | HolidayBookingCard, HolidayListPage | Store selected city ID |
| `selectedHolidayCountryId` | String | HolidayBookingCard | HolidayBookingCard, HolidayListPage | Store selected country ID |
| `selectedHolidayDestination` | String | HolidayBookingCard | HolidayListPage | Store destination name |
| `selectedHolidayDestinationType` | String | HolidayBookingCard | HolidayListPage | Store type (city/country) |

---

## Error Messages

### Holiday Card Click Errors:
- **"Unable to load holiday details. Please try again."** - No holiday ID
- **"Holiday package not found or unavailable"** - API validation failed

### Holiday Search Errors:
- **"Please select a destination"** - Empty search query
- **"Please select a valid city"** - No city ID stored
- **"Please select a valid country"** - No country ID stored
- **"No holiday packages found for this destination"** - API validation failed

---

## Validation Criteria

### Valid Holiday Response Must Have:
✅ Response status 200 OK
✅ `success` field is `true`
✅ `data` field exists and is an array
✅ `data` array has at least 1 item
✅ First item has required structure (e.g., `cardJson` for details)

---

## Console Logging

All components include detailed logging:

### DestinationCard Logs:
```
[DestinationCard] Validating holiday data for: 83
[DestinationCard] API response status: 200
[DestinationCard] API response data: {...}
[DestinationCard] Valid holiday data found, redirecting to tour-details
```

### HolidayBookingCard Logs:
```
[HolidayBookingCard] Validating holiday data for: city Prague
[HolidayBookingCard] API response status: 200
[HolidayBookingCard] Valid holiday data found, redirecting to holiday-list
```

### TourDetailPage Logs:
```
[TourDetails] Using cached holiday details: {...}
OR
[TourDetails] Fetching holiday details from API for: 83
[TourDetails] Fetched data: {...}
```

---

## Testing Checklist

### Test Case 1: Valid Holiday Card Click
- [ ] Click on holiday card
- [ ] See console: "Validating holiday data..."
- [ ] See console: "Valid holiday data found..."
- [ ] Redirected to tour-details page
- [ ] Page loads instantly (from cache)

### Test Case 2: Invalid Holiday Card
- [ ] Click on holiday card with invalid ID
- [ ] See error toast
- [ ] No redirect
- [ ] User stays on current page

### Test Case 3: Holiday Search - Valid
- [ ] Search for city/country
- [ ] Select from dropdown
- [ ] Click "Search"
- [ ] See validation logs
- [ ] Redirected to holiday-list
- [ ] Results displayed

### Test Case 4: Holiday Search - Invalid
- [ ] Search for destination with no packages
- [ ] Click "Search"
- [ ] See error toast: "No holiday packages found..."
- [ ] No redirect

### Test Case 5: Cached Data
- [ ] Click holiday card
- [ ] Navigate to tour details
- [ ] Navigate back
- [ ] Click same card again
- [ ] Page should load instantly from cache

---

## Comparison: Visa vs Holiday

| Aspect | Visa Flow | Holiday Flow |
|--------|-----------|--------------|
| **Card Click Validation** | `/api/cms/visa-country-search` | `/api/cms/holiday-itinerary-details` |
| **Search Validation** | `/api/cms/visa-country-search` | `/api/cms/holiday-city-search` OR `/holiday-country-search` |
| **Cached Data Key** | `applyVisaDetails` | `holidayDetails` |
| **Error Message** | "The country is not found or no visa is available" | "Holiday package not found or unavailable" |
| **Destination Page** | `/apply-visa` | `/tour-details/[slug]` |
| **List Page** | N/A | `/holiday-list` |

---

## Benefits

1. ✅ **Data Validation** - Ensures only valid packages are accessible
2. ✅ **Better UX** - Users don't land on error pages
3. ✅ **Performance** - Cached data for instant loading
4. ✅ **Clear Feedback** - Immediate error messages
5. ✅ **Consistency** - Same pattern as visa flow
6. ✅ **Debugging** - Comprehensive console logging

---

## Files Modified

### Holiday Components:
1. ✅ `src/components/common/DestinationCard.tsx`
2. ✅ `src/components/holidayspage/HolidayBookingCard.tsx`
3. ✅ `src/app/tour-details/[slug]/page.tsx`

### Visa Components (Previously):
1. ✅ `src/components/landingpage/VisaBookingCard.tsx`
2. ✅ `src/components/landingpage/VisaCard.tsx`
3. ✅ `src/components/visa/CountrySlider.tsx`
4. ✅ `src/app/apply-visa/page.tsx`

---

## Complete User Journey

### Journey 1: Browse → Select Holiday → View Details
1. User browses landing page or holidays page
2. Sees holiday cards in carousel
3. Clicks on a holiday card
4. System validates availability (background)
5. If valid → Instant redirect to tour details
6. Page loads instantly from cache
7. User sees full holiday information

### Journey 2: Search → View List
1. User types destination in search bar
2. Selects city/country from autocomplete
3. Clicks "Search" button
4. System validates packages exist
5. If valid → Redirect to holiday-list
6. List page shows matching packages
7. User can browse and select packages

### Journey 3: Error Handling
1. User clicks on unavailable package
2. System attempts validation
3. API returns no data
4. Error toast appears
5. User remains on current page
6. Can try different destination

---

## Performance Optimizations

### Caching Strategy:
- **First Click:** API call + cache store
- **Subsequent Access:** Instant load from cache
- **Direct URL:** Fallback to API

### Network Efficiency:
- Validation happens before navigation
- Prevents unnecessary page loads
- Reduces server requests for invalid data

---

## Error Recovery

### If validation fails:
1. User sees clear error message
2. Can try another package/destination
3. No broken page states
4. No need to go back

### If API is down:
1. Error toast appears
2. User notified of issue
3. Can retry later
4. No redirect to broken pages

---

## Future Enhancements

- [ ] Add loading spinner during validation
- [ ] Cache validation results to reduce API calls
- [ ] Add retry mechanism for failed requests
- [ ] Show partial data if available
- [ ] Add analytics for validation failures
- [ ] Implement background data prefetching
- [ ] Add data expiry for cached details

---

## Migration Impact

### No Breaking Changes:
- All existing functionality preserved
- SessionStorage keys unchanged
- API endpoints same
- Component interfaces unchanged

### Enhancements:
- Added validation layer
- Improved error handling
- Better user experience
- Comprehensive logging

---

## Testing Commands

### Browser Console Tests:

```javascript
// Test 1: Check cached holiday data
console.log('Holiday Details:', 
  JSON.parse(sessionStorage.getItem('holidayDetails') || '{}')
);

// Test 2: Clear cache to force API call
sessionStorage.removeItem('holidayDetails');

// Test 3: Monitor API calls
// Open Network tab and filter: "holiday-itinerary-details"
// Click a holiday card
// Should see the validation call

// Test 4: Simulate invalid data
sessionStorage.setItem('holidayId', 'invalid-id-999');
// Click a card - should show error toast
```

---

## Summary

### ✅ Implementation Complete:

**Landing Page:**
- Holiday card clicks → Validated → Redirect or Error

**Holidays Page:**  
- Holiday card clicks → Validated → Redirect or Error
- Search functionality → Validated → Redirect or Error

**Tour Details Page:**
- Uses cached data (instant load)
- Fallback to API if needed

**All components now:**
- Validate before navigation
- Show clear error messages  
- Cache data for performance
- Include comprehensive logging
- Follow consistent patterns

The holiday flow now matches the visa flow implementation! 🎉

