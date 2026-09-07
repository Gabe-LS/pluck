// Detect dark theme
(function() {
  var isDark = false;
  try {
    var tn = chrome.devtools && chrome.devtools.panels && chrome.devtools.panels.themeName;
    if (tn === "dark") isDark = true;
  } catch(e) {}
  if (!isDark && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    isDark = true;
  }
  if (isDark) document.body.classList.add("dark");
})();

// Auto-reload when extension is updated at chrome://extensions
setInterval(function() {
  try { chrome.runtime.getManifest(); }
  catch(e) { location.reload(); }
}, 2000);

var noSelection = document.getElementById("no-selection");
var elementInfo = document.getElementById("element-info");
var elementLabel = document.getElementById("element-label");
var preview = document.getElementById("preview");
var btnCopy = document.getElementById("btn-copy");
var btnCopyMd = document.getElementById("btn-copy-md");
var optChildren = document.getElementById("opt-children");
var optDimensions = document.getElementById("opt-dimensions");
var optHighlight = document.getElementById("opt-highlight");
var optPreview = document.getElementById("opt-preview");
var optPreviewMode = document.getElementById("opt-preview-mode");
var optWrap = document.getElementById("opt-wrap");
var wrapLabel = document.getElementById("wrap-label");

var cachedResult = null;
var debounceTimer = null;

function showError(msg) {
  noSelection.textContent = "Error: " + msg;
  noSelection.style.display = "block";
  noSelection.style.color = "#e53935";
  elementLabel.style.display = "none";
  elementInfo.style.display = "none";
}

function getOptions() {
  return {
    includeChildren: optChildren.checked,
    includeDimensions: optDimensions.checked
  };
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatLabel(info) {
  var html = '<span class="tag">' + escHtml(info.tag) + '</span>';
  if (info.id) html += '<span class="id">#' + escHtml(info.id) + '</span>';
  if (info.classes) {
    var cls = String(info.classes).trim().split(/\s+/);
    for (var i = 0; i < cls.length; i++) {
      if (cls[i]) html += '<span class="cls">.' + escHtml(cls[i]) + '</span>';
    }
  }
  return html;
}

function indentHtml(html, size) {
  var indent = 0;
  var pad = ' '.repeat(size || 2);
  var result = [];
  var re = /(<\/[^>]+>|<[^/][^>]*\/\s*>|<[^/][^>]*>|[^<]+)/g;
  var match;
  var voids = {br:1,hr:1,img:1,input:1,meta:1,link:1,col:1,embed:1,source:1,track:1,wbr:1,area:1,base:1,param:1};

  while ((match = re.exec(html)) !== null) {
    var token = match[0].trim();
    if (!token) continue;

    if (token.indexOf('</') === 0) {
      indent = Math.max(0, indent - 1);
      result.push(pad.repeat(indent) + token);
    } else if (token.charAt(0) === '<') {
      result.push(pad.repeat(indent) + token);
      var tagName = token.match(/^<([a-z0-9-]+)/i);
      if (tagName && !voids[tagName[1].toLowerCase()] && token.indexOf('/>') === -1) {
        indent++;
      }
    } else {
      result.push(pad.repeat(indent) + token);
    }
  }
  return result.join('\n');
}

function renderPreview(html) {
  var mode = optPreviewMode.value;
  preview.classList.toggle('rendered', mode === 'md-rendered');

  if (mode === 'md-rendered') {
    var md = turndownService.turndown(html);
    return marked.parse(md);
  }
  if (mode === 'md') {
    var md = turndownService.turndown(html);
    var highlighted = Prism.highlight(md, Prism.languages.markdown || Prism.languages.markup, 'markdown');
    return '<pre class="language-markdown"><code class="language-markdown">' + highlighted + '</code></pre>';
  }
  var formatted = indentHtml(html, 3);
  var highlighted = Prism.highlight(formatted, Prism.languages.markup, 'markup');
  return '<pre class="language-markup"><code class="language-markup">' + highlighted + '</code></pre>';
}

function updateUI(result) {
  if (!result) {
    noSelection.style.display = "block";
    noSelection.style.color = "";
    noSelection.textContent = "Select an element in the Elements panel";
    elementLabel.style.display = "none";
    elementInfo.style.display = "none";
    cachedResult = null;
    return;
  }
  cachedResult = result;
  noSelection.style.display = "none";
  elementLabel.style.display = "block";
  elementLabel.innerHTML = formatLabel(result);
  elementInfo.style.display = "flex";
  if (optPreview.checked) {
    preview.style.display = "block";
    refreshPreview();
  } else {
    preview.style.display = "none";
  }
}

function extract() {
  try {
    var code = buildExtractorCode(getOptions());
    chrome.devtools.inspectedWindow.eval(code, function(result, exceptionInfo) {
      if (exceptionInfo) {
        var msg = exceptionInfo.value || exceptionInfo.description || JSON.stringify(exceptionInfo);
        console.error("Extraction error:", msg);
        showError(msg);
        return;
      }
      updateUI(result);
    });
  } catch (e) {
    showError(e.message);
  }
}

function debouncedExtract() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(function() {
    extract();
    if (optHighlight.checked) updateHighlight();
  }, 150);
}

