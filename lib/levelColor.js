// Maps a day's contribution count to a heatmap cell color.
export function levelColor(count) {
  if (count === 0) return "#f4f2f4";
  if (count <= 3) return "#b3d1d1";
  if (count <= 7) return "#669999";
  if (count <= 14) return "#4a7a7a";
  return "#4d2b43";
}
