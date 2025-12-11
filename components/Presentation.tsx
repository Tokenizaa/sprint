import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Flag, Zap, Target, Award, RefreshCw, LayoutDashboard, Gauge } from 'lucide-react';
import { SLIDES } from '../constants';
import { SlideData, SlidePoint } from '../types';

interface PresentationProps {
  switchToTracker: () => void;
}

const STORAGE_KEY = 'allin_presentation_progress';

const Presentation: React.FC<PresentationProps> = ({ switchToTracker }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.slideIndex === 'number' && parsed.slideIndex < SLIDES.length) {
          return parsed.slideIndex;
        }
      }
    } catch (e) {
      console.error("Failed to load presentation state", e);
    }
    return 0;
  });

  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.step === 'number') {
          return parsed.step;
        }
      }
    } catch (e) {
      console.error("Failed to load step state", e);
    }
    return 0;
  });

  const [direction, setDirection] = useState(0);

  const slide = SLIDES[currentSlideIndex];
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      slideIndex: currentSlideIndex,
      step: currentStep
    }));
  }, [currentSlideIndex, currentStep]);

  
  // Efeito para scroll automático quando o step muda


  const next = () => {
    if (currentStep < slide.points.length) {
      setCurrentStep(prev => prev + 1);
    } else if (currentSlideIndex < SLIDES.length - 1) {
      setDirection(1);
      setCurrentStep(0);
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else if (currentSlideIndex > 0) {
      setDirection(-1);
      const prevSlide = SLIDES[currentSlideIndex - 1];
      setCurrentSlideIndex(prev => prev - 1);
      setCurrentStep(prevSlide.points.length);
    }
  };

  const restart = () => {
    setDirection(-1);
    setCurrentSlideIndex(0);
    setCurrentStep(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, currentStep]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      rotateY: direction > 0 ? 15 : -15, // 3D effect
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.05,
      rotateY: direction < 0 ? 15 : -15,
    }),
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col bg-race-dark text-white font-sans">
      
      {/* Global Background Elements */}
      <div className="absolute inset-0 bg-carbon-pattern opacity-40 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-race-navy via-transparent to-race-dark opacity-80 pointer-events-none"></div>
      
      {/* Slide Area */}
      <div className="flex-1 relative z-10 overflow-hidden perspective-1000" onClick={next}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlideIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="absolute inset-0 w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
             {/* Background Dynamic Shapes */}
            <BackgroundDecor layout={slide.layout} />

            {/* Layouts now handle scrolling internally */}
            {slide.layout === 'cover' && <CoverLayout slide={slide} />}
            {slide.layout === 'standard' && <StandardLayout slide={slide} currentStep={currentStep} />}
            {slide.layout === 'columns' && <ColumnsLayout slide={slide} currentStep={currentStep} />}
            {slide.layout === 'conclusion' && (
              <ConclusionLayout 
                slide={slide} 
                onRestart={restart} 
                onGoToTracker={switchToTracker} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Racing Footer */}
      <div className="h-16 md:h-20 bg-race-carbon border-t-2 border-race-yellow/20 flex justify-between items-center px-4 md:px-6 relative z-30 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        
        {/* Progress Line */}
        <div className="absolute top-[-2px] left-0 h-[2px] bg-race-yellow shadow-[0_0_15px_#FAFF00] transition-all duration-500 ease-out" 
             style={{ width: `${((currentSlideIndex + 1) / SLIDES.length) * 100}%` }} 
        />

        <div className="flex items-center gap-4 text-gray-500">
           <div className="flex gap-1.5 skew-x-[-12deg]">
              {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className={`w-2 h-2 md:w-3 md:h-3 ${i === 0 ? 'bg-race-red' : (i === 1 ? 'bg-race-yellow' : 'bg-race-green')} animate-pulse rounded-sm`}></div>
              ))}
           </div>
           <span className="text-[10px] md:text-xs font-display font-bold uppercase tracking-widest hidden md:inline text-white/50">Telemetria de Vendas v2.5</span>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="hover:text-race-yellow transition-colors p-2 active:scale-90">
            <ChevronLeft size={24} className="md:w-8 md:h-8" />
          </button>
          
          <div className="flex flex-col items-center">
             <span className="text-2xl md:text-3xl font-display font-black italic text-race-yellow tracking-tighter leading-none">
                {(currentSlideIndex + 1).toString().padStart(2, '0')}
             </span>
             <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Lap {SLIDES.length}</span>
          </div>

          <button onClick={(e) => { e.stopPropagation(); next(); }} className="hover:text-race-yellow transition-colors p-2 active:scale-90">
            <ChevronRight size={24} className="md:w-8 md:h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

