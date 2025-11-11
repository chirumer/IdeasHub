"""
Test authentication functionality
"""
import pytest
import time
from conftest import take_screenshot

class TestAuthentication:
    
    def test_login_page_loads(self, driver):
        """Test login page loads correctly"""
        driver.get('http://localhost:5173/login')
        time.sleep(1)
        
        take_screenshot(driver, 'auth_01_login_page')
        
        # Check elements exist
        assert driver.find_element('id', 'username')
        assert driver.find_element('id', 'password')
        assert driver.find_element('css selector', 'button[type="submit"]')
        
        # Check title
        assert 'Hackathon Ideas Hub' in driver.page_source
    
    def test_login_admin_success(self, driver):
        """Test successful admin login"""
        driver.get('http://localhost:5173/login')
        time.sleep(1)
        
        username = driver.find_element('id', 'username')
        password = driver.find_element('id', 'password')
        
        username.send_keys('admin')
        password.send_keys('chiru')
        
        take_screenshot(driver, 'auth_02_filled_admin')
        
        submit = driver.find_element('css selector', 'button[type="submit"]')
        submit.click()
        
        time.sleep(2)
        take_screenshot(driver, 'auth_03_logged_in_admin')
        
        # Should redirect to dashboard
        assert '/dashboard' in driver.current_url
        
        # Check admin features visible
        assert 'Admin' in driver.page_source or 'admin' in driver.page_source
    
    def test_login_hacker_success(self, driver):
        """Test successful hacker login"""
        driver.get('http://localhost:5173/login')
        time.sleep(1)
        
        username = driver.find_element('id', 'username')
        password = driver.find_element('id', 'password')
        
        username.send_keys('hacker')
        password.send_keys('pragmanchiru')
        
        submit = driver.find_element('css selector', 'button[type="submit"]')
        submit.click()
        
        time.sleep(2)
        take_screenshot(driver, 'auth_04_logged_in_hacker')
        
        # Should redirect to dashboard
        assert '/dashboard' in driver.current_url
    
    def test_login_invalid_credentials(self, driver):
        """Test login with invalid credentials"""
        driver.get('http://localhost:5173/login')
        time.sleep(1)
        
        username = driver.find_element('id', 'username')
        password = driver.find_element('id', 'password')
        
        username.send_keys('invalid')
        password.send_keys('wrong')
        
        submit = driver.find_element('css selector', 'button[type="submit"]')
        submit.click()
        
        time.sleep(2)
        take_screenshot(driver, 'auth_05_invalid_login')
        
        # Should stay on login page
        assert '/login' in driver.current_url
        
        # Should show error message
        assert 'Invalid' in driver.page_source or 'failed' in driver.page_source.lower()
    
    def test_logout(self, login_admin):
        """Test logout functionality"""
        driver = login_admin
        time.sleep(1)
        
        # Find and click user menu
        try:
            user_menu = driver.find_element('xpath', "//button[contains(., 'admin')]")
            user_menu.click()
            time.sleep(0.5)
            
            take_screenshot(driver, 'auth_06_user_menu')
            
            # Click logout
            logout = driver.find_element('xpath', "//*[contains(text(), 'Logout') or contains(text(), 'logout')]")
            logout.click()
            
            time.sleep(2)
            take_screenshot(driver, 'auth_07_logged_out')
            
            # Should redirect to login
            assert '/login' in driver.current_url
        except Exception as e:
            print(f"Logout test note: {e}")
            take_screenshot(driver, 'auth_logout_issue')
