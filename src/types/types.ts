export interface RouteNode {
  id: string;
  path: string;
  componentPath: string;
  isLayout?: boolean;
  children?: RouteNode[];
}
