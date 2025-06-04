import { mapRouteResource } from "./[resource]/map";

export const supportedResources = Object.keys(mapRouteResource) as ResourceType[];

// Define the ResourceType based on the keys of mapRouteResource
export type ResourceType = keyof typeof mapRouteResource;

// Get the resource schema from the central map
export function getSchemaByResource(resource: ResourceType) {
  return mapRouteResource[resource];
}