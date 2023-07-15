import { set } from 'date-fns';
import {
  convertEpochToDate,
  formatDate,
  formatDayDate,
  formatHourDate,
} from './date-utils';

describe('Date should be correctly formatted', () => {
  beforeAll(() => {
    const todayAtMidday = set(new Date(), {
      hours: 12,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      date: 12,
      month: 0,
      year: 2019,
    });
    jest.useFakeTimers({
      now: todayAtMidday.getTime(),
    });
  });

  it('Should format date correctly', () => {
    const date = new Date();
    expect(formatDayDate({ date })).toMatchInlineSnapshot(`"12/01/2019"`);
  });

  it('Should format hour correctly', () => {
    const date = new Date();
    expect(formatHourDate({ date })).toEqual('12h00');
    expect(formatHourDate({ date })).toMatchInlineSnapshot(`"12h00"`);
  });

  it('Should format hour correctly', () => {
    const date = new Date();
    expect(formatDate({ date })).toMatchInlineSnapshot(
      `"12 janvier 2019 à 12:00"`,
    );
  });

  it('Should format epoch time correctly', () => {
    expect(
      convertEpochToDate(1685608411).toLocaleDateString(),
    ).toMatchInlineSnapshot(`"6/1/2023"`);
  });
});
