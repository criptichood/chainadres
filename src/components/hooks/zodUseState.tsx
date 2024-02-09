//useZodState

import { useState, useMemo } from 'react';
import { ZodSchema } from 'zod';

type StateReturnType<T> = [T, (updater: (prev: T) => T) => void];

function useZodState<T>(
 schema: ZodSchema<T>,
 initialState: T
): StateReturnType<T> {
 const [state, setState] = useState<T>(initialState);

 const zodifiedState = useMemo(() => {
    try {
      schema.parse(state);
      return state;
    } catch (error) {
      return initialState;
    }
 }, [state, initialState, schema]);

 const zodifiedSetState = (updater: (prev: T) => T) => {
    setState((prev) => {
      const newState = updater(prev);
      try {
        schema.parse(newState);
        return newState;
      } catch (error) {
        return prev;
      }
    });
 };

 return [zodifiedState, zodifiedSetState];
}

export { useZodState };