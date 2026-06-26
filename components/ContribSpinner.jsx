// A loading indicator built from contribution-grid-style tiles arranged in a
// fixed 2x2 square. The tiles pulse clockwise (see .contrib-loader in
// globals.css) and cycle the heatmap palette so it reads as grid cells.
const CELLS = 4;

export default function ContribSpinner() {
  return (
    <div className="contrib-loader" role="status" aria-label="Loading contributions">
      {Array.from({ length: CELLS }).map((_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}