const BackgroundDecor = ({ layout }: { layout: string }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
     {/* Speed Lines */}
     <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
     <div className="absolute bottom-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
     
     <div className="absolute top-0 right-[-15%] w-[50%] h-full bg-race-yellow/5 -skew-x-12 border-l border-white/5 mix-blend-overlay"></div>
     
     {layout === 'cover' && (
       <>
         <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-race-navy to-transparent"></div>
         <div className="absolute inset-0 bg-speed-lines opacity-10"></div>
       </>
     )}
  </div>
);

const CoverLayout = ({ slide }: { slide: SlideData }) => (
  <div className="w-full h-full overflow-y-auto custom-scrollbar">
    <div className="min-h-full flex flex-col items-center justify-center p-8 text-center relative z-10 pb-32">
      <motion.div
        initial={{ scale: 3, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="mb-12 relative"
      >
        <div className="relative z-10 bg-race-yellow p-6 rounded-full shadow-[0_0_60px_rgba(250,255,0,0.4)]">
          <Flag size={64} className="text-race-dark md:w-[80px] md:h-[80px]" strokeWidth={2.5} />
        </div>
        <div className="absolute inset-0 bg-race-yellow blur-xl opacity-50 animate-pulse"></div>
      </motion.div>
      
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-black uppercase italic tracking-tighter mb-4 text-white drop-shadow-2xl">
          {slide.title}
        </h1>
        {/* Decorative underline */}
        <div className="h-2 w-full bg-gradient-to-r from-transparent via-race-yellow to-transparent skew-x-[-20deg]"></div>
      </motion.div>

      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-xl md:text-3xl font-display font-bold tracking-widest text-race-silver uppercase"
      >
        {slide.subtitle}
      </motion.p>

      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs md:text-sm text-race-yellow font-mono font-bold tracking-[0.2em] border border-race-yellow/30 px-4 py-2 rounded-full"
      >
          PRESS START
      </motion.div>
    </div>
  </div>
);

const PointItem = React.forwardRef<HTMLDivElement, { point: SlidePoint; index: number; visible: boolean }>(({ point, index, visible }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 100, skewX: -10 }}
      animate={visible ? { opacity: 1, x: 0, skewX: 0 } : { opacity: 0, x: 100, skewX: -10 }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
      className={`relative p-5 md:p-6 mb-4 border-l-[6px] bg-gradient-to-r from-white/5 to-transparent backdrop-blur-md group overflow-hidden
        ${point.highlight 
          ? 'border-race-yellow bg-race-yellow/5' 
          : 'border-race-carbon hover:border-race-yellow hover:bg-white/5'}
        }`}
    >
      {/* Background Accent */}
      <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-black/50 to-transparent skew-x-[-20deg]"></div>

      <div className="flex items-start gap-5 relative z-10">
        <div className={`
            w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-display font-black italic text-lg md:text-xl skew-x-[-10deg] shadow-xl shrink-0 border-2
            ${point.highlight ? 'bg-race-yellow text-race-dark border-race-yellow' : 'bg-transparent text-gray-500 border-gray-700 group-hover:text-white group-hover:border-race-yellow'}
        `}>
          <span className="skew-x-[10deg]">{index + 1}</span>
        </div>
        <div>
           <h3 className={`text-xl md:text-2xl font-display font-black italic uppercase mb-2 leading-none ${point.highlight ? 'text-race-yellow' : 'text-white'}`}>
             {point.title}
           </h3>
           <p className="text-sm md:text-base text-gray-300 font-medium leading-relaxed">
             {point.description}
           </p>
        </div>
      </div>
    </motion.div>
  );
});

