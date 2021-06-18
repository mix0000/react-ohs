const linkMap = new Map();

export const worker = (store, key, triggerSync) => {
  if (!linkMap.has(store)) {
    linkMap.set(store, key);
  }
  const newKey = linkMap.get(store);
  const { state, mutations } = store;

  const newMutations = Object.entries(mutations).reduce((acc, [key, fn]) => {
    const newFun = (state) => (payload) => {
      const result = fn(state, payload);
      if (result instanceof Promise) {
        result.then((res) => res !== false && triggerSync(newKey));
        result.catch((error) => {
          triggerSync(newKey);
          throw error;
        });
      } else {
        result !== false && triggerSync(newKey);
      }
    };
    acc[key] = newFun(state);
    return acc;
  }, {});

  return { state, mutations: newMutations, eventName: newKey };
};