var activeBtn = null;

function copyToClipboard(text, btn) {
  activeBtn = btn;
  chrome.devtools.inspectedWindow.eval(
    "copy(" + JSON.stringify(text) + ")",
    function(result, exceptionInfo) {
      if (exceptionInfo) {
        fallbackCopy(text);
        return;
      }
      if (activeBtn) flashButton(activeBtn);
    }
  );
}

function fallbackCopy(text) {
  var ta = document.createElement("textarea");
  ta.value = text;
  ta.style.cssText = "position:fixed;left:-9999px;top:-9999px";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    if (activeBtn) flashButton(activeBtn);
  } catch (e) {
    console.error("Copy failed:", e);
  }
  document.body.removeChild(ta);
}

function flashButton(btn, msg) {
  var okSpan = btn.querySelector('.btn-ok');
  if (okSpan) okSpan.textContent = msg || 'Copied!';
  btn.classList.add('success');
  setTimeout(function() { btn.classList.remove('success'); }, 1200);
}

var turndownService = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', emDelimiter: '_' });

var copyLabels = { html: 'Copy as HTML + inline CSS', md: 'Copy as Markdown (MD)' };
var downloadLabels = { html: 'Download as .txt', md: 'Download as .md' };
var altDown = false;

function updateButtonLabels() {
  btnCopy.querySelector('.btn-label').textContent = altDown ? downloadLabels.html : copyLabels.html;
  btnCopyMd.querySelector('.btn-label').textContent = altDown ? downloadLabels.md : copyLabels.md;
}

document.addEventListener("keydown", function(e) {
  if (e.key === "Alt" && !altDown) { altDown = true; updateButtonLabels(); }
});
document.addEventListener("keyup", function(e) {
  if (e.key === "Alt" && altDown) { altDown = false; updateButtonLabels(); }
});
window.addEventListener("blur", function() {
  if (altDown) { altDown = false; updateButtonLabels(); }
});