const StandardLayout = ({ slide, currentStep }: { slide: SlideData, currentStep: number }) => {
  const pointRefs = useRef<HTMLDivElement[]>([]);
  
  // Função para verificar se é dispositivo móvel
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  // Função para scroll automático para o último item visível
  const scrollToLastVisiblePoint = () => {
    if (!isMobile() || pointRefs.current.length === 0) return;
    
    const lastIndex = currentStep - 1;
    if (lastIndex >= 0 && pointRefs.current[lastIndex]) {
      pointRefs.current[lastIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Efeito para scroll automático quando o step muda
  useEffect(() => {
    // Pequeno delay para garantir que a animação tenha terminado
    const timer = setTimeout(() => {
      scrollToLastVisiblePoint();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentStep]);
  
  return (
    <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
      <div className="min-h-full flex flex-col md:flex-row p-6 md:p-12 pb-32 relative z-10 gap-10">
        {/* Left: Title Area */}
        <div className="md:w-1/3 flex flex-col justify-center shrink-0">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="inline-block p-4 bg-race-yellow text-race-dark skew-x-[-10deg] mb-8 shadow-[0_0_30px_rgba(250,255,0,0.3)]">
              <Zap size={32} className="skew-x-[10deg]" fill="currentColor" />
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-black uppercase italic leading-[0.85] text-white tracking-tighter mb-6 drop-shadow-lg">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <div className="pl-6 border-l-4 border-race-yellow">
                <p className="text-xl text-gray-400 font-display font-bold uppercase tracking-wide leading-tight">
                  {slide.subtitle}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right: Points */}
        <div className="md:w-2/3 flex flex-col justify-center">
          <div className="space-y-3">
            {slide.points.map((point, index) => (
              <PointItem 
                ref={(el) => { if (el) pointRefs.current[index] = el; }}
                key={index} 
                point={point} 
                index={index} 
                visible={currentStep > index} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ColumnsLayout = ({ slide, currentStep }: { slide: SlideData, currentStep: number }) => {
  const pointRefs = useRef<HTMLDivElement[]>([]);
  
  // Função para verificar se é dispositivo móvel
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  // Função para scroll automático para o último item visível
  const scrollToLastVisiblePoint = () => {
    if (!isMobile() || pointRefs.current.length === 0) return;
    
    const lastIndex = currentStep - 1;
    if (lastIndex >= 0 && pointRefs.current[lastIndex]) {
      pointRefs.current[lastIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Efeito para scroll automático quando o step muda
  useEffect(() => {
    // Pequeno delay para garantir que a animação tenha terminado
    const timer = setTimeout(() => {
      scrollToLastVisiblePoint();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentStep]);
  
  return (
    <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
      <div className="min-h-full flex flex-col px-6 py-10 md:px-16 pb-32 relative z-10">
        <div className="mb-12 text-center shrink-0">
          <motion.h2 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-display font-black uppercase italic tracking-tighter text-white mb-4"
          >
            {slide.title}
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '150px' }}
            className="h-2 bg-race-yellow mx-auto skew-x-[-20deg]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto w-full content-center flex-1">
          {slide.points.map((point, index) => (
            <motion.div
                key={index}
                ref={(el) => { if (el) pointRefs.current[index] = el; }}
                initial={{ opacity: 0, y: 50 }}
                animate={currentStep > index 
                  ? { opacity: 1, y: 0 } 
                  : { opacity: 0, y: 50 }
                }
                transition={{ duration: 0.4 }}
                className="group relative bg-race-carbon border border-white/10 p-8 hover:border-race-yellow/50 transition-colors overflow-hidden flex flex-col shadow-2xl"
            >
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 skew-x-[-10deg] translate-x-8 -translate-y-8 group-hover:bg-race-yellow group-hover:text-race-dark transition-colors flex items-end justify-start pl-3 pb-3">
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-baseline mb-6 border-b border-white/10 pb-4">
                        <h3 className="text-2xl md:text-3xl font-display font-black italic uppercase text-white group-hover:text-race-yellow transition-colors">
                            {point.title}
                        </h3>
                        <div className="text-4xl md:text-5xl font-display font-black text-white/5 group-hover:text-white/10 transition-colors italic">
                            0{index + 1}
                        </div>
                    </div>
                    <p className="text-lg text-gray-400 group-hover:text-gray-200 leading-relaxed font-medium">
                    {point.description}
                    </p>
                </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ConclusionLayout = ({ slide, onRestart, onGoToTracker }: any) => (
  <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
    <div className="min-h-full flex flex-col items-center justify-center p-6 md:p-8 pb-32 relative z-10 text-center">
      
      {/* Icon Area */}
      <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mb-8 p-8 bg-race-yellow text-race-dark rounded-full shadow-[0_0_100px_rgba(250,255,0,0.3)] relative"
        >
          <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>
          <Target size={64} className="md:w-[80px] md:h-[80px]" strokeWidth={2.5} />
        </motion.div>

        {/* Title Area - simplified, no cards */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl lg:text-9xl font-display font-black uppercase italic tracking-tighter text-white mb-6 drop-shadow-2xl"
        >
          {slide.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-gray-400 font-display font-bold uppercase tracking-widest mb-12 max-w-2xl"
        >
          {slide.subtitle}
        </motion.p>

        {/* Action Buttons - Immediately Visible */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-6 w-full max-w-lg mx-auto"
        >
          <button
            onClick={(e) => { e.stopPropagation(); onGoToTracker(); }}
            className="flex-1 group px-8 py-5 bg-race-yellow text-race-dark font-display font-black text-xl hover:bg-white hover:scale-105 shadow-[0_0_50px_rgba(250,255,0,0.3)] transition-all uppercase tracking-wider italic skew-x-[-10deg] relative overflow-hidden"
          >
              <div className="absolute inset-0 bg-white/50 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
              <span className="skew-x-[10deg] flex items-center justify-center gap-3"><Gauge size={24} /> ACESSAR PAINEL</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onRestart(); }}
            className="flex-1 px-8 py-5 bg-transparent border-2 border-white/20 text-white font-display font-bold text-lg hover:border-white hover:bg-white/5 transition-all uppercase tracking-wider skew-x-[-10deg]"
          >
            <span className="skew-x-[10deg] flex items-center justify-center gap-2"><RefreshCw size={20} /> Reiniciar</span>
          </button>
        </motion.div>
    </div>
  </div>
);

export default Presentation;