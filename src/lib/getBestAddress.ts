export const getBestAddress = (
  results: google.maps.GeocoderResult[]
): string => {
  if (!results || results.length === 0) return "Selected Location";

  // Highest priority → house level
  const priorityTypes = [
    "street_address",
    "premise",
    "subpremise",
    "establishment",
  ];

  for (const type of priorityTypes) {
    const match = results.find((r) => r.types.includes(type));
    if (match) return match.formatted_address;
  }

  // Fallback → locality
  const locality = results.find(
    (r) =>
      r.types.includes("locality") ||
      r.types.includes("sublocality") ||
      r.types.includes("administrative_area_level_2")
  );

  if (locality) return locality.formatted_address;

  // Absolute fallback
  return results[0].formatted_address;
};
