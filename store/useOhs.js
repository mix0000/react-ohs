import EventEmitter from "eventemitter3";
import { useEffect, useCallback, useMemo } from "react";

import { useForceUpdate } from "../utils/useForceUpdate";

import { worker } from "./worker";

const eventCenter = new EventEmitter();

export const useOhs = (store) => {
  const uniqId = useMemo(() => Symbol(), [store]);
  const forceUpdate = useForceUpdate();

  const triggerSync = useCallback((eventName) => {
    eventCenter.emit(eventName);
  }, []);

  const { state, mutations, eventName } = useMemo(
    () => worker(store, uniqId, triggerSync),
    [store, uniqId, triggerSync]
  );

  useEffect(() => {
    eventCenter.on(eventName, forceUpdate);
    return () => {
      eventCenter.off(eventName, forceUpdate);
    };
  }, []);

  return { state, mutations };
};
