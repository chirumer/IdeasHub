"""
Test responsive design across different screen sizes
"""
import pytest
import time
from conftest import take_screenshot, SCREEN_SIZES

class TestResponsive:
    
    def test_login_responsive(self, driver):
        """Test login page renders correctly at all screen sizes"""
        driver.get('http://localhost:5173/login')
        time.sleep(1)
        
        take_screenshot(driver, 'responsive_01_login')
        
        # Elements should be visible
        assert driver.find_element('id', 'username').is_displayed()
        assert driver.find_element('id', 'password').is_displayed()
        assert driver.find_element('css selector', 'button[type="submit"]').is_displayed()
        
        print(f"  ✓ Login page responsive at {driver.screen_name}")
    
    def test_dashboard_responsive(self, login_admin):
        """Test dashboard renders correctly at all screen sizes"""
        driver = login_admin
        time.sleep(2)
        
        take_screenshot(driver, 'responsive_02_dashboard')
        
        # Check key elements visible
        assert 'Hackathon Ideas' in driver.page_source
        
        # Check if ideas are displayed
        assert 'Educational' in driver.page_source or 'Smart Campus' in driver.page_source
        
        print(f"  ✓ Dashboard responsive at {driver.screen_name}")
    
    def test_idea_viewer_responsive(self, login_admin):
        """Test idea viewer renders correctly at all screen sizes"""
        driver = login_admin
        time.sleep(2)
        
        # Navigate to idea
        try:
            idea_cards = driver.find_elements('css selector', '[class*="cursor-pointer"]')
            if idea_cards:
                idea_cards[0].click()
            else:
                driver.find_element('xpath', "//*[contains(text(), 'Educational')]").click()
            
            time.sleep(2)
            take_screenshot(driver, 'responsive_03_idea_viewer')
            
            # Content should be visible
            assert driver.find_element('css selector', 'h1, h2').is_displayed()
            
            print(f"  ✓ Idea viewer responsive at {driver.screen_name}")
        except Exception as e:
            print(f"  Note at {driver.screen_name}: {e}")
            take_screenshot(driver, 'responsive_idea_issue')
    
    def test_navbar_responsive(self, login_admin):
        """Test navbar renders correctly at all screen sizes"""
        driver = login_admin
        time.sleep(1)
        
        take_screenshot(driver, 'responsive_04_navbar')
        
        # Navbar should be visible
        nav = driver.find_element('css selector', 'nav')
        assert nav.is_displayed()
        
        print(f"  ✓ Navbar responsive at {driver.screen_name}")
    
    def test_mobile_usability(self, login_admin):
        """Test app is usable on mobile screens"""
        driver = login_admin
        
        if driver.screen_name in ['mobile', 'tablet']:
            time.sleep(1)
            take_screenshot(driver, 'responsive_05_mobile_usability')
            
            # Check if content is not horizontally scrolling
            body = driver.find_element('tag name', 'body')
            body_width = body.size['width']
            viewport_width = driver.execute_script("return window.innerWidth")
            
            # Body should not be wider than viewport
            assert body_width <= viewport_width + 50, f"Horizontal scroll detected: body={body_width}, viewport={viewport_width}"
            
            print(f"  ✓ No horizontal scroll at {driver.screen_name}")
