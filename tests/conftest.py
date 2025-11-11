"""
Pytest configuration and fixtures for integration tests
"""
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import os
import time

# Screen sizes to test
SCREEN_SIZES = {
    'desktop': (2560, 1600),  # Mac M1 Air 2020
    'laptop': (1920, 1080),   # Standard laptop
    'tablet': (768, 1024),    # iPad
    'mobile': (375, 812),     # iPhone X
}

@pytest.fixture(scope='session')
def screenshots_dir():
    """Create and return screenshots directory"""
    dir_path = os.path.join(os.path.dirname(__file__), 'screenshots')
    os.makedirs(dir_path, exist_ok=True)
    return dir_path

@pytest.fixture(params=SCREEN_SIZES.keys())
def driver(request, screenshots_dir):
    """Create WebDriver with specified screen size"""
    screen_name = request.param
    width, height = SCREEN_SIZES[screen_name]
    
    options = Options()
    options.add_argument(f'--window-size={width},{height}')
    options.add_argument('--disable-blink-features=AutomationControlled')
    
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(3)
    
    # Store screen name for test methods
    driver.screen_name = screen_name
    driver.screenshots_dir = screenshots_dir
    
    yield driver
    
    driver.quit()

@pytest.fixture
def login_admin(driver):
    """Login as admin user"""
    driver.get('http://localhost:5173/login')
    time.sleep(1)
    
    username = driver.find_element('id', 'username')
    password = driver.find_element('id', 'password')
    
    username.send_keys('admin')
    password.send_keys('chiru')
    
    submit = driver.find_element('css selector', 'button[type="submit"]')
    submit.click()
    
    # Wait for redirect to dashboard
    time.sleep(2)
    assert '/dashboard' in driver.current_url
    
    return driver

@pytest.fixture
def login_hacker(driver):
    """Login as hacker user"""
    driver.get('http://localhost:5173/login')
    time.sleep(1)
    
    username = driver.find_element('id', 'username')
    password = driver.find_element('id', 'password')
    
    username.send_keys('hacker')
    password.send_keys('pragmanchiru')
    
    submit = driver.find_element('css selector', 'button[type="submit"]')
    submit.click()
    
    # Wait for redirect to dashboard
    time.sleep(2)
    assert '/dashboard' in driver.current_url
    
    return driver

def take_screenshot(driver, name):
    """Helper function to take screenshot"""
    screen = driver.screen_name
    filepath = os.path.join(driver.screenshots_dir, f"{screen}_{name}.png")
    driver.save_screenshot(filepath)
    print(f"  📸 Screenshot: {screen}_{name}.png")
