import { RouteMeta } from "./meta.types";

/**
 * Represents a single node in the file-system routing tree.
 * This object acts as a container, grouping all specialized routing files
 * (page, layout, middleware) that belong to a specific URL path.
 */
export interface RouteNode {
  /**
   * A unique identifier for the route.
   */
  id: string;

  /**
   * The parsed, web-ready URL path for this route.
   * Undefined for pathless group layout wrappers (route groups with a layout).
   * @example "/users/:id"
   */
  path?: string;

  /**
   * Extracted metadata from the page or layout file.
   * This property is populated by the Core by parsing the `metadata` export.
   */
  meta?: RouteMeta;

  /**
   * The absolute file-system path to the main page component.
   */
  pagePath?: string;

  /**
   * The absolute file-system path to the layout component.
   */
  layoutPath?: string;

  /**
   * The absolute file-system path to the middleware or guard file.
   */
  middlewarePath?: string;

  /**
   * An array of nested child routes.
   */
  children?: RouteNode[];
}
