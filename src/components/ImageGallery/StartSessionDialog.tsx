'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SessionDefinition, TimerMode } from '../SessionSetupPanel';
import { useSessionStore } from '@/lib/store/session';
import { useRouter } from 'next/navigation';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  imageId: string;
}

export default function StartSessionDialog({ open, setOpen, imageId }: Props) {
  const router = useRouter();
  const [timerMode, setTimerMode] = useState(TimerMode.Custom);
  const [duration, setDuration] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const onStart = () => {
    const totalSeconds =
      duration.hours * 3600 + duration.minutes * 60 + duration.seconds;

    const sessionConfig: SessionDefinition = {
      timePerImage: totalSeconds,
      numberOfImages: 1,
      imageId: imageId,
      timerMode,
    };

    useSessionStore.getState().setConfig(sessionConfig);
    router.push('/session');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Drawing Session</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup
            defaultValue={TimerMode.Countup}
            value={timerMode}
            onValueChange={(mode: TimerMode) => setTimerMode(mode)}
            className="space-y-4"
          >
            <div>
              <RadioGroupItem
                value={TimerMode.Countup}
                id={TimerMode.Countup}
              />
              <Label htmlFor={TimerMode.Countup} className="ml-2">
                ⏱ Start timer (counting up)
              </Label>
            </div>

            <div>
              <RadioGroupItem value={TimerMode.Custom} id={TimerMode.Custom} />
              <Label htmlFor={TimerMode.Custom} className="ml-2">
                Set a custom duration:
              </Label>

              {timerMode === TimerMode.Custom && (
                <div className="mt-2 flex gap-2">
                  <div className="flex w-24 flex-col">
                    <Label htmlFor="hours">Hours</Label>
                    <Input
                      id="hours"
                      type="number"
                      min="0"
                      value={duration.hours}
                      onChange={(e) =>
                        setDuration((d) => ({ ...d, hours: +e.target.value }))
                      }
                    />
                  </div>
                  <div className="flex w-24 flex-col">
                    <Label htmlFor="minutes">Minutes</Label>
                    <Input
                      id="minutes"
                      type="number"
                      min="0"
                      max="59"
                      value={duration.minutes}
                      onChange={(e) =>
                        setDuration((d) => ({
                          ...d,
                          minutes: +e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex w-24 flex-col">
                    <Label htmlFor="seconds">Seconds</Label>
                    <Input
                      id="seconds"
                      type="number"
                      min="0"
                      max="59"
                      value={duration.seconds}
                      onChange={(e) =>
                        setDuration((d) => ({
                          ...d,
                          seconds: +e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </RadioGroup>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={onStart}>Start</Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
