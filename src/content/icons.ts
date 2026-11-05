const SVG_NS = "http://www.w3.org/2000/svg";

type Attributes = Readonly<Record<string, string>>;

const STROKE: Attributes = {
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
};

function setAttributes(node: Element, attributes: Attributes): void {
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
}

/** Returns a factory, so each button gets its own SVG node without parsing markup. */
function icon(viewBox: string, paint: Attributes, d: string): () => SVGSVGElement {
  return () => {
    const svg = document.createElementNS(SVG_NS, "svg");
    setAttributes(svg, { class: "h-5 w-5", viewBox, "aria-hidden": "true", ...paint });
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    svg.append(path);
    return svg;
  };
}

export const grokIcon = icon(
  "0 0 33 32",
  { fill: "currentColor" },
  "M12.745 20.54l10.97-8.19c.539-.4 1.307-.244 1.564.38 1.349 3.288.746 7.241-1.938 9.955-2.683 2.714-6.417 3.31-9.83 1.954l-3.728 1.745c5.347 3.697 11.84 2.782 15.898-1.324 3.219-3.255 4.216-7.692 3.284-11.693l.008.009c-1.351-5.878.332-8.227 3.782-13.031L33 0l-4.54 4.59v-.014L12.743 20.544m-2.263 1.987c-3.837-3.707-3.175-9.446.1-12.755 2.42-2.449 6.388-3.448 9.852-1.979l3.72-1.737c-.67-.49-1.53-1.017-2.515-1.387-4.455-1.854-9.789-.931-13.41 2.728-3.483 3.523-4.579 8.94-2.697 13.561 1.405 3.454-.899 5.898-3.22 8.364C1.49 30.2.666 31.074 0 32l10.478-9.466",
);

export const plusIcon = icon("0 0 24 24", STROKE, "M12 5v14M5 12h14");

export const checkIcon = icon("0 0 24 24", STROKE, "M20 6 9 17l-5-5");

export const bookIcon = icon("0 0 24 24", STROKE, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20");

export const trashIcon = icon("0 0 24 24", STROKE, "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6");

export const closeIcon = icon("0 0 24 24", STROKE, "M18 6 6 18M6 6l12 12");
