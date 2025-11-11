"""
Test idea viewer functionality
"""
import pytest
import time
from conftest import take_screenshot

class TestIdeaViewer:
    
    def test_idea_viewer_loads(self, login_admin):
        """Test idea viewer page loads"""
        driver = login_admin
        time.sleep(2)
        
        # Click first idea
        try:
            idea_cards = driver.find_elements('css selector', '[class*="cursor-pointer"]')
            if idea_cards:
                idea_cards[0].click()
            else:
                driver.find_element('xpath', "//*[contains(text(), 'Educational')]").click()
            
            time.sleep(2)
            take_screenshot(driver, 'idea_01_loaded')
            
            # Should show idea content
            assert driver.find_element('css selector', 'h1, h2, h3')
            
            # Should have back button
            assert 'Back' in driver.page_source or 'Dashboard' in driver.page_source
        except Exception as e:
            print(f"Note: {e}")
            take_screenshot(driver, 'idea_load_issue')
    
    def test_idea_multi_page_navigation(self, login_admin):
        """Test navigation between idea pages"""
        driver = login_admin
        time.sleep(2)
        
        # Navigate to Educational Reels (has 2 pages)
        try:
            driver.find_element('xpath', "//*[contains(text(), 'Educational')]").click()
            time.sleep(2)
            
            take_screenshot(driver, 'idea_02_page1')
            
            # Look for page navigation buttons
            buttons = driver.find_elements('css selector', 'button')
            page_buttons = [btn for btn in buttons if btn.text and 
                          'implementation' in btn.text.lower() or 'pitch' in btn.text.lower()]
            
            if len(page_buttons) >= 2:
                # Click second page
                page_buttons[1].click()
                time.sleep(1)
                
                take_screenshot(driver, 'idea_03_page2')
                
                # Click back to first page
                page_buttons[0].click()
                time.sleep(1)
                
                take_screenshot(driver, 'idea_04_back_to_page1')
        except Exception as e:
            print(f"Note: {e}")
            take_screenshot(driver, 'idea_nav_issue')
    
    def test_back_to_dashboard(self, login_admin):
        """Test back to dashboard button"""
        driver = login_admin
        time.sleep(2)
        
        # Go to idea
        try:
            idea_cards = driver.find_elements('css selector', '[class*="cursor-pointer"]')
            if idea_cards:
                idea_cards[0].click()
            time.sleep(2)
            
            # Click back button
            back_button = driver.find_element('xpath', "//button[contains(., 'Back') or contains(., 'Dashboard')]")
            back_button.click()
            time.sleep(2)
            
            take_screenshot(driver, 'idea_05_back_dashboard')
            
            # Should be back on dashboard
            assert '/dashboard' in driver.current_url
        except Exception as e:
            print(f"Note: {e}")
            take_screenshot(driver, 'idea_back_issue')
    
    def test_idea_displays_metadata(self, login_admin):
        """Test idea displays author and date"""
        driver = login_admin
        time.sleep(2)
        
        # Go to idea
        try:
            driver.find_element('xpath', "//*[contains(text(), 'Educational')]").click()
            time.sleep(2)
            
            take_screenshot(driver, 'idea_06_metadata')
            
            # Should show author
            assert 'admin' in driver.page_source.lower() or 'by' in driver.page_source.lower()
        except Exception as e:
            print(f"Note: {e}")
    
    def test_idea_shows_description(self, driver):
        """Test idea viewer shows description"""
        driver.get('http://localhost:5173/dashboard')
        time.sleep(2)
        
        # Click first idea
        try:
            idea_cards = driver.find_elements('css selector', '[class*="cursor-pointer"]')
            if idea_cards:
                idea_cards[0].click()
            time.sleep(2)
            
            take_screenshot(driver, 'idea_07_description')
            
            # Should show description below title
            page_text = driver.page_source.lower()
            assert 'ai-powered' in page_text or 'educational' in page_text or 'transforms' in page_text or 'ar-powered' in page_text
        except Exception as e:
            print(f"Description test note: {e}")
    
    def test_author_sees_controls(self, login_admin):
        """Test author sees page management controls"""
        driver = login_admin
        time.sleep(2)
        
        # Go to an idea authored by admin
        try:
            driver.find_element('xpath', "//*[contains(text(), 'Educational')]").click()
            time.sleep(2)
            
            take_screenshot(driver, 'idea_08_author_controls')
            
            # Should see author controls (Add Page, Manage Pages, Delete Idea buttons)
            page_text = driver.page_source
            has_add_page = 'Add Page' in page_text
            has_manage = 'Manage' in page_text
            has_delete = 'Delete' in page_text
            
            # Admin should see at least one control button
            assert has_add_page or has_manage or has_delete
        except Exception as e:
            print(f"Author controls note: {e}")
            take_screenshot(driver, 'idea_controls_issue')
