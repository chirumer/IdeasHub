# Testing Guide for New Features

## ✅ Tests Updated

### 1. **test_dashboard.py** - Dashboard & Public Access Tests
**New Tests Added:**
- `test_dashboard_public_access` - Verifies dashboard loads without login
- `test_dashboard_shows_descriptions` - Checks descriptions appear on idea cards

**Updated Tests:**
- `test_dashboard_loads` - Now tests with logged-in user
- `test_dashboard_displays_ideas` - Existing functionality preserved
- `test_dashboard_search` - Existing functionality preserved
- `test_dashboard_search_no_results` - Existing functionality preserved

### 2. **test_ui_features.py** - UI Component Tests
**Tests Removed:**
- `test_ai_chat_modal` - AI Chat feature removed

**New Tests Added:**
- `test_login_modal` - Tests login modal opens from navbar
- `test_ai_generate_tab` - Tests AI generation tab in create modal
- `test_upload_zip_tab` - Tests Upload ZIP tab in create modal

**Updated Tests:**
- `test_browse_ideas_dropdown` - Now checks for descriptions in dropdown
- `test_upload_modal` → `test_create_modal` - Renamed, tests both tabs
- `test_logo_navigation` - Preserved

**Existing Tests:**
- `test_theme_switching` - Preserved

### 3. **test_idea_viewer.py** - Idea Viewer Tests
**New Tests Added:**
- `test_idea_shows_description` - Verifies description displays in viewer
- `test_author_sees_controls` - Tests author controls (Add Page, Manage Pages, Delete Idea)

**Existing Tests:**
- `test_idea_viewer_loads` - Preserved
- `test_idea_multi_page_navigation` - Preserved
- `test_back_to_dashboard` - Preserved
- `test_idea_displays_metadata` - Preserved

### 4. **test_authentication.py** - No changes needed
Login still works, just accessible via modal now.

### 5. **test_responsive.py** - No changes needed
Responsive design tests still valid.

---

## 🚀 Running the Tests

### Prerequisites
1. Servers must be running:
   ```bash
   cd "/Users/chiru/Desktop/Hack Ideas"
   ./start.sh
   ```

2. Verify servers are up:
   - Backend: http://localhost:3001
   - Frontend: http://localhost:5173

### Run All Tests
```bash
cd tests
python3 -m pytest -v
```

### Run Specific Test Files
```bash
# Dashboard tests (public access, descriptions)
python3 -m pytest test_dashboard.py -v

# UI features (login modal, browse dropdown)
python3 -m pytest test_ui_features.py -v

# Idea viewer (descriptions, author controls)
python3 -m pytest test_idea_viewer.py -v

# Authentication (existing tests)
python3 -m pytest test_authentication.py -v

# Responsive design (existing tests)
python3 -m pytest test_responsive.py -v
```

### Run Individual Tests
```bash
# Test public access
python3 -m pytest test_dashboard.py::TestDashboard::test_dashboard_public_access -v

# Test descriptions on dashboard
python3 -m pytest test_dashboard.py::TestDashboard::test_dashboard_shows_descriptions -v

# Test login modal
python3 -m pytest test_ui_features.py::TestUIFeatures::test_login_modal -v

# Test author controls
python3 -m pytest test_idea_viewer.py::TestIdeaViewer::test_author_sees_controls -v
```

### Run with Screenshots
```bash
# Screenshots are automatically saved to tests/screenshots/
python3 -m pytest -v --tb=short
```

### Run Tests for Specific Screen Size
```bash
# Desktop only
python3 -m pytest -v -k "desktop"

# Mobile only
python3 -m pytest -v -k "mobile"
```

---

## 📊 Expected Test Results

### New Features to Verify:

#### ✅ Public Access
- Dashboard loads without login
- Ideas are visible to non-authenticated users
- Login button appears in navbar

#### ✅ Descriptions
- Shown on dashboard cards
- Shown in browse dropdown
- Shown at top of idea viewer page

#### ✅ Login Modal
- Opens from navbar Login button
- Shows username/password fields
- Closes on successful login

#### ✅ Author Controls (when logged in as admin)
- "Add Page" button visible on author's ideas
- "Manage Pages" button visible
- "Delete Idea" button visible
- Buttons NOT visible on other users' ideas

