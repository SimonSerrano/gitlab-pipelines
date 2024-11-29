/**
 * Gets the duration string from a pipeline's duration
 *
 * @param {(string | number)} duration
 * @return {string}
 */
function getDurationString(duration: string | number): string {
  const totalMs = Number.parseFloat(duration.toString()) * 1000;
  const date = new Date(totalMs);
  return date.toISOString().slice(11, 19);
}

export { getDurationString };
