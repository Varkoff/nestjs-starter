export const formatDayDate = ({ date }: { date: Date }) => {
  return date.toLocaleDateString('fr-FR');
};

export const formatHourDate = ({ date }: { date: Date }) => {
  return date
    .toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(':', 'h');
};
export const formatDate = ({ date }: { date: Date }) => {
  return date.toLocaleTimeString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * New date may take milliseconds, therefore just multiply by 1000
 *  source: https://stackoverflow.com/questions/4631928/convert-utc-epoch-to-local-date#comment78302821_22237139
 */
export const convertEpochToDate = (epoch: number) => {
  return new Date(epoch * 1000);
};
