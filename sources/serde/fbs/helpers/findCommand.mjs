export const findCommand = async (execa = null, commandName = null) => {
  const {
    stdout,
  } = await execa('which', [commandName]);

  return stdout;
};