function downloadFile(content, filename) {
  var blob = new Blob([content], { type: 'text/plain' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function getFilename() {
  if (!cachedResult) return 'element';
  var name = cachedResult.tag;
  if (cachedResult.id) name += '-' + cachedResult.id;
  else if (cachedResult.classes) name += '-' + String(cachedResult.classes).trim().split(/\s+/)[0];
  return name.replace(/[^a-z0-9_-]/gi, '_');
}

btnCopy.addEventListener("click", function() {
  if (!cachedResult) return;
  if (altDown) {
    downloadFile(cachedResult.html, getFilename() + '.txt');
    flashButton(btnCopy, 'Downloaded!');
  } else {
    copyToClipboard(cachedResult.html, btnCopy);
  }
});

btnCopyMd.addEventListener("click", function() {
  if (!cachedResult) return;
  var md = turndownService.turndown(cachedResult.html);
  if (altDown) {
    downloadFile(md, getFilename() + '.md');
    flashButton(btnCopyMd, 'Downloaded!');
  } else {
    copyToClipboard(md, btnCopyMd);
  }
});

optChildren.addEventListener("change", extract);
optDimensions.addEventListener("change", extract);

function updateHighlight() {
  chrome.devtools.inspectedWindow.eval(
    "(function(){" +
    "  if(window.__copyHlRaf){cancelAnimationFrame(window.__copyHlRaf);window.__copyHlRaf=null}" +
    "  if(window.__copyHlEl){window.__copyHlEl.remove();window.__copyHlEl=null}" +
    "  window.__copyHlTarget=null;" +
    "})()"
  );
  if (optHighlight.checked) {
    chrome.devtools.inspectedWindow.eval(
      "(function(){" +
      "  if(!$0)return;" +
      "  var gap=3;" +
      "  var el=document.createElement('div');" +
      "  el.style.cssText='position:absolute;pointer-events:none;border:1.5px solid #1a73e8;border-radius:2px;background:rgba(26,115,232,0.1);transition:opacity 0.15s';" +
      "  document.documentElement.appendChild(el);" +
      "  window.__copyHlEl=el;" +
      "  window.__copyHlTarget=$0;" +
      "  function sync(){" +
      "    if(!window.__copyHlTarget||!window.__copyHlEl){return}" +
      "    var r=window.__copyHlTarget.getBoundingClientRect();" +
      "    var s=document.documentElement;" +
      "    el.style.top=(r.top+window.scrollY-gap)+'px';" +
      "    el.style.left=(r.left+window.scrollX-gap)+'px';" +
      "    el.style.width=(r.width+gap*2)+'px';" +
      "    el.style.height=(r.height+gap*2)+'px';" +
      "    window.__copyHlRaf=requestAnimationFrame(sync);" +
      "  }" +
      "  sync();" +
      "})()"
    );
  }
}

optHighlight.addEventListener("change", updateHighlight);

window.addEventListener("beforeunload", function() {
  chrome.devtools.inspectedWindow.eval(
    "(function(){" +
    "  if(window.__copyHlRaf){cancelAnimationFrame(window.__copyHlRaf);window.__copyHlRaf=null}" +
    "  if(window.__copyHlEl){window.__copyHlEl.remove();window.__copyHlEl=null}" +
    "  window.__copyHlTarget=null;" +
    "})()"
  );
});
function refreshPreview() {
  if (!optPreview.checked || !cachedResult) return;
  preview.innerHTML = renderPreview(cachedResult.html);
  applyWrap();
}

optPreview.addEventListener("change", function() {
  var show = optPreview.checked;
  optPreviewMode.style.visibility = show ? "visible" : "hidden";
  wrapLabel.style.visibility = show ? "visible" : "hidden";
  if (cachedResult) {
    preview.style.display = show ? "block" : "none";
    if (show) refreshPreview();
  }
});

optPreviewMode.addEventListener("change", function() {
  wrapLabel.style.visibility = (optPreviewMode.value === 'md-rendered') ? 'hidden' : 'visible';
  refreshPreview();
});

optWrap.addEventListener("change", applyWrap);


function applyWrap() {
  var code = preview.querySelector("code");
  if (!code) return;

  if (!optWrap.checked) {
    if (cachedResult) preview.innerHTML = renderPreview(cachedResult.html);
    return;
  }

  if (optPreviewMode.value === 'md') {
    code.style.setProperty("white-space", "pre-wrap", "important");
    code.style.setProperty("word-break", "break-word", "important");
    return;
  }

  // HTML mode: hanging indent per line
  var lines = code.innerHTML.split('\n');
  code.innerHTML = lines.map(function(line) {
    var stripped = line.replace(/^ +/, '');
    var indent = line.length - stripped.length;
    if (indent === 0) return '<span class="wl">' + line + '</span>';
    return '<span class="wl" style="padding-left:' + indent + 'ch;text-indent:-' + indent + 'ch">' + line + '</span>';
  }).join('');

  code.style.setProperty("white-space", "pre-wrap", "important");
  code.style.setProperty("word-break", "break-all", "important");
}

try {
  if (typeof chrome !== "undefined" && chrome.devtools && chrome.devtools.panels) {
    chrome.devtools.panels.elements.onSelectionChanged.addListener(debouncedExtract);
    extract();
  } else {
    showError("chrome.devtools API not available in this context");
  }
} catch (e) {
  showError("Init failed: " + e.message);
}
