import Bird from './Bird';

// Loading indicator: a single bird flapping in place (reusing the flock's Bird
// sprite) where the flock will appear once the contribution data arrives.
export default function ContribSpinner() {
  return (
    <div className="contrib-loader" role="status" aria-label="Loading contributions">
      <Bird count={10} />
    </div>
  );
}
