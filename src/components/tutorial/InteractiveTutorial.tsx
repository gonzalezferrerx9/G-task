// =================================================================================================================================================================
// COMPONENTE: TUTORIAL INTERACTIVO
// =================================================================================================================================================================
'use client';

// =================================================================================================================================================================
// IMPORTACIONES
// =================================================================================================================================================================
import React, { useState, useEffect, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { type TutorialStep, type TutorialAction } from '@/lib/tutorial-steps';
import { X } from 'lucide-react';

// =================================================================================================================================================================
// PROPIEDADES DEL COMPONENTE
// =================================================================================================================================================================
interface InteractiveTutorialProps {
  steps: TutorialStep[];
  isOpen: boolean;
  onClose: () => void;
  completedAction: TutorialAction | null;
  onActionConsumed: () => void;
}

// =================================================================================================================================================================
// COMPONENTE
// =================================================================================================================================================================
export function InteractiveTutorial({ steps, isOpen, onClose, completedAction, onActionConsumed }: InteractiveTutorialProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const previousHighlightedElement = useRef<HTMLElement | null>(null);
  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
    } else {
      setPopoverOpen(false);
      if (previousHighlightedElement.current) {
        previousHighlightedElement.current.classList.remove('tutorial-highlight');
        previousHighlightedElement.current = null;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && currentStep) {
      const findElement = () => {
        const element = document.getElementById(currentStep.elementId);
        
        if (previousHighlightedElement.current) {
          previousHighlightedElement.current.classList.remove('tutorial-highlight');
        }

        if (element) {
          setTargetElement(element);
          element.classList.add('tutorial-highlight');
          element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
          previousHighlightedElement.current = element;
          setPopoverOpen(true);
          return true;
        }
        return false;
      };

      if (!findElement()) {
        let attempts = 0;
        const intervalId = setInterval(() => {
          attempts++;
          if (findElement() || attempts > 20) { 
            clearInterval(intervalId);
            if (!document.getElementById(currentStep.elementId)) {
                setTargetElement(null);
                setPopoverOpen(false);
            }
          }
        }, 100);
        return () => clearInterval(intervalId);
      }
    }
  }, [isOpen, currentStep]);

  useEffect(() => {
    if (isOpen && completedAction && currentStep && completedAction === currentStep.action) {
      onActionConsumed();
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        handleClose();
      }
    }
  }, [completedAction, isOpen, currentStep, currentStepIndex, steps.length, onActionConsumed]);

  const handleClose = () => {
    if (previousHighlightedElement.current) {
      previousHighlightedElement.current.classList.remove('tutorial-highlight');
      previousHighlightedElement.current = null;
    }
    setCurrentStepIndex(0);
    onClose();
  };
  
  if (!isOpen || !targetElement || !currentStep) {
    return null;
  }

  return (
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
            <div style={{ 
                position: 'fixed', 
                top: targetElement.getBoundingClientRect().top, 
                left: targetElement.getBoundingClientRect().left,
                width: targetElement.getBoundingClientRect().width,
                height: targetElement.getBoundingClientRect().height,
                pointerEvents: 'none'
            }} />
        </PopoverTrigger>
        <PopoverContent
          side={currentStep.side || 'bottom'}
          align={currentStep.align || 'center'}
          sideOffset={15}
          className="w-80 z-[101] shadow-2xl border-2 border-primary"
          onInteractOutside={(e) => e.preventDefault()}
        >
            <div className="space-y-4">
              <h3 className="font-bold text-lg">{currentStep.title}</h3>
              <p className="text-sm">{currentStep.description}</p>
            </div>
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </PopoverContent>
      </Popover>
  );
}
