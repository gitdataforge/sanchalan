import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Briefcase, Folder, DollarSign, ShieldCheck, ArrowRight, ArrowLeft, Check } from "lucide-react";

export default function Tutorial() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      id: 0,
      icon: <BookOpen size={48} className="text-brand-blue mb-6" />,
      title: "Welcome to Sanchalan",
      description: "This is the central control room for AnyAstro. Here, you will manage all company work, money, and customer records securely in one place.",
    },
    {
      id: 1,
      icon: <Briefcase size={48} className="text-brand-blue mb-6" />,
      title: "Managing Customers",
      description: "Click on 'Work' in the left menu to add new customers. You can save their names, phone numbers, and the exact date you need to call them back.",
    },
    {
      id: 2,
      icon: <Folder size={48} className="text-brand-blue mb-6" />,
      title: "Tracking Projects",
      description: "Use the 'Projects' screen to assign daily work to team members. Always set a delivery date so work is finished on time.",
    },
    {
      id: 3,
      icon: <DollarSign size={48} className="text-brand-blue mb-6" />,
      title: "Recording Money",
      description: "The 'Money' section tracks company income and expenses. Enter every payment received and every bill paid so the company cash balance is always correct.",
    },
    {
      id: 4,
      icon: <ShieldCheck size={48} className="text-status-won mb-6" />,
      title: "Keeping Data Safe",
      description: "Go to 'Settings' at the end of your workday. Click 'Save Computer Backup' to lock a secure copy of all records on this machine.",
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    setCurrentStep(0);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center pt-10">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-brand-white">Training Guide</h2>
        <p className="text-sm text-brand-silver mt-1">
          Learn how to operate the AnyAstro workspace.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-brand-card border border-brand-border rounded-lg overflow-hidden relative min-h-[400px] flex flex-col">
        
        {/* Progress Bar */}
        <div className="w-full bg-brand-elevated h-2">
          <div 
            className="bg-brand-blue h-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
          ></div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={currentStep}
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center absolute"
            >
              {tutorialSteps[currentStep].icon}
              <h3 className="text-xl font-medium text-brand-white mb-4">
                {tutorialSteps[currentStep].title}
              </h3>
              <p className="text-base text-brand-silver max-w-md leading-relaxed">
                {tutorialSteps[currentStep].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="border-t border-brand-border p-4 flex items-center justify-between bg-brand-sidebar">
          <button 
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm text-brand-silver hover:text-brand-white disabled:opacity-30 transition-colors"
          >
            <ArrowLeft size={16} />
            Previous
          </button>
          
          <div className="flex gap-2">
            {tutorialSteps.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-brand-blue' : 'bg-brand-border'}`}
              ></div>
            ))}
          </div>

          {currentStep === tutorialSteps.length - 1 ? (
            <button 
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium bg-status-won text-brand-white rounded hover:bg-opacity-90 transition-colors"
            >
              Finish
              <Check size={16} />
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium bg-brand-blue text-brand-white rounded hover:bg-brand-blueHover transition-colors"
            >
              Next
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}