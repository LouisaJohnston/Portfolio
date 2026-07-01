// A loading indicator built from contribution-grid-style tiles: the ring of a
// 3x3 block (the 8 cells around an empty center). The tiles pulse clockwise
// (see .contrib-loader in globals.css) and cycle the heatmap palette so it
// reads as grid cells. The 5th cell is the empty center.
const CELLS = 9;
const CENTER = 4;

export default function ContribSpinner() {
  return (
    <div className="contrib-loader" role="status" aria-label="Loading contributions">
      {Array.from({ length: CELLS }).map((_, i) => (
        <span
          key={i}
          className={i === CENTER ? 'contrib-loader-gap' : undefined}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
