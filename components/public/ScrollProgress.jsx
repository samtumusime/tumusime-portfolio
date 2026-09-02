export default function ScrollProgress() {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-transparent" aria-hidden="true">
      <div 
        id="scrollProgressBar" 
        className="h-full bg-gradient-to-r from-gold via-gold to-accent shadow-lg" 
        style={{ 
          width: '0%',
          transition: 'width 0.1s ease-out',
          boxShadow: '0 0 20px rgba(186,163,106,0.6)'
        }} 
      />
    </div>
  );
}
