/**
 * Home Page Locators
 * Multiple selectors for finding Home element with fallbacks
 */

export const homePageLocators = {
  // Primary: accessibility id for Flutter content-desc
  homeByAccessibilityId: "~Home",

  // Primary: XPath with content-desc (most reliable)
  homeByXPath: '//android.view.View[@content-desc="Home"]',

  // Fallback 1: UIAutomator (works well with Appium)
  homeByUIAutomator: 'android=new UiSelector().description("Home")',

  // Fallback 2: BottomNavigationItemView if it's a tab
  homeBottomNav: '//android.widget.BottomNavigationItemView[@content-desc="Home"]',

  // Fallback 3: XPath with contains (case-sensitive)
  homeByContains: '//android.view.View[contains(@content-desc,"Home")]',

  // Fallback 4: Text-based
  homeByText: '//*[@text="Home"]',

  // Fallback 5: Case-insensitive version
  homeCaseInsensitive: '//*[contains(@content-desc, "home")]',

  // Additional: Icon-based if available
  homeButton: '(//android.view.View[@content-desc="Home"])[1]',

  // Check if logged in - Look for any Home screen indicator
  homeScreenIndicator: '//android.view.View[@resource-id="android:id/content"]',
};

/**
 * All selectors in order of preference
 */
export const HOME_SELECTORS_PRIORITY = [
  homePageLocators.homeByAccessibilityId,  // Fastest for content-desc
  homePageLocators.homeByUIAutomator,      // UiAutomator fallback
  homePageLocators.homeByXPath,            // Standard XPath
  homePageLocators.homeBottomNav,          // If it's bottom nav
  homePageLocators.homeByContains,         // Contains selector
  homePageLocators.homeByText,             // Text-based
  homePageLocators.homeCaseInsensitive,    // Case-insensitive
];
