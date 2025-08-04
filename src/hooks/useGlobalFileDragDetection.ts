import { useEffect, useRef } from 'react';
import { useSetAtom } from 'jotai';
import dragginFileAtom from '@/lib/atoms/draggingFilesAtom';

export function useGlobalFileDragDetection() {
  const setDraggingFiles = useSetAtom(dragginFileAtom);
  const dragHeartbeatRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const startDragHeartbeat = () => {
      if (dragHeartbeatRef.current) clearTimeout(dragHeartbeatRef.current);
      setDraggingFiles(true);

      dragHeartbeatRef.current = setTimeout(() => {
        setDraggingFiles(false);
      }, 300); // hide if no dragover for 300ms
    };

    const handleDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files')) {
        e.preventDefault(); // allow drop
        startDragHeartbeat();
      }
    };

    const handleDrop = () => {
      if (dragHeartbeatRef.current) clearTimeout(dragHeartbeatRef.current);
      setDraggingFiles(false);
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
      if (dragHeartbeatRef.current) clearTimeout(dragHeartbeatRef.current);
    };
  }, [setDraggingFiles]);
}
