export const toSelectOptions = <T extends { id: number; name: string }>(
  items: T[],
) => {
  return items.map((i) => {
    return { value: i.id, label: i.name };
  });
};
