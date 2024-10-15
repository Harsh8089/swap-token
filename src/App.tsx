import Swap from './components/Swap';

function App() {
  return (
    <div className='w-screen h-screen flex justify-center items-center relative bg-black overflow-x-hidden'>
      <div className='absolute inset-0 z-0'>
        <div 
          className='absolute top-[-100px] left-0 w-full h-full'
          style={{
            background: 'radial-gradient(circle at top, rgba(147,51,234,0.3) 0%, rgba(88,28,135,0.2) 25%, rgba(0,0,0,0) 50%)',
          }}
        ></div>
      </div>
      
      {/* Main content */}
      <div className="z-10">
        <Swap />
      </div>
    </div>
  );
}

export default App;


