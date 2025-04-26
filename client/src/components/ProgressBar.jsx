export default function ProgressBar({ current, total }) {
  const percent = (current / total) * 100;
  return (
    <div style={{ width: '100%', background: '#eee', marginBottom: '20px' }}>
      <div
        style={{
          width: `${percent}%`,
          background: '#5c6bc0',
          height: '10px',
        }}></div>
    </div>
  );
}
