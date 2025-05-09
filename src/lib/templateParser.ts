export const parseTemplate = (
  template: string,
  variables: Record<string, string>
) => {
  return Object.entries(variables).reduce(
    (acc, [key, value]) =>
      acc.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value),
    template
  );
};
