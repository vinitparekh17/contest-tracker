import puppeteer from "puppeteer";

/**
 * This function fetches upcoming contests from CodeChef using Puppeteer.
 * @returns {Promise<Array<{ title: string, startTime: string, duration: string, url: string }>>}
 */
export async function fetchCodeChefContests() {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--disable-gpu']
  });
  
  const page = await browser.newPage();
  
  try {
    page.setDefaultTimeout(60000);
    
    // Enable request interception for better performance
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      // Block unnecessary resources to speed up loading
      const resourceType = request.resourceType();
      if (resourceType === 'image' || resourceType === 'font' || resourceType === 'media') {
        request.abort();
      } else {
        request.continue();
      }
    });
    
    // Set viewport to ensure consistent rendering
    await page.setViewport({ width: 1366, height: 768 });
    
    console.log("Navigating to CodeChef contests page...");
    await page.goto("https://www.codechef.com/contests", { 
      waitUntil: "networkidle2", // Wait until network is idle
      timeout: 60000 
    });
    
    console.log("Waiting for content to load...");
    
    // Wait for the React app to initialize
    await page.waitForSelector("#root div", { visible: true });
    
    // Sleep briefly to allow React to render
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Scroll more gradually and wait between scrolls
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        const totalHeight = document.body.scrollHeight;
        let scrolled = 0;
        const distance = 100;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          scrolled += distance;
          
          if (scrolled >= totalHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
    
    // Wait for contest tables to appear
    console.log("Looking for contest tables...");
    
    // Try different selectors since the page structure might have changed
    const possibleTableSelectors = [
      "table.MuiTable-root tbody tr",
      ".MuiTableBody-root tr",
      "div[role='table'] div[role='rowgroup'] div[role='row']",
      ".contest-table tbody tr"
    ];
    
    let selectedSelector = null;
    
    for (const selector of possibleTableSelectors) {
      console.log(`Trying selector: ${selector}`);
      const hasElements = await page.evaluate((sel) => {
        return document.querySelectorAll(sel).length > 0;
      }, selector);
      
      if (hasElements) {
        selectedSelector = selector;
        console.log(`Found elements with selector: ${selector}`);
        break;
      }
    }
    
    if (!selectedSelector) {
      console.log("Could not find contest elements with known selectors.");
      console.log("Taking screenshot for debugging...");
      await page.screenshot({ path: 'codechef-debug.png' });
      throw new Error("Contest elements not found");
    }
    
    // Extract contest details with the working selector
    const contests = await page.evaluate((selector) => {
      const rows = Array.from(document.querySelectorAll(selector));
      return rows.map(row => {
        // For standard table structure
        if (row.querySelectorAll("td").length > 0) {
          const cols = row.querySelectorAll("td");
          if (cols.length < 4) return null;
          
          return {
            title: cols[1]?.innerText?.trim() || "Unknown",
            startTime: cols[2]?.innerText?.trim() || "Unknown",
            duration: cols[3]?.innerText?.trim() || "Unknown",
            url: `${cols[1]?.querySelector("a")?.getAttribute("href") || "https://www.codechef.com/contests"}`
          };
        } 
        // For div-based table structure
        else {
          const cells = Array.from(row.children);
          if (cells.length < 4) return null;
          
          return {
            title: cells[1]?.innerText?.trim() || "Unknown",
            startTime: cells[2]?.innerText?.trim() || "Unknown",
            duration: cells[3]?.innerText?.trim() || "Unknown",
            link: `https://www.codechef.com${cells[1]?.querySelector("a")?.getAttribute("href") || ""}`
          };
        }
      }).filter(Boolean);
    }, selectedSelector);
    
    console.log(`Successfully extracted ${contests.length} contests`);
    return contests;
  } catch (error) {
    console.error("Error fetching CodeChef contests:", error);
    return [];
  } finally {
    await browser.close();
  }
};