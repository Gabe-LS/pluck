try {
  chrome.devtools.panels.elements.createSidebarPane("Pluck", function(sidebar) {
    if (chrome.runtime.lastError) {
      console.error("Copy HTML+CSS: createSidebarPane error:", chrome.runtime.lastError.message);
      return;
    }
    sidebar.setPage("sidebar.html");
  });
} catch (e) {
  console.error("Copy HTML+CSS: devtools.js error:", e.message);
}
