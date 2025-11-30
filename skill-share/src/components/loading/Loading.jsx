import './Loading.css';

export default function Loading({ fullscreen = false }) {
  return (
    <div className={"ss-loading" + (fullscreen ? ' ss-loading--fullscreen' : '')} role="status" aria-live="polite">
      <div className="ss-spinner" />
    </div>
  );
}
