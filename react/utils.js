export const camelCase = (string) => {
  return string.replace(/(?:^|[-_])(\w)/g, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
};

export const capitalize = (string) => {
  return string[0].toUpperCase() + string.slice(1);
};

export const words = (string) => {
  return string.replace(/_/g, ' ');
};

export const boolean = (value) => {
  return value ? 'True' : 'False';
};
