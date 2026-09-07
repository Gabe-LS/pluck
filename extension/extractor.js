function buildExtractorCode(options) {
  const includeChildren = options.includeChildren !== false;
  const includeDimensions = !!options.includeDimensions;

  return `(function() {
  if (!$0) return null;

  var SKIP_PREFIXES = ['-webkit-', '-moz-', '-ms-', '-o-'];

  var SKIP_PROPS = {
    'animation': 1, 'animation-delay': 1, 'animation-direction': 1,
    'animation-duration': 1, 'animation-fill-mode': 1,
    'animation-iteration-count': 1, 'animation-name': 1,
    'animation-play-state': 1, 'animation-timing-function': 1,
    'animation-composition': 1, 'animation-range': 1,
    'animation-range-start': 1, 'animation-range-end': 1,
    'animation-timeline': 1,
    'transition': 1, 'transition-delay': 1, 'transition-duration': 1,
    'transition-property': 1, 'transition-timing-function': 1,
    'transition-behavior': 1,
    'will-change': 1, 'contain': 1,
    'contain-intrinsic-size': 1, 'contain-intrinsic-width': 1,
    'contain-intrinsic-height': 1, 'contain-intrinsic-block-size': 1,
    'contain-intrinsic-inline-size': 1, 'content-visibility': 1,
    'counter-increment': 1, 'counter-reset': 1, 'counter-set': 1,
    'scroll-behavior': 1,
    'scroll-margin-top': 1, 'scroll-margin-right': 1,
    'scroll-margin-bottom': 1, 'scroll-margin-left': 1,
    'scroll-padding-top': 1, 'scroll-padding-right': 1,
    'scroll-padding-bottom': 1, 'scroll-padding-left': 1,
    'scroll-snap-align': 1, 'scroll-snap-stop': 1, 'scroll-snap-type': 1,
    'overscroll-behavior-x': 1, 'overscroll-behavior-y': 1,
    'overscroll-behavior-block': 1, 'overscroll-behavior-inline': 1,
    'orphans': 1, 'widows': 1,
    'page-break-after': 1, 'page-break-before': 1, 'page-break-inside': 1,
    'break-after': 1, 'break-before': 1, 'break-inside': 1,
    'unicode-bidi': 1, 'writing-mode': 1,
    'perspective-origin': 1, 'transform-origin': 1,
    'box-sizing': 1, 'text-size-adjust': 1,
    'touch-action': 1, 'pointer-events': 1,
    'backface-visibility': 1, 'isolation': 1,
    'appearance': 1, 'user-select': 1,
    'image-rendering': 1, 'mix-blend-mode': 1, 'text-rendering': 1,
    'font-feature-settings': 1, 'font-kerning': 1,
    'font-variant-ligatures': 1, 'font-variant-caps': 1,
    'font-variant-numeric': 1, 'font-variant-east-asian': 1,
    'font-variant-alternates': 1, 'font-variant-position': 1,
    'font-variant-emoji': 1, 'font-variation-settings': 1,
    'font-synthesis': 1, 'font-synthesis-weight': 1,
    'font-synthesis-style': 1, 'font-synthesis-small-caps': 1,
    'font-optical-sizing': 1, 'font-size-adjust': 1,
    'font-language-override': 1,
    'text-decoration-skip-ink': 1,
    'text-underline-offset': 1, 'text-underline-position': 1,
    'block-size': 1, 'inline-size': 1,
    'min-block-size': 1, 'min-inline-size': 1,
    'max-block-size': 1, 'max-inline-size': 1,
    'inset-block-start': 1, 'inset-block-end': 1,
    'inset-inline-start': 1, 'inset-inline-end': 1,
    'margin-block-start': 1, 'margin-block-end': 1,
    'margin-inline-start': 1, 'margin-inline-end': 1,
    'padding-block-start': 1, 'padding-block-end': 1,
    'padding-inline-start': 1, 'padding-inline-end': 1,
    'border-block-start-width': 1, 'border-block-start-style': 1,
    'border-block-start-color': 1, 'border-block-end-width': 1,
    'border-block-end-style': 1, 'border-block-end-color': 1,
    'border-inline-start-width': 1, 'border-inline-start-style': 1,
    'border-inline-start-color': 1, 'border-inline-end-width': 1,
    'border-inline-end-style': 1, 'border-inline-end-color': 1,
    'print-color-adjust': 1, 'color-scheme': 1, 'forced-color-adjust': 1,
    'container-type': 1, 'container-name': 1,
    'resize': 1, 'zoom': 1, 'page': 1,
    'scrollbar-color': 1, 'scrollbar-width': 1, 'scrollbar-gutter': 1,
    'caret-shape': 1, 'caret-animation': 1, 'field-sizing': 1,
    'image-orientation': 1, 'interpolate-size': 1, 'overlay': 1,
    'view-transition-name': 1, 'view-transition-class': 1,
    'anchor-name': 1, 'position-anchor': 1,
    'math-depth': 1, 'math-style': 1, 'math-shift': 1,
    'ruby-position': 1, 'ruby-align': 1,
    'overflow-block': 1, 'overflow-inline': 1,
    'row-rule-color': 1
  };

  var SVG_PROPS = {
    'fill': 1, 'fill-opacity': 1, 'fill-rule': 1,
    'stroke': 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1,
    'stroke-linecap': 1, 'stroke-linejoin': 1, 'stroke-miterlimit': 1,
    'stroke-opacity': 1, 'stroke-width': 1,
    'marker-start': 1, 'marker-mid': 1, 'marker-end': 1,
    'clip-rule': 1, 'color-interpolation': 1, 'color-interpolation-filters': 1,
    'flood-color': 1, 'flood-opacity': 1, 'lighting-color': 1,
    'shape-rendering': 1, 'stop-color': 1, 'stop-opacity': 1,
    'text-anchor': 1, 'dominant-baseline': 1, 'alignment-baseline': 1,
    'baseline-shift': 1, 'baseline-source': 1, 'vector-effect': 1,
    'paint-order': 1, 'd': 1, 'cx': 1, 'cy': 1, 'r': 1,
    'rx': 1, 'ry': 1, 'x': 1, 'y': 1
  };

  var DIMENSION_PROPS = {
    'width': 1, 'height': 1, 'min-width': 1, 'min-height': 1,
    'max-width': 1, 'max-height': 1
  };

  var INHERITED = {
    'color': 1, 'font-family': 1, 'font-size': 1, 'font-style': 1,
    'font-variant': 1, 'font-weight': 1, 'font-stretch': 1,
    'line-height': 1, 'letter-spacing': 1, 'word-spacing': 1,
    'text-align': 1, 'text-indent': 1, 'text-shadow': 1,
    'text-transform': 1, 'text-wrap': 1, 'white-space': 1,
    'white-space-collapse': 1, 'word-break': 1, 'overflow-wrap': 1,
    'hyphens': 1, 'tab-size': 1,
    'visibility': 1, 'cursor': 1, 'direction': 1, 'quotes': 1,
    'list-style-type': 1, 'list-style-position': 1, 'list-style-image': 1,
    'border-collapse': 1, 'border-spacing': 1,
    'caption-side': 1, 'empty-cells': 1
  };

  var CURRENT_COLOR_PROPS = {
    'border-top-color': 1, 'border-right-color': 1,
    'border-bottom-color': 1, 'border-left-color': 1,
    'caret-color': 1, 'column-rule-color': 1,
    'outline-color': 1, 'text-decoration-color': 1,
    'text-emphasis-color': 1,
    '-webkit-text-fill-color': 1
  };

  var VOID_TAGS = {
    'AREA':1,'BASE':1,'BR':1,'COL':1,'EMBED':1,'HR':1,
    'IMG':1,'INPUT':1,'LINK':1,'META':1,'PARAM':1,
    'SOURCE':1,'TRACK':1,'WBR':1
  };

  var includeDimensions = ${includeDimensions};
  var includeChildren = ${includeChildren};

  // Create sandbox for baseline defaults
  var sandbox = null;
  var sandboxDoc = null;
  var useFallback = false;

  try {
    sandbox = document.createElement('iframe');
    sandbox.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:0;height:0;visibility:hidden;pointer-events:none';
    document.body.appendChild(sandbox);
    sandboxDoc = sandbox.contentDocument;
    if (!sandboxDoc) throw new Error('no contentDocument');
    sandboxDoc.open();
    sandboxDoc.write('<!DOCTYPE html><html><head></head><body></body></html>');
    sandboxDoc.close();
    if (!sandboxDoc.body) throw new Error('no body');
  } catch(e) {
    useFallback = true;
    if (sandbox && sandbox.parentNode) sandbox.parentNode.removeChild(sandbox);
    sandbox = null;
    sandboxDoc = null;
  }

  var baselineCache = {};

  // Attribute-aware baseline: <a href> has different defaults than <a>
  function getBaseline(tag, el) {
    var cacheKey = tag;
    var attrs = [];

    if (tag === 'A' && el.hasAttribute('href')) {
      attrs.push(['href', '#']);
      cacheKey += '[href]';
    }
    if (tag === 'INPUT') {
      var t = el.getAttribute('type') || 'text';
      attrs.push(['type', t]);
      cacheKey += '[type=' + t + ']';
    }
    if (el.hasAttribute('disabled')) {
      attrs.push(['disabled', '']);
      cacheKey += '[disabled]';
    }

    if (baselineCache[cacheKey]) return baselineCache[cacheKey];
    var defaults = {};

    var doc = (!useFallback && sandboxDoc) ? sandboxDoc : document;
    var ref = doc.createElement(tag);
    for (var a = 0; a < attrs.length; a++) ref.setAttribute(attrs[a][0], attrs[a][1]);
    if (useFallback) ref.style.cssText = 'position:absolute;visibility:hidden;left:-9999px;top:-9999px;pointer-events:none';
    (doc.body || doc).appendChild(ref);
    var cs = (useFallback ? getComputedStyle(ref) : doc.defaultView.getComputedStyle(ref));
    for (var i = 0; i < cs.length; i++) {
      var p = cs.item(i);
      defaults[p] = cs.getPropertyValue(p);
    }
    (ref.parentNode).removeChild(ref);

    baselineCache[cacheKey] = defaults;
    return defaults;
  }

  // Prefixed properties that have no unprefixed equivalent and must be kept
  var KEEP_PREFIXED = { '-webkit-text-fill-color': 1, '-webkit-background-clip': 1 };

  function shouldSkip(prop, el) {
    if (SKIP_PROPS[prop]) return true;
    if (!includeDimensions && DIMENSION_PROPS[prop]) return true;
    if (prop.indexOf('--') === 0) return true;
    // SVG properties: skip on non-SVG elements only
    if (SVG_PROPS[prop] && (!el || !el.namespaceURI || el.namespaceURI.indexOf('svg') === -1)) return true;
    if (KEEP_PREFIXED[prop]) return false;
    for (var i = 0; i < SKIP_PREFIXES.length; i++) {
      if (prop.indexOf(SKIP_PREFIXES[i]) === 0) return true;
    }
    return false;
  }

  function collapseTRBL(t, r, b, l) {
    if (t === r && r === b && b === l) return t;
    if (t === b && r === l) return t + ' ' + r;
    if (r === l) return t + ' ' + r + ' ' + b;
    return t + ' ' + r + ' ' + b + ' ' + l;
  }

  function reconstruct(props) {
    var result = {};
    var keys = Object.keys(props);
    var used = {};

    // Margin
    if (props['margin-top'] !== undefined && props['margin-right'] !== undefined &&
        props['margin-bottom'] !== undefined && props['margin-left'] !== undefined) {
      result['margin'] = collapseTRBL(props['margin-top'], props['margin-right'],
        props['margin-bottom'], props['margin-left']);
      used['margin-top'] = used['margin-right'] = used['margin-bottom'] = used['margin-left'] = 1;
    }

    // Padding
    if (props['padding-top'] !== undefined && props['padding-right'] !== undefined &&
        props['padding-bottom'] !== undefined && props['padding-left'] !== undefined) {
      result['padding'] = collapseTRBL(props['padding-top'], props['padding-right'],
        props['padding-bottom'], props['padding-left']);
      used['padding-top'] = used['padding-right'] = used['padding-bottom'] = used['padding-left'] = 1;
    }

    // Border (all 4 sides identical)
    var bt = props['border-top-width'], bs = props['border-top-style'], bc = props['border-top-color'];
    if (bt !== undefined && bs !== undefined && bc !== undefined &&
        bt === props['border-right-width'] && bt === props['border-bottom-width'] && bt === props['border-left-width'] &&
        bs === props['border-right-style'] && bs === props['border-bottom-style'] && bs === props['border-left-style'] &&
        bc === props['border-right-color'] && bc === props['border-bottom-color'] && bc === props['border-left-color']) {
      if (bs !== 'none') {
        result['border'] = bt + ' ' + bs + ' ' + bc;
      }
      used['border-top-width'] = used['border-top-style'] = used['border-top-color'] = 1;
      used['border-right-width'] = used['border-right-style'] = used['border-right-color'] = 1;
      used['border-bottom-width'] = used['border-bottom-style'] = used['border-bottom-color'] = 1;
      used['border-left-width'] = used['border-left-style'] = used['border-left-color'] = 1;
    }

    // Per-side border shorthands
    var sides = ['top', 'right', 'bottom', 'left'];
    for (var s = 0; s < sides.length; s++) {
      var side = sides[s];
      var sw = 'border-' + side + '-width', ss = 'border-' + side + '-style', sc = 'border-' + side + '-color';
      if (!used[sw] && props[sw] !== undefined && props[ss] !== undefined && props[sc] !== undefined) {
        if (props[ss] !== 'none') {
          result['border-' + side] = props[sw] + ' ' + props[ss] + ' ' + props[sc];
        }
        used[sw] = used[ss] = used[sc] = 1;
      }
    }

    // Border-radius
    if (props['border-top-left-radius'] !== undefined && props['border-top-right-radius'] !== undefined &&
        props['border-bottom-right-radius'] !== undefined && props['border-bottom-left-radius'] !== undefined) {
      result['border-radius'] = collapseTRBL(props['border-top-left-radius'], props['border-top-right-radius'],
        props['border-bottom-right-radius'], props['border-bottom-left-radius']);
      used['border-top-left-radius'] = used['border-top-right-radius'] = 1;
      used['border-bottom-right-radius'] = used['border-bottom-left-radius'] = 1;
    }

    // Outline
    if (props['outline-width'] !== undefined && props['outline-style'] !== undefined && props['outline-color'] !== undefined) {
      if (props['outline-style'] !== 'none') {
        result['outline'] = props['outline-width'] + ' ' + props['outline-style'] + ' ' + props['outline-color'];
      }
      used['outline-width'] = used['outline-style'] = used['outline-color'] = 1;
    }

    // Flex
    if (props['flex-grow'] !== undefined && props['flex-shrink'] !== undefined && props['flex-basis'] !== undefined) {
      result['flex'] = props['flex-grow'] + ' ' + props['flex-shrink'] + ' ' + props['flex-basis'];
      used['flex-grow'] = used['flex-shrink'] = used['flex-basis'] = 1;
    }

    // Overflow
    if (props['overflow-x'] !== undefined && props['overflow-y'] !== undefined) {
      result['overflow'] = (props['overflow-x'] === props['overflow-y'])
        ? props['overflow-x'] : props['overflow-x'] + ' ' + props['overflow-y'];
      used['overflow-x'] = used['overflow-y'] = 1;
    }

    // Gap
    if (props['row-gap'] !== undefined && props['column-gap'] !== undefined) {
      result['gap'] = (props['row-gap'] === props['column-gap'])
        ? props['row-gap'] : props['row-gap'] + ' ' + props['column-gap'];
      used['row-gap'] = used['column-gap'] = 1;
    }

    // Inset
    if (props['top'] !== undefined && props['right'] !== undefined &&
        props['bottom'] !== undefined && props['left'] !== undefined) {
      result['inset'] = collapseTRBL(props['top'], props['right'], props['bottom'], props['left']);
      used['top'] = used['right'] = used['bottom'] = used['left'] = 1;
    }

    // Text-decoration (reconstruct from longhands)
    if (props['text-decoration-line'] !== undefined) {
      var tdParts = [props['text-decoration-line']];
      if (props['text-decoration-style'] && props['text-decoration-style'] !== 'solid') {
        tdParts.push(props['text-decoration-style']);
      }
      if (props['text-decoration-color']) {
        tdParts.push(props['text-decoration-color']);
      }
      if (props['text-decoration-thickness'] && props['text-decoration-thickness'] !== 'auto') {
        tdParts.push(props['text-decoration-thickness']);
      }
      result['text-decoration'] = tdParts.join(' ');
      used['text-decoration-line'] = used['text-decoration-style'] = 1;
      used['text-decoration-color'] = used['text-decoration-thickness'] = 1;
    }
    if (props['text-decoration'] !== undefined) {
      used['text-decoration-line'] = used['text-decoration-style'] = 1;
      used['text-decoration-color'] = used['text-decoration-thickness'] = 1;
    }

    // Grid-row / grid-column (always use slash notation for correctness)
    if (props['grid-row-start'] !== undefined && props['grid-row-end'] !== undefined) {
      result['grid-row'] = props['grid-row-start'] + ' / ' + props['grid-row-end'];
      used['grid-row-start'] = used['grid-row-end'] = 1;
    }
    if (props['grid-column-start'] !== undefined && props['grid-column-end'] !== undefined) {
      result['grid-column'] = props['grid-column-start'] + ' / ' + props['grid-column-end'];
      used['grid-column-start'] = used['grid-column-end'] = 1;
    }

    for (var i = 0; i < keys.length; i++) {
      if (!used[keys[i]]) result[keys[i]] = props[keys[i]];
    }
    return result;
  }

  var elementCount = 0;
  var styleCount = 0;

  function getStyles(el, isRoot) {
    var computed = getComputedStyle(el);
    var baseline = getBaseline(el.tagName, el);
    var parentComputed = (!isRoot && el.parentElement) ? getComputedStyle(el.parentElement) : null;
    var elColor = computed.getPropertyValue('color');
    var custom = {};

    for (var i = 0; i < computed.length; i++) {
      var prop = computed.item(i);
      if (shouldSkip(prop, el)) continue;

      var value = computed.getPropertyValue(prop);
      var defaultValue = baseline[prop];
      if (value === defaultValue) continue;

      if (CURRENT_COLOR_PROPS[prop] && value === elColor) continue;

      if (!isRoot && INHERITED[prop] && parentComputed) {
        if (value === parentComputed.getPropertyValue(prop)) continue;
      }

      custom[prop] = value;
    }

    // Conditional drops: remove sub-properties when gating property is inactive
    var bgImage = computed.getPropertyValue('background-image');
    if (bgImage === 'none') {
      delete custom['background-position-x']; delete custom['background-position-y'];
      delete custom['background-size']; delete custom['background-repeat'];
      delete custom['background-origin']; delete custom['background-attachment'];
      delete custom['background-blend-mode'];
    }
    if (computed.getPropertyValue('outline-style') === 'none') {
      delete custom['outline-width']; delete custom['outline-color']; delete custom['outline-offset'];
    }
    if (computed.getPropertyValue('border-image-source') === 'none') {
      delete custom['border-image-slice']; delete custom['border-image-width'];
      delete custom['border-image-outset']; delete custom['border-image-repeat'];
    }
    if (computed.getPropertyValue('text-decoration-line') === 'none') {
      delete custom['text-decoration-style']; delete custom['text-decoration-color'];
      delete custom['text-decoration-thickness'];
    }

    // Context-aware drops: skip layout properties that don't apply
    var parentDisplay = el.parentElement ? getComputedStyle(el.parentElement).display : '';
    var isFlexChild = (parentDisplay === 'flex' || parentDisplay === 'inline-flex');
    var isGridChild = (parentDisplay === 'grid' || parentDisplay === 'inline-grid');
    if (!isFlexChild) {
      delete custom['flex-grow']; delete custom['flex-shrink']; delete custom['flex-basis'];
    }
    if (!isFlexChild && !isGridChild) {
      delete custom['order']; delete custom['align-self']; delete custom['justify-self'];
    }
    var elDisplay = computed.getPropertyValue('display');
    if (elDisplay !== 'grid' && elDisplay !== 'inline-grid') {
      delete custom['grid-template-rows']; delete custom['grid-template-columns'];
      delete custom['grid-template-areas']; delete custom['grid-auto-rows'];
      delete custom['grid-auto-columns']; delete custom['grid-auto-flow'];
    }
    if (elDisplay !== 'table' && elDisplay !== 'inline-table') {
      delete custom['table-layout'];
    }
    var elPosition = computed.getPropertyValue('position');
    if (elPosition === 'static') {
      delete custom['top']; delete custom['right']; delete custom['bottom']; delete custom['left'];
      delete custom['z-index'];
    }

    var reconstructed = reconstruct(custom);
    var pairs = Object.keys(reconstructed);
    styleCount += pairs.length;
    return pairs.map(function(p) { return p + ': ' + reconstructed[p]; }).join('; ');
  }

  function escDQ(s) {
    return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }

  function escText(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function isHidden(el) {
    try {
      if (el.hasAttribute && el.hasAttribute('hidden')) return true;
      var cs = getComputedStyle(el);
      if (!cs) return false;
      return cs.getPropertyValue('display') === 'none';
    } catch(e) { return false; }
  }

  function isFrameworkAttr(name) {
    if (name === 'style') return true;
    if (name.indexOf('_ng') === 0) return true;
    if (name.indexOf('ng-') === 0) return true;
    if (name.indexOf('data-v-') === 0) return true;
    if (name.indexOf('data-reactid') === 0) return true;
    if (name.indexOf('data-ember-') === 0) return true;
    if (name.indexOf('data-astro-') === 0) return true;
    if (name === 'ng-version') return true;
    return false;
  }

  function getPseudoSpan(el, pseudo) {
    try {
      var cs = getComputedStyle(el, pseudo);
      if (!cs) return '';
      var content = cs.getPropertyValue('content');
      if (!content || content === 'none' || content === 'normal') return '';
      // Extract text from content value (strip quotes, handle attr())
      var text = content;
      if (text.charAt(0) === '"' && text.charAt(text.length - 1) === '"') {
        text = text.slice(1, -1);
      }
      if (!text || text === ' ') return '';
      // Get meaningful styles for the pseudo-element
      var styles = [];
      var display = cs.getPropertyValue('display');
      if (display !== 'inline') styles.push('display: ' + display);
      var color = cs.getPropertyValue('color');
      var parentColor = getComputedStyle(el).getPropertyValue('color');
      if (color !== parentColor) styles.push('color: ' + color);
      var fw = cs.getPropertyValue('font-weight');
      var parentFw = getComputedStyle(el).getPropertyValue('font-weight');
      if (fw !== parentFw) styles.push('font-weight: ' + fw);
      var fs = cs.getPropertyValue('font-size');
      var parentFs = getComputedStyle(el).getPropertyValue('font-size');
      if (fs !== parentFs) styles.push('font-size: ' + fs);
      var mr = cs.getPropertyValue('margin-right');
      if (mr !== '0px') styles.push('margin-right: ' + mr);
      var ml = cs.getPropertyValue('margin-left');
      if (ml !== '0px') styles.push('margin-left: ' + ml);

      var styleAttr = styles.length ? " style='" + styles.join('; ') + "'" : '';
      // Add trailing space for ::before if content doesn't end with whitespace
      var suffix = (pseudo === '::before' && text.charAt(text.length - 1) !== ' ') ? ' ' : '';
      // Add leading space for ::after if content doesn't start with whitespace
      var prefix = (pseudo === '::after' && text.charAt(0) !== ' ') ? ' ' : '';
      return prefix + '<span' + styleAttr + '>' + escText(text) + '</span>' + suffix;
    } catch(e) { return ''; }
  }

  function serialize(el, isRoot, depth) {
    if (!isRoot && isHidden(el)) return '';

    elementCount++;
    var tag = el.tagName.toLowerCase();
    var parts = ['<' + tag];

    for (var i = 0; i < el.attributes.length; i++) {
      var attr = el.attributes[i];
      if (isFrameworkAttr(attr.name)) continue;
      parts.push(' ' + attr.name + '="' + escDQ(attr.value) + '"');
    }

    var inlineStyles = '';
    try { inlineStyles = getStyles(el, isRoot); } catch(e) {}
    if (inlineStyles) {
      if (inlineStyles.indexOf("'") === -1) {
        parts.push(" style='" + inlineStyles + "'");
      } else {
        parts.push(' style="' + escDQ(inlineStyles) + '"');
      }
    }

    if (VOID_TAGS[el.tagName]) {
      parts.push('>');
      return parts.join('');
    }

    parts.push('>');

    // ::before pseudo-element as real span
    var beforeSpan = getPseudoSpan(el, '::before');
    if (beforeSpan) parts.push(beforeSpan);

    if (includeChildren || isRoot) {
      for (var c = 0; c < el.childNodes.length; c++) {
        var child = el.childNodes[c];
        if (child.nodeType === 1) {
          if (includeChildren) {
            parts.push(serialize(child, false, depth + 1));
          }
        } else if (child.nodeType === 3) {
          var text = child.textContent;
          if (text.trim()) parts.push(escText(text));
        }
      }
    } else if (el.childNodes.length > 0) {
      parts.push('...');
    }

    // ::after pseudo-element as real span
    var afterSpan = getPseudoSpan(el, '::after');
    if (afterSpan) parts.push(afterSpan);

    parts.push('</' + tag + '>');
    return parts.join('');
  }

  var html;
  try {
    html = serialize($0, true, 0);
  } finally {
    if (sandbox && sandbox.parentNode) document.body.removeChild(sandbox);
  }

  return {
    html: html,
    tag: $0.tagName.toLowerCase(),
    id: $0.id || null,
    classes: $0.getAttribute('class') || null,
    elementCount: elementCount,
    styleCount: styleCount
  };
})()`;
}