#### ✅ No AI Chat
- AI Chat button removed from navbar
- No AI Chat modal exists

---

## 🔍 Test Coverage Summary

| Feature | Test File | Test Function | Status |
|---------|-----------|---------------|--------|
| Public Access | test_dashboard.py | test_dashboard_public_access | ✅ New |
| Descriptions on Cards | test_dashboard.py | test_dashboard_shows_descriptions | ✅ New |
| Descriptions in Dropdown | test_ui_features.py | test_browse_ideas_dropdown | ✅ Updated |
| Description in Viewer | test_idea_viewer.py | test_idea_shows_description | ✅ New |
| Login Modal | test_ui_features.py | test_login_modal | ✅ New |
| Author Controls | test_idea_viewer.py | test_author_sees_controls | ✅ New |
| No AI Chat | test_ui_features.py | (removed test) | ✅ Updated |
| Create Modal (Upload renamed) | test_ui_features.py | test_create_modal | ✅ Updated |
| AI Generate Tab | test_ui_features.py | test_ai_generate_tab | ✅ New |
| Upload ZIP Tab | test_ui_features.py | test_upload_zip_tab | ✅ New |
| Existing Dashboard | test_dashboard.py | test_dashboard_loads | ✅ Updated |
| Existing Search | test_dashboard.py | test_dashboard_search | ✅ Preserved |
| Existing Viewer | test_idea_viewer.py | test_idea_viewer_loads | ✅ Preserved |
| Existing Auth | test_authentication.py | (all tests) | ✅ Preserved |
| Existing Responsive | test_responsive.py | (all tests) | ✅ Preserved |

---

## 🐛 Troubleshooting

### Servers Not Running
```bash
# Check if servers are up
curl http://localhost:3001/api/auth/me
curl http://localhost:5173

# If not, start them
cd "/Users/chiru/Desktop/Hack Ideas"
./stop.sh
./start.sh
```

### WebDriver Issues
```bash
# Update ChromeDriver
# Make sure Chrome and ChromeDriver versions match
chromedriver --version
google-chrome --version
```

### Port Already in Use
```bash
# Kill processes on ports
./stop.sh

# Or manually
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Test Failures
1. Check screenshots in `tests/screenshots/` folder
2. Verify servers are responding
3. Check browser console for errors
4. Run tests with verbose output: `pytest -vv --tb=long`

---

## 📸 Screenshots

Tests automatically save screenshots to `tests/screenshots/` with naming:
- `{test_name}_{screen_size}_{timestamp}.png`

Example:
- `dashboard_00_public_access_desktop_20251111_160530.png`

---

## ⏱️ Estimated Test Runtime

- **All tests**: ~5-8 minutes (4 screen sizes)
- **Single test file**: ~1-2 minutes (4 screen sizes)
- **Single test**: ~15-30 seconds (4 screen sizes)
- **Single test, single screen**: ~5 seconds

---

## 🎯 Quick Validation Commands

### Validate Public Access
```bash
python3 -m pytest test_dashboard.py::TestDashboard::test_dashboard_public_access -v
```

### Validate Descriptions
```bash
python3 -m pytest test_dashboard.py::TestDashboard::test_dashboard_shows_descriptions -v
python3 -m pytest test_idea_viewer.py::TestIdeaViewer::test_idea_shows_description -v
```

### Validate Login Modal
```bash
python3 -m pytest test_ui_features.py::TestUIFeatures::test_login_modal -v
```

### Validate Author Controls
```bash
python3 -m pytest test_idea_viewer.py::TestIdeaViewer::test_author_sees_controls -v
```

### Run Core New Features Only
```bash
python3 -m pytest -v -k "public_access or shows_description or login_modal or author_sees"
```

---

## ✅ All Tests Should Pass

All existing tests have been preserved and updated tests should pass with the new features.

**To verify everything works:**
```bash
cd "/Users/chiru/Desktop/Hack Ideas"
./start.sh
cd tests
python3 -m pytest -v
```

Expected result: All tests pass ✅

---

*Tests updated November 11, 2025*
*Covers all new features and maintains existing test coverage*
