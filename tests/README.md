# Integration Tests

Comprehensive integration test suite for Hackathon Ideas Hub using Selenium and Pytest.

## Test Coverage

### Authentication Tests (`test_authentication.py`)
- Login page loading
- Admin login success
- Hacker login success
- Invalid credentials handling
- Logout functionality

### Dashboard Tests (`test_dashboard.py`)
- Dashboard loading
- Ideas display
- Search functionality
- Search with no results
- Navigation to idea viewer
- Role-based visibility (hacker vs admin)

### Idea Viewer Tests (`test_idea_viewer.py`)
- Idea viewer loading
- Multi-page navigation
- Back to dashboard
- Metadata display (author, date)

### UI Features Tests (`test_ui_features.py`)
- Theme switching (6 themes)
- Browse ideas dropdown
- AI chat modal
- Upload modal
- Logo navigation

### Responsive Tests (`test_responsive.py`)
- Login page responsiveness
- Dashboard responsiveness
- Idea viewer responsiveness
- Navbar responsiveness
- Mobile usability (no horizontal scroll)

## Screen Sizes Tested

Each test runs on **4 different screen sizes**:
- **Desktop**: 2560x1600 (Mac M1 Air 2020)
- **Laptop**: 1920x1080 (Standard laptop)
- **Tablet**: 768x1024 (iPad)
- **Mobile**: 375x812 (iPhone X)

## Installation

```bash
# Install test dependencies
cd tests
pip3 install -r requirements.txt
```

## Running Tests

```bash
# Run all tests
pytest -v

# Run specific test file
pytest test_authentication.py -v

# Run tests for specific screen size only
pytest -k desktop -v
pytest -k mobile -v

# Run with detailed output
pytest -v -s

# Generate HTML report
pytest --html=report.html --self-contained-html
```

## Test Structure

```
tests/
├── conftest.py              # Pytest configuration and fixtures
├── test_authentication.py    # Authentication tests
├── test_dashboard.py         # Dashboard and browsing tests
├── test_idea_viewer.py       # Idea viewing tests
├── test_ui_features.py       # UI components tests
├── test_responsive.py        # Responsive design tests
├── screenshots/              # Auto-generated screenshots
├── requirements.txt          # Python dependencies
└── README.md                 # This file
```

## Prerequisites

1. **Backend and frontend must be running:**
   ```bash
   # From project root
   npm run dev
   ```

2. **Chrome browser installed**

3. **ChromeDriver** (automatically managed by Selenium)

## Screenshots

Screenshots are automatically saved to `tests/screenshots/` directory with naming format:
```
{screen_size}_{test_name}.png
```

Example:
- `desktop_auth_01_login_page.png`
- `mobile_dashboard_02_with_ideas.png`
- `tablet_responsive_03_idea_viewer.png`

## Fixtures

### `driver`
Parametrized WebDriver fixture that runs tests on all screen sizes.

### `login_admin`
Pre-authenticated driver logged in as admin user.

### `login_hacker`
Pre-authenticated driver logged in as hacker user.

### `screenshots_dir`
Path to screenshots directory.

## Helper Functions

### `take_screenshot(driver, name)`
Captures screenshot with automatic naming based on screen size.

## Test Output

Tests provide detailed output including:
- ✓ Pass/fail status for each test
- 📸 Screenshot notifications
- Screen size information
- Error messages with context

## Continuous Integration

To run in CI/CD pipeline:

```bash
# Headless mode (add to conftest.py options)
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
```

## Troubleshooting

### Tests fail with "connection refused"
- Ensure backend is running on port 3001
- Ensure frontend is running on port 5173

### ChromeDriver issues
- Update Chrome browser to latest version
- Selenium will auto-download compatible ChromeDriver

### Screenshots not saving
- Check write permissions for `tests/screenshots/` directory

### Timeouts
- Increase `time.sleep()` values if your machine is slower
- Adjust `driver.implicitly_wait()` in conftest.py

## Coverage Summary

- **Total Tests**: 25+ individual tests
- **Screen Sizes**: 4 variations each
- **Total Test Runs**: 100+ test executions
- **Features Covered**: All major application features
- **Responsive Testing**: Complete coverage

## Best Practices

1. **Run tests frequently** during development
2. **Review screenshots** after test runs
3. **Keep tests independent** - each test can run standalone
4. **Update tests** when adding new features
5. **Use fixtures** for common setup tasks

## Future Enhancements

- [ ] Add performance testing
- [ ] Add accessibility testing (WCAG compliance)
- [ ] Add visual regression testing
- [ ] Add API endpoint testing
- [ ] Add load testing for backend
