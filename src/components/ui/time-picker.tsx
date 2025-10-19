// =================================================================================================================================================================
// COMPONENTE: SELECTOR DE HORA
// =================================================================================================================================================================
'use client';

// =================================================================================================================================================================
// IMPORTACIONES
// =================================================================================================================================================================
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input } from './input';

// =================================================================================================================================================================
// PROPIEDADES DEL COMPONENTE
// =================================================================================================================================================================
interface TimePickerProps {
  value?: string;
  onChange: (value: string) => void;
}

// =================================================================================================================================================================
// COMPONENTE
// =================================================================================================================================================================
export function TimePicker({ value, onChange }: TimePickerProps) {
  const [hour, setHour] = React.useState('12');
  const [minute, setMinute] = React.useState('00');
  const [period, setPeriod] = React.useState<'AM' | 'PM'>('AM');

  React.useEffect(() => {
    if (value) {
      const [time, periodValue] = value.split(' ');
      const [h, m] = time.split(':');
      setHour(h);
      setMinute(m);
      setPeriod(periodValue as 'AM' | 'PM');
    }
  }, [value]);

  const triggerChange = (h: string, m: string, p: 'AM' | 'PM') => {
    onChange(`${h}:${m} ${p}`);
  };

  const handleHourBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let newHour = parseInt(e.target.value, 10);
    if (isNaN(newHour)) newHour = 12;
    if (newHour < 1) newHour = 1;
    if (newHour > 12) newHour = 12;
    const formattedHour = newHour.toString().padStart(2, '0');
    setHour(formattedHour);
    triggerChange(formattedHour, minute, period);
  };
  
  const handleMinuteBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let newMinute = parseInt(e.target.value, 10);
    if (isNaN(newMinute)) newMinute = 0;
    if (newMinute < 0) newMinute = 0;
    if (newMinute > 59) newMinute = 59;
    const formattedMinute = newMinute.toString().padStart(2, '0');
    setMinute(formattedMinute);
    triggerChange(hour, formattedMinute, period);
  };

  const handlePeriodChange = (newPeriod: 'AM' | 'PM') => {
    setPeriod(newPeriod);
    triggerChange(hour, minute, newPeriod);
  };

  return (
    <div className="p-4">
      <p className="text-sm text-muted-foreground mb-2">INTRODUCE LA HORA</p>
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center">
          <Input
            type="text"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            onBlur={handleHourBlur}
            className="w-16 h-14 text-center text-2xl font-bold border-accent border-2 focus:ring-accent"
            maxLength={2}
          />
          <span className="text-xs text-muted-foreground mt-1">Hora</span>
        </div>
        <span className="text-2xl font-bold">:</span>
        <div className="flex flex-col items-center">
          <Input
            type="text"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            onBlur={handleMinuteBlur}
            className="w-16 h-14 text-center text-2xl font-bold bg-secondary"
            maxLength={2}
          />
          <span className="text-xs text-muted-foreground mt-1">Minuto</span>
        </div>
        <div className="flex flex-col space-y-1">
          <Button
            variant={period === 'AM' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => handlePeriodChange('AM')}
            className={cn('w-12', period === 'AM' && 'bg-accent')}
          >
            AM
          </Button>
          <Button
            variant={period === 'PM' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => handlePeriodChange('PM')}
            className={cn('w-12', period === 'PM' && 'bg-accent')}
          >
            PM
          </Button>
        </div>
      </div>
    </div>
  );
}
