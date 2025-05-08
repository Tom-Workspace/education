"use client";

import { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Refs for animation elements
  const containerRef = useRef(null);
  const animateRef = useRef(null);
  const animate2Ref = useRef(null);
  
  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: '/' });
      // Note: Google provider redirects automatically,
      // so we don't need to handle success state here
    } catch (error) {
      setError('An error occurred during Google login');
      console.error('Google login error:', error);
      setLoading(false);
    }
  };

  // Enhanced animation effects with refs
  useEffect(() => {
    // Add boxicons CSS
    const link = document.createElement('link');
    link.href = 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Enhanced animation for the container
    if (containerRef.current) {
      containerRef.current.classList.add('opacity-0');
      setTimeout(() => {
        containerRef.current.classList.remove('opacity-0');
        containerRef.current.classList.add('opacity-100');
        containerRef.current.classList.add('animate-fadeIn');
      }, 200);
    }
    
    // Set up infinite animations for background elements
    if (animateRef.current && animate2Ref.current) {
      // Initial setup
      animateRef.current.style.transform = 'rotate(30deg) skewY(40deg)';
      animate2Ref.current.style.transform = 'rotate(0deg) skewY(0deg)';
      
      // Create infinite animation function
      const animateBackground = () => {
        // Second element animation - more fluid wave-like motion
        const animate2Keyframes = [
          { transform: 'rotate(0deg) skewY(0deg) translateY(0) translateX(0)', opacity: 0.7 },
          { transform: 'rotate(-5deg) skewY(-5deg) translateY(-15px) translateX(15px)', opacity: 0.9 },
          { transform: 'rotate(-2deg) skewY(-2deg) translateY(-5px) translateX(25px)', opacity: 0.8 },
          { transform: 'rotate(0deg) skewY(0deg) translateY(0) translateX(0)', opacity: 0.7 }
        ];
        
        const animate2Timing = {
          duration: 12000,
          iterations: Infinity,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          direction: 'alternate'
        };
        
        // Start animations for the second element
        animate2Ref.current.animate(animate2Keyframes, animate2Timing);
      };
      
      // Start the infinite animations
      animateBackground();
      
      // Add shimmer effect to the container
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.classList.add('shimmer-effect');
        }
      }, 500);
    }
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-midNight-950 font-sans relative overflow-hidden">
      {/* Advanced Background stars effect with shooting stars */}
      <div className="stars-container absolute inset-0 z-0">
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
      </div>
      
      {/* Advanced floating particles with particle trails */}
      <div className="absolute w-4 h-4 rounded-full bg-gradient-to-br from-[#0ef] to-[#11baf0] opacity-30 blur-sm top-1/4 left-1/4 animate-float particle-trail" style={{animationDelay: '0s'}}></div>
      <div className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-[#0ef] to-[#11baf0] opacity-20 blur-sm top-1/3 left-1/3 animate-float-slow particle-trail" style={{animationDelay: '1s'}}></div>
      <div className="absolute w-5 h-5 rounded-full bg-gradient-to-br from-[#0ef] to-[#11baf0] opacity-25 blur-sm top-2/3 left-1/5 animate-float particle-trail" style={{animationDelay: '2s'}}></div>
      <div className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-[#0ef] to-[#11baf0] opacity-30 blur-sm top-1/2 left-2/3 animate-float-slow particle-trail" style={{animationDelay: '1.5s'}}></div>
      <div className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-[#0ef] to-[#11baf0] opacity-15 blur-sm top-3/4 left-3/4 animate-float particle-trail" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute w-4 h-4 rounded-full bg-gradient-to-br from-[#0ef] to-[#11baf0] opacity-20 blur-sm top-1/5 right-1/4 animate-float-slow particle-trail" style={{animationDelay: '2.5s'}}></div>
      <div className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-[#0ef] to-[#11baf0] opacity-25 blur-sm bottom-1/4 right-1/3 animate-float particle-trail" style={{animationDelay: '1.2s'}}></div>
      <div className="absolute w-5 h-5 rounded-full bg-gradient-to-br from-[#0ef] to-[#11baf0] opacity-15 blur-sm bottom-1/3 right-1/5 animate-float-slow particle-trail" style={{animationDelay: '0.8s'}}></div>
      <div className="absolute w-7 h-7 rounded-full bg-gradient-to-br from-[#0ef] to-[#11baf0] opacity-10 blur-sm bottom-1/2 right-1/2 animate-float particle-trail" style={{animationDelay: '3s'}}></div>
      <div className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-[#0ef] to-[#11baf0] opacity-20 blur-sm top-1/6 left-1/6 animate-float-slow particle-trail" style={{animationDelay: '1.8s'}}></div>
      
      {/* Holographic background effect */}
      <div className="absolute inset-0 holographic opacity-20 z-0"></div>
      
      {/* Main container with neon glow effect */}
      <div 
        ref={containerRef}
        className="relative w-[600px] h-[500px] rounded-[20px] border-2 border-[#0ef] shadow-[0_0_25px_#0ef] overflow-hidden bg-transparent backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_35px_rgba(0,238,255,0.6)] animate-border-glow z-10 shimmer-effect neon-glow liquid-animation"
      >
        {/* Notification messages */}
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 text-white px-4 py-2 rounded-md min-w-[200px] text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500/90 text-white px-4 py-2 rounded-md min-w-[200px] text-center">
            {success}
          </div>
        )}
        
        {/* Animated spans with advanced effects */}
        <span 
          ref={animateRef}
          className="absolute top-[-4px] right-0 w-[1000px] h-[700px] bg-gradient-to-tr from-midNight-950 via-[rgba(0,50,100,0.3)] to-primSky-500 border-b-[3px] border-[#0ef] transform origin-bottom-right animate-diagonal-move shadow-lg backdrop-blur-sm"
        ></span>
        <span 
          // ref={animate2Ref}
          className="absolute top-full left-[150px] w-[00px] h-[1000px] bg-gradient-to-b from-midNight-950 to-[rgba(0,50,100,0.2)] border-t-[3px] border-[#0ef] transform origin-bottom-left animate-wave shadow-lg backdrop-blur-sm"
        ></span>

        {/* Login Box with enhanced effects */}
        <div className="absolute inset-0 flex flex-col justify-center items-center px-[40px] text-center z-20">
          {/* Animated title with neon effect */}
          <h2 className="text-4xl text-white font-bold mb-8 tracking-widest relative">
            <span className="absolute inset-0 text-[#0ef] blur-[2px] animate-pulse-slow opacity-70">login</span>
            <span className="relative animate-pulse-slow">login</span>
          </h2>
          
          <div className="w-full flex flex-col items-center justify-center backdrop-blur-sm bg-midNight-950/10 p-6 rounded-xl">
            <div className="mb-6 text-center">
              <p className="text-white text-lg mb-1 animate-fadeIn tracking-wider" style={{animationDelay: '0.3s'}}>Hello, my name is</p>
              <p className="text-white text-lg mb-1 animate-fadeIn tracking-wider" style={{animationDelay: '0.6s'}}>Ahmed. I'm a web</p>
              <p className="text-white text-lg mb-6 animate-fadeIn tracking-wider" style={{animationDelay: '0.9s'}}>developer</p>
            </div>
            
            {/* Enhanced Google sign-in button */}
            <button 
              type="button" 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center w-full h-[50px] rounded-[10px] transition-all duration-500 bg-gradient-to-r from-white via-white to-white hover:from-gray-100 hover:via-white hover:to-gray-100 text-gray-700 disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl animate-fadeIn hover:scale-105 relative overflow-hidden"
              style={{animationDelay: '1.2s'}}
            >
              {/* Advanced shimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent shimmer-overlay"></span>
              
              {/* Particle effect on hover */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 particle-trail"></span>
              
              {/* Google icon with enhanced animation */}
              <div className="relative inline-flex items-center justify-center w-8 h-8 mr-3 overflow-hidden rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
              </div>
              
              {/* Button text with enhanced typography */}
              <span className="text-lg font-medium tracking-wider transition-all duration-500 group-hover:font-bold group-hover:tracking-widest">
                {loading ? (
                  <span className="flex items-center">
                    <span className="inline-block w-4 h-4 mr-2 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
                    Signing in...
                  </span>
                ) : (
                  'Sign in with Google'
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
